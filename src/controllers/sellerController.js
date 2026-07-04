const Seller = require('../models/Seller');
const Product = require('../models/Product');

const formatSeller = (seller) => ({
  id: seller._id,
  name: seller.name,
  slug: seller.slug,
  logoUrl: seller.logoUrl,
  experienceYears: seller.experienceYears,
  experienceLabel: `${seller.experienceYears} yillik tajriba`,
  location: seller.location,
  reliabilityScore: seller.reliabilityScore,
  reliabilityLabel: `${seller.reliabilityScore}% Ishonchlilik`,
  responseTimeSeconds: seller.responseTimeSeconds,
  responseTimeLabel: `${seller.responseTimeSeconds}s Javob vaqti`,
  isVerified: seller.isVerified,
  description: seller.description,
});

// @desc    Tasdiqlangan sotuvchilar
// @route   GET /api/sellers/verified
exports.getVerifiedSellers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    const sellers = await Seller.find({ isVerified: true })
      .sort({ reliabilityScore: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: sellers.length,
      data: sellers.map(formatSeller),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Barcha sotuvchilar
// @route   GET /api/sellers
exports.getSellers = async (req, res) => {
  try {
    const { location, page = 1, limit = 20 } = req.query;
    const query = {};

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const [sellers, total] = await Promise.all([
      Seller.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
      Seller.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: sellers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: sellers.map(formatSeller),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sotuvchi sahifasi
// @route   GET /api/sellers/:slug
exports.getSellerBySlug = async (req, res) => {
  try {
    const seller = await Seller.findOne({ slug: req.params.slug });

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Sotuvchi topilmadi' });
    }

    const products = await Product.find({ seller: seller._id })
      .populate('seller', 'name slug logoUrl isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...formatSeller(seller),
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          imageUrl: p.imageUrl,
          price: p.price,
          currency: p.currency,
          discountPercent: p.discountPercent,
          discountedPrice: p.discountedPrice,
          minOrderQuantity: p.minOrderQuantity,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
