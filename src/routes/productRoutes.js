const express = require('express');
const { body } = require('express-validator');
const {
  getTopProducts,
  getProducts,
  getProductBySlug,
} = require('../controllers/productController');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/top', getTopProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;
