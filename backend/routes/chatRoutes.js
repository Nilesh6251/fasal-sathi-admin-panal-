// ━━━ CHAT ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/chatController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/send', authenticate, ctrl.sendMessage);
router.get('/history', authenticate, ctrl.getChatHistory);
router.get('/all', authenticate, adminOnly, ctrl.getAllChats);
router.get('/analytics', authenticate, adminOnly, ctrl.getChatAnalytics);
router.delete('/user/:userId', authenticate, adminOnly, ctrl.deleteChat);

module.exports = router;
