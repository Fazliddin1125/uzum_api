const express = require('express');
const {
  getVerifiedSellers,
  getSellers,
  getSellerBySlug,
} = require('../controllers/sellerController');

const router = express.Router();

router.get('/verified', getVerifiedSellers);
router.get('/', getSellers);
router.get('/:slug', getSellerBySlug);

module.exports = router;
