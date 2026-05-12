// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUPPORT TICKET CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category, priority } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: { userId: req.user.id, subject, description, category, priority: priority || 'medium' },
    });
    return ApiResponse.created(res, ticket, 'Support ticket created.');
  } catch (error) { next(error); }
};

const getMyTickets = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({ where: { userId: req.user.id }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.supportTicket.count({ where: { userId: req.user.id } }),
    ]);
    return ApiResponse.paginated(res, tickets, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getAllTickets = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status, priority, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, phone: true } } },
      }),
      prisma.supportTicket.count({ where }),
    ]);
    return ApiResponse.paginated(res, tickets, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!ticket) return ApiResponse.notFound(res, 'Ticket not found.');
    if (ticket.userId !== req.user.id && !['SuperAdmin', 'Moderator'].includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Not authorized.');
    }
    return ApiResponse.success(res, ticket);
  } catch (error) { next(error); }
};

const replyToTicket = async (req, res, next) => {
  try {
    const { adminReply, status } = req.body;
    const data = {};
    if (adminReply) data.adminReply = adminReply;
    if (status) data.status = status;
    if (status === 'resolved') data.resolvedAt = new Date();
    const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data });
    return ApiResponse.success(res, ticket, 'Ticket updated.');
  } catch (error) { next(error); }
};

const deleteTicket = async (req, res, next) => {
  try {
    await prisma.supportTicket.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Ticket deleted.');
  } catch (error) { next(error); }
};

module.exports = { createTicket, getMyTickets, getAllTickets, getTicketById, replyToTicket, deleteTicket };
