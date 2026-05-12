// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const sendNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, imageUrl, isGlobal, data } = req.body;
    const notif = await prisma.notification.create({
      data: { userId: isGlobal ? null : userId, title, message, type: type || 'general', imageUrl, isGlobal: isGlobal || false, data: data ? JSON.stringify(data) : null },
    });
    return ApiResponse.created(res, notif, 'Notification sent.');
  } catch (error) { next(error); }
};

const sendBulkNotification = async (req, res, next) => {
  try {
    const { title, message, type, imageUrl, data, targetRole, targetState } = req.body;
    const where = {};
    if (targetRole) where.role = targetRole;
    if (targetState) where.state = targetState;
    const users = await prisma.user.findMany({ where, select: { id: true } });

    const notifications = users.map(u => ({
      userId: u.id, title, message, type: type || 'general', imageUrl, data: data ? JSON.stringify(data) : null,
    }));
    const result = await prisma.notification.createMany({ data: notifications });
    return ApiResponse.created(res, { count: result.count }, `Sent to ${result.count} users.`);
  } catch (error) { next(error); }
};

const getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { OR: [{ userId: req.user.id }, { isGlobal: true }] };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
    ]);
    return ApiResponse.paginated(res, notifications, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    return ApiResponse.success(res, null, 'Marked as read.');
  } catch (error) { next(error); }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
    return ApiResponse.success(res, null, 'All marked as read.');
  } catch (error) { next(error); }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { type } = req.query;
    const where = {};
    if (type) where.type = type;
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
    ]);
    return ApiResponse.paginated(res, notifications, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const deleteNotification = async (req, res, next) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Notification deleted.');
  } catch (error) { next(error); }
};

module.exports = { sendNotification, sendBulkNotification, getMyNotifications, markAsRead, markAllAsRead, getAllNotifications, deleteNotification };
