// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELLER MANAGEMENT CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const registerSeller = async (req, res, next) => {
  try {
    const { businessName, businessType, gstNumber, address, description } = req.body;
    const existing = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (existing) return ApiResponse.badRequest(res, 'Already registered as seller.');

    const seller = await prisma.seller.create({
      data: { userId: req.user.id, businessName, businessType, gstNumber, address, description },
    });
    await prisma.user.update({ where: { id: req.user.id }, data: { role: 'Seller' } });
    return ApiResponse.created(res, seller, 'Seller registration submitted.');
  } catch (error) { next(error); }
};

const getAllSellers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const where = {};
    if (req.query.isApproved !== undefined) where.isApproved = req.query.isApproved === 'true';
    if (req.query.search) where.businessName = { contains: req.query.search };

    const [sellers, total] = await Promise.all([
      prisma.seller.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true, phone: true } }, _count: { select: { products: true } } },
      }),
      prisma.seller.count({ where }),
    ]);
    return ApiResponse.paginated(res, sellers, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getSellerById = async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true, profileImage: true } }, products: { where: { isActive: true }, take: 20 } },
    });
    if (!seller) return ApiResponse.notFound(res, 'Seller not found.');
    return ApiResponse.success(res, seller);
  } catch (error) { next(error); }
};

const toggleApproveSeller = async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { id: req.params.id } });
    if (!seller) return ApiResponse.notFound(res, 'Seller not found.');
    const updated = await prisma.seller.update({ where: { id: req.params.id }, data: { isApproved: !seller.isApproved } });
    return ApiResponse.success(res, updated, `Seller ${updated.isApproved ? 'approved' : 'rejected'}.`);
  } catch (error) { next(error); }
};

const updateSellerProfile = async (req, res, next) => {
  try {
    const { businessName, businessType, gstNumber, address, description } = req.body;
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return ApiResponse.notFound(res, 'Seller profile not found.');
    const updated = await prisma.seller.update({ where: { id: seller.id }, data: { businessName, businessType, gstNumber, address, description } });
    return ApiResponse.success(res, updated, 'Seller profile updated.');
  } catch (error) { next(error); }
};

module.exports = { registerSeller, getAllSellers, getSellerById, toggleApproveSeller, updateSellerProfile };
