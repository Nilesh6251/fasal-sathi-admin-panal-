// ━━━ NOTIFICATION ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/notificationController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', authenticate, adminOnly, ctrl.sendNotification);
router.post('/bulk', authenticate, adminOnly, ctrl.sendBulkNotification);
router.get('/my', authenticate, ctrl.getMyNotifications);
router.put('/:id/read', authenticate, ctrl.markAsRead);
router.put('/read-all', authenticate, ctrl.markAllAsRead);
router.get('/', authenticate, adminOnly, ctrl.getAllNotifications);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteNotification);

module.exports = router;
