const express = require('express');
const { body } = require('express-validator');
const {
  getTopProducts,
  getProducts,
  getProductBySlug,
  createProduct,
} = require('../controllers/productController');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/top', getTopProducts);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Mahsulot nomi kiritilishi shart'),
    body('imageUrl').trim().notEmpty().withMessage('Rasm linki kiritilishi shart'),
    body('price').isFloat({ min: 0 }).withMessage('Narx 0 dan katta bo\'lishi kerak'),
    body('minOrderQuantity').isInt({ min: 1 }).withMessage('Minimal buyurtma kamida 1 bo\'lishi kerak'),
    body('category').trim().notEmpty().withMessage('Kategoriya kiritilishi shart'),
    body('seller').notEmpty().withMessage('Sotuvchi ID kiritilishi shart'),
    body('slug').optional().trim().notEmpty(),
    body('currency').optional().trim().notEmpty(),
    body('discountPercent').optional().isInt({ min: 0, max: 100 }),
    body('isTop').optional().isBoolean(),
    body('stock').optional().isInt({ min: 0 }),
  ],
  validate,
  createProduct
);

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;
