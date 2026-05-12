// ━━━ USER ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate, adminOnly, superAdminOnly } = require('../middleware/auth');

router.get('/', authenticate, adminOnly, ctrl.getAllUsers);
router.get('/:id', authenticate, adminOnly, ctrl.getUserById);
router.put('/:id', authenticate, adminOnly, ctrl.updateUser);
router.delete('/:id', authenticate, superAdminOnly, ctrl.deleteUser);
router.put('/:id/block', authenticate, adminOnly, ctrl.toggleBlockUser);

module.exports = router;
