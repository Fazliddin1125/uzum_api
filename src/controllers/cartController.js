const User = require('../models/User');
const Product = require('../models/Product');

const formatCartItem = (item) => {
  const product = item.product;
  return {
    productId: product._id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    price: product.price,
    currency: product.currency,
    discountPercent: product.discountPercent,
    discountedPrice: product.discountedPrice ?? product.price,
    minOrderQuantity: product.minOrderQuantity,
    quantity: item.quantity,
    subtotal: (product.discountedPrice ?? product.price) * item.quantity,
  };
};

// @desc    Savatni olish
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      populate: { path: 'seller', select: 'name isVerified' },
    });

    const items = user.cart.map(formatCartItem);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      count: items.length,
      total,
      currency: 'UZS',
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Savatga qo'shish
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    }

    if (quantity < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimal buyurtma miqdori: ${product.minOrderQuantity}`,
      });
    }

    const user = await User.findById(req.user.id);
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Mahsulot savatga qo\'shildi',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Savatdagi mahsulot miqdorini yangilash
// @route   PUT /api/cart/:productId
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Miqdor kamida 1 bo\'lishi kerak' });
    }

    const product = await Product.findById(productId);
    if (product && quantity < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimal buyurtma miqdori: ${product.minOrderQuantity}`,
      });
    }

    const user = await User.findById(req.user.id);
    const item = user.cart.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Savatda bunday mahsulot yo\'q' });
    }

    item.quantity = quantity;
    await user.save();

    res.json({ success: true, message: 'Savat yangilandi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Savatdan o'chirish
// @route   DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const initialLength = user.cart.length;

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Savatda bunday mahsulot yo\'q' });
    }

    await user.save();

    res.json({ success: true, message: 'Mahsulot savatdan o\'chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Savatni tozalash
// @route   DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.json({ success: true, message: 'Savat tozalandi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
