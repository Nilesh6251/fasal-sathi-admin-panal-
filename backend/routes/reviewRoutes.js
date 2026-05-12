// ━━━ REVIEW ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', authenticate, ctrl.createReview);
router.get('/product/:productId', ctrl.getProductReviews);
router.delete('/:id', authenticate, ctrl.deleteReview);
router.put('/:id/visibility', authenticate, adminOnly, ctrl.toggleReviewVisibility);

module.exports = router;
