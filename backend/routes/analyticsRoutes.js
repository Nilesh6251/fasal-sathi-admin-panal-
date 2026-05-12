// ━━━ ANALYTICS ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/dashboard', authenticate, adminOnly, ctrl.getDashboardStats);
router.get('/users', authenticate, adminOnly, ctrl.getUserAnalytics);
router.get('/chatbot', authenticate, adminOnly, ctrl.getChatbotAnalytics);
router.get('/sellers', authenticate, adminOnly, ctrl.getSellerAnalytics);

module.exports = router;
