// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANALYTICS CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { getDateRange } = require('../utils/helpers');

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalUsers, totalSellers, totalProducts, totalOrders, totalChats, totalSchemes, totalNews, todayUsers, todayOrders, todayChats, pendingTickets] = await Promise.all([
      prisma.user.count(),
      prisma.seller.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.chat.count(),
      prisma.governmentScheme.count(),
      prisma.newsArticle.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.chat.count({ where: { createdAt: { gte: today } } }),
      prisma.supportTicket.count({ where: { status: 'open' } }),
    ]);

    return ApiResponse.success(res, {
      totalUsers, totalSellers, totalProducts, totalOrders, totalChats, totalSchemes, totalNews,
      todayUsers, todayOrders, todayChats, pendingTickets,
    });
  } catch (error) { next(error); }
};

const getUserAnalytics = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { start } = getDateRange(period || 'month');
    const byRole = await prisma.user.groupBy({ by: ['role'], _count: { id: true } });
    const byState = await prisma.user.groupBy({ by: ['state'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 });
    const recentUsers = await prisma.user.count({ where: { createdAt: { gte: start } } });

    return ApiResponse.success(res, {
      byRole: byRole.map(r => ({ role: r.role, count: r._count.id })),
      byState: byState.map(s => ({ state: s.state || 'Unknown', count: s._count.id })),
      newUsersInPeriod: recentUsers,
    });
  } catch (error) { next(error); }
};

const getChatbotAnalytics = async (req, res, next) => {
  try {
    const totalChats = await prisma.chat.count();
    const uniqueUsers = await prisma.chat.groupBy({ by: ['userId'], _count: true });
    const byCategory = await prisma.chat.groupBy({ by: ['category'], _count: { id: true } });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayChats = await prisma.chat.count({ where: { createdAt: { gte: today } } });

    return ApiResponse.success(res, { totalChats, uniqueUsers: uniqueUsers.length, todayChats, byCategory: byCategory.map(c => ({ category: c.category || 'general', count: c._count.id })) });
  } catch (error) { next(error); }
};

const getSellerAnalytics = async (req, res, next) => {
  try {
    const totalSellers = await prisma.seller.count();
    const approved = await prisma.seller.count({ where: { isApproved: true } });
    const pending = await prisma.seller.count({ where: { isApproved: false } });
    const topSellers = await prisma.seller.findMany({ orderBy: { totalRevenue: 'desc' }, take: 10, include: { user: { select: { name: true } }, _count: { select: { products: true } } } });

    return ApiResponse.success(res, { totalSellers, approved, pending, topSellers });
  } catch (error) { next(error); }
};

module.exports = { getDashboardStats, getUserAnalytics, getChatbotAnalytics, getSellerAnalytics };
