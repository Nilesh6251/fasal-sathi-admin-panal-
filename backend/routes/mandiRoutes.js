// ━━━ MANDI BHAV ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/mandiController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/', authenticate, adminOnly, validateRequired('crop', 'market', 'district', 'state', 'minPrice', 'maxPrice', 'modalPrice'), ctrl.addMandiPrice);
router.post('/bulk', authenticate, adminOnly, ctrl.bulkAddMandiPrices);
router.get('/', ctrl.getMandiPrices);
router.get('/analytics', ctrl.getMandiPriceAnalytics);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteMandiPrice);

module.exports = router;
