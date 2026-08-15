const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/tokens');
const {
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshTokenFromRequest,
} = require('../utils/cookies');

const hashRefreshToken = async (refreshToken) => bcrypt.hash(refreshToken, 10);

const saveRefreshToken = async (userId, refreshToken) => {
  const hashed = await hashRefreshToken(refreshToken);
  await User.findByIdAndUpdate(userId, { refreshToken: hashed });
};

const formatAuthUser = (user, accessToken) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  accessToken,
});

// @desc    Ro'yxatdan o'tish
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan',
      });
    }

    const user = await User.create({ name, email, password });
    const tokens = generateTokens(user._id);
    await saveRefreshToken(user._id, tokens.refreshToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.status(201).json({
      success: true,
      data: formatAuthUser(user, tokens.accessToken),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Tizimga kirish
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri',
      });
    }

    const tokens = generateTokens(user._id);
    await saveRefreshToken(user._id, tokens.refreshToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      data: formatAuthUser(user, tokens.accessToken),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Access token yangilash (refreshToken cookie dan olinadi)
// @route   POST /api/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token topilmadi (cookie)',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh token yaroqsiz yoki muddati tugagan',
      });
    }

    if (decoded.type !== 'refresh') {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh token yaroqsiz',
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi topilmadi yoki qayta kiring',
      });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh token mos kelmadi',
      });
    }

    const tokens = generateTokens(user._id);
    await saveRefreshToken(user._id, tokens.refreshToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Chiqish
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    clearRefreshCookie(res);
    res.json({ success: true, message: 'Tizimdan chiqildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Profil ma'lumotlari
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
