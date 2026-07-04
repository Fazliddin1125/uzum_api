const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getCart);

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Mahsulot ID kiritilishi shart'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Miqdor musbat son bo\'lishi kerak'),
  ],
  validate,
  addToCart
);

router.put(
  '/:productId',
  [body('quantity').isInt({ min: 1 }).withMessage('Miqdor musbat son bo\'lishi kerak')],
  validate,
  updateCartItem
);

router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
