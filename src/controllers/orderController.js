const Order = require('../models/Order');
const Product = require('../models/Product');

const unitPrice = (product) => product.discountedPrice ?? product.price;

const formatOrder = (order) => ({
  id: order._id,
  status: order.status,
  total: order.total,
  currency: order.currency,
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    productId: item.product,
    name: item.name,
    imageUrl: item.imageUrl,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
  })),
});

const parseItems = (body) => {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));
  }

  if (body.productId) {
    return [{ productId: body.productId, quantity: Number(body.quantity || 1) }];
  }

  return [];
};

// @desc    Mening buyurtmalarim
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders.map(formatOrder),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Buyurtma berish (productId + quantity)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const rawItems = parseItems(req.body);

    if (rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'productId va quantity yuboring (yoki items massivi)',
      });
    }

    const builtItems = [];
    let total = 0;

    for (const raw of rawItems) {
      if (!raw.productId || !Number.isInteger(raw.quantity) || raw.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Har bir mahsulot uchun productId va musbat quantity kerak',
        });
      }

      const product = await Product.findById(raw.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Mahsulot topilmadi: ${raw.productId}`,
        });
      }

      if (raw.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name}: minimal buyurtma ${product.minOrderQuantity}`,
        });
      }

      const price = unitPrice(product);
      const subtotal = price * raw.quantity;
      total += subtotal;

      builtItems.push({
        product: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        price,
        quantity: raw.quantity,
        subtotal,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: builtItems,
      total,
      currency: 'UZS',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Buyurtma yaratildi',
      data: formatOrder(order),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
