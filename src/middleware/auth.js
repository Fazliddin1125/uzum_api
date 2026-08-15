const { verifyAccessToken } = require('../utils/tokens');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Kirish uchun avval tizimga kiring',
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Access token yuborilishi kerak',
      });
    }

    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token yaroqsiz yoki muddati tugagan',
    });
  }
};

module.exports = { protect };
