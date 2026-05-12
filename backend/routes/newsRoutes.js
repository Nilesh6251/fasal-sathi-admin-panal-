// ━━━ NEWS ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/newsController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { uploadNewsMedia } = require('../middleware/upload');
const { validateRequired } = require('../middleware/validate');

router.post('/', authenticate, adminOnly, uploadNewsMedia, validateRequired('title', 'content'), ctrl.createNews);
router.get('/', ctrl.getAllNews);
router.get('/:id', ctrl.getNewsById);
router.put('/:id', authenticate, adminOnly, uploadNewsMedia, ctrl.updateNews);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteNews);

module.exports = router;
