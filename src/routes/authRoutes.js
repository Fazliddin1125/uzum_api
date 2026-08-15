const express = require('express');
const { body } = require('express-validator');
const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Ism kiritilishi shart'),
    body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
    body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
    body('password').notEmpty().withMessage('Parol kiritilishi shart'),
  ],
  validate,
  login
);

router.post('/refresh', refresh);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
