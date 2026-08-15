const REFRESH_COOKIE = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
  path: '/api/auth',
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth',
  });
};

const getRefreshTokenFromRequest = (req) =>
  req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken || null;

module.exports = {
  REFRESH_COOKIE,
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshTokenFromRequest,
};
