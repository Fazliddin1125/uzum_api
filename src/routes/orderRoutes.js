const express = require('express');
const { body } = require('express-validator');
const { getOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getOrders);

router.post(
  '/',
  [
    body('productId').optional().notEmpty(),
    body('quantity').optional().isInt({ min: 1 }),
    body('items').optional().isArray(),
  ],
  validate,
  createOrder
);

module.exports = router;
