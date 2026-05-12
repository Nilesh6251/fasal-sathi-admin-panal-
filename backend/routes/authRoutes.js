// ━━━ AUTH ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRequired, validateEmail, validatePassword } = require('../middleware/validate');
const { uploadProfileImage } = require('../middleware/upload');

router.post('/signup', validateRequired('name', 'email', 'password'), validateEmail, validatePassword, ctrl.signup);
router.post('/login', validateRequired('email', 'password'), ctrl.login);
router.post('/admin-login', validateRequired('email', 'password'), ctrl.adminLogin);
router.get('/me', authenticate, ctrl.getMe);
router.put('/update-profile', authenticate, uploadProfileImage, ctrl.updateProfile);
router.put('/change-password', authenticate, validateRequired('currentPassword', 'newPassword'), ctrl.changePassword);
router.post('/logout', authenticate, ctrl.logout);

module.exports = router;
