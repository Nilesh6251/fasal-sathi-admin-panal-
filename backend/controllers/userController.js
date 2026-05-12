// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USER MANAGEMENT CONTROLLER (Admin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta, sanitizeUser } = require('../utils/helpers');

/**
 * GET /api/users
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { role, state, search, isBlocked } = req.query;

    const where = {};
    if (role) where.role = role;
    if (state) where.state = state;
    if (isBlocked !== undefined) where.isBlocked = isBlocked === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          profileImage: true, state: true, district: true, crops: true,
          isBlocked: true, isVerified: true, lastLoginAt: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return ApiResponse.paginated(res, users, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Get single user details
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        seller: true,
        _count: {
          select: {
            orders: true,
            chats: true,
            reviews: true,
            supportTickets: true,
          },
        },
      },
    });

    if (!user) {
      return ApiResponse.notFound(res, 'User not found.');
    }

    return ApiResponse.success(res, sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update user (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, role, state, district, isBlocked, isVerified } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (state !== undefined) updateData.state = state;
    if (district !== undefined) updateData.district = district;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
    });

    return ApiResponse.success(res, sanitizeUser(user), 'User updated.');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete user (SuperAdmin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'User deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id/block
 * Block/Unblock user
 */
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return ApiResponse.notFound(res, 'User not found.');

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: !user.isBlocked },
    });

    return ApiResponse.success(
      res,
      sanitizeUser(updated),
      `User ${updated.isBlocked ? 'blocked' : 'unblocked'} successfully.`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockUser,
};
