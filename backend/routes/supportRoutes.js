// ━━━ SUPPORT TICKET ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/supportController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/', authenticate, validateRequired('subject', 'description'), ctrl.createTicket);
router.get('/my', authenticate, ctrl.getMyTickets);
router.get('/', authenticate, adminOnly, ctrl.getAllTickets);
router.get('/:id', authenticate, ctrl.getTicketById);
router.put('/:id/reply', authenticate, adminOnly, ctrl.replyToTicket);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteTicket);

module.exports = router;
