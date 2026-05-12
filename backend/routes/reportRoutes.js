// ━━━ REPORT ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', authenticate, adminOnly, ctrl.generateReport);
router.get('/', authenticate, adminOnly, ctrl.getAllReports);
router.get('/:id', authenticate, adminOnly, ctrl.getReportById);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteReport);

module.exports = router;
