// ━━━ SELLER ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/sellerController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/register', authenticate, validateRequired('businessName'), ctrl.registerSeller);
router.get('/', authenticate, adminOnly, ctrl.getAllSellers);
router.get('/:id', ctrl.getSellerById);
router.put('/:id/approve', authenticate, adminOnly, ctrl.toggleApproveSeller);
router.put('/profile', authenticate, ctrl.updateSellerProfile);

module.exports = router;
