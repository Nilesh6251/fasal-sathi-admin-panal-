// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FASAL SATHI - EXPRESS SERVER
// AI-Powered Agriculture Platform Backend
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ━━━ Initialize Express ━━━
const app = express();

// ━━━ Security Middleware ━━━
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ━━━ CORS ━━━
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ━━━ Rate Limiting ━━━
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ━━━ Body Parsing ━━━
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ━━━ Logging ━━━
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  // Ensure logs directory exists
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
}

// ━━━ Static Files (Uploads) ━━━
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ━━━ Health Check ━━━
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌾 Fasal Sathi API is running!',
    version: '1.0.0',
    docs: '/api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🌾 Fasal Sathi API v1.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      sellers: '/api/sellers',
      products: '/api/products',
      orders: '/api/orders',
      chat: '/api/chat',
      schemes: '/api/schemes',
      mandi: '/api/mandi',
      news: '/api/news',
      notifications: '/api/notifications',
      weather: '/api/weather',
      reviews: '/api/reviews',
      support: '/api/support',
      analytics: '/api/analytics',
      reports: '/api/reports',
    },
  });
});

// ━━━ API Routes ━━━
app.use('/api', routes);

// ━━━ Error Handling ━━━
app.use(notFound);
app.use(errorHandler);

// ━━━ Start Server ━━━
const PORT = config.port;
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌾 Fasal Sathi Backend Server`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`📊 API Docs: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = app;
