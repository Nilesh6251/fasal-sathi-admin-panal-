// ━━━ ORDER ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', authenticate, ctrl.createOrder);
router.get('/my', authenticate, ctrl.getMyOrders);
router.get('/', authenticate, adminOnly, ctrl.getAllOrders);
router.get('/:id', authenticate, ctrl.getOrderById);
router.put('/:id/status', authenticate, adminOnly, ctrl.updateOrderStatus);

module.exports = router;
