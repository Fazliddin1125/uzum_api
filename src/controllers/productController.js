const Product = require('../models/Product');

const formatProduct = (product) => {
  const p = product.toObject ? product.toObject() : product;
  const seller = p.seller;

  return {
    id: p._id,
    name: p.name,
    slug: p.slug,
    imageUrl: p.imageUrl,
    price: p.price,
    currency: p.currency,
    discountPercent: p.discountPercent,
    discountedPrice: p.discountedPrice ?? p.price,
    minOrderQuantity: p.minOrderQuantity,
    category: p.category,
    isTop: p.isTop,
    stock: p.stock,
    seller: seller
      ? {
          id: seller._id,
          name: seller.name,
          slug: seller.slug,
          logoUrl: seller.logoUrl,
          isVerified: seller.isVerified,
        }
      : null,
    isVerifiedSeller: seller?.isVerified ?? false,
  };
};

// @desc    Top mahsulotlarni olish
// @route   GET /api/products/top
exports.getTopProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    const products = await Product.find({ isTop: true })
      .populate('seller', 'name slug logoUrl isVerified')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      data: products.map(formatProduct),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Barcha mahsulotlar (qidiruv va filtr bilan)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, seller, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (seller) {
      query.seller = seller;
    }

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('seller', 'name slug logoUrl isVerified')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products.map(formatProduct),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bitta mahsulot
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'seller',
      'name slug logoUrl experienceYears location reliabilityScore responseTimeSeconds isVerified description'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    }

    res.json({ success: true, data: formatProduct(product) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
