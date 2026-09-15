const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const productRoutes = require('./routes/productRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { protect } = require('./middleware/auth');
const { getMe } = require('./controllers/authController');

const app = express();

// CORS hammaga ochiq — istalgan frontend GET/POST qila oladi
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Minibaba API ishlayapti' });
});

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Minibaba API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/me', protect, getMe);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Marshrut topilmadi' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server xatosi' });
});

module.exports = app;
