// ━━━ WEATHER ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/weatherController');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/', optionalAuth, validateRequired('city'), ctrl.logWeather);
router.get('/', ctrl.getWeatherLogs);
router.get('/alerts', ctrl.getWeatherAlerts);

module.exports = router;
