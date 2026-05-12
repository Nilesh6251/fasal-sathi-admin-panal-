// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CENTRAL ROUTE INDEX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/sellers', require('./sellerRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/chat', require('./chatRoutes'));
router.use('/schemes', require('./schemeRoutes'));
router.use('/mandi', require('./mandiRoutes'));
router.use('/news', require('./newsRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/weather', require('./weatherRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/support', require('./supportRoutes'));
router.use('/analytics', require('./analyticsRoutes'));
router.use('/reports', require('./reportRoutes'));

module.exports = router;
