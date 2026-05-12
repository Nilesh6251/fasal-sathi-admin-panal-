// ━━━ GOVERNMENT SCHEME ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/schemeController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { uploadSchemePdf } = require('../middleware/upload');
const { validateRequired } = require('../middleware/validate');

router.post('/', authenticate, adminOnly, uploadSchemePdf, validateRequired('title', 'description'), ctrl.createScheme);
router.get('/', ctrl.getAllSchemes);
router.get('/:id', ctrl.getSchemeById);
router.put('/:id', authenticate, adminOnly, uploadSchemePdf, ctrl.updateScheme);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteScheme);

module.exports = router;
