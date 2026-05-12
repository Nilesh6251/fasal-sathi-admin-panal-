// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARKETPLACE (PRODUCT) CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createProduct = async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return ApiResponse.forbidden(res, 'Register as seller first.');
    if (!seller.isApproved) return ApiResponse.forbidden(res, 'Seller not approved yet.');

    const { name, description, price, mrp, category, subCategory, stock, unit, brand, discount } = req.body;
    let images = null;
    if (req.files && req.files.length > 0) {
      images = JSON.stringify(req.files.map(f => `/uploads/images/${f.filename}`));
    }

    const product = await prisma.product.create({
      data: { sellerId: seller.id, name, description, price: parseFloat(price), mrp: mrp ? parseFloat(mrp) : null, category, subCategory, images, stock: parseInt(stock) || 0, unit, brand, discount: discount ? parseFloat(discount) : 0 },
    });
    return ApiResponse.created(res, product, 'Product created.');
  } catch (error) { next(error); }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (search) where.name = { contains: search };
    if (minPrice || maxPrice) { where.price = {}; if (minPrice) where.price.gte = parseFloat(minPrice); if (maxPrice) where.price.lte = parseFloat(maxPrice); }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit, orderBy,
        include: { seller: { include: { user: { select: { name: true, state: true } } } } },
      }),
      prisma.product.count({ where }),
    ]);
    return ApiResponse.paginated(res, products, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id },
      include: { seller: { include: { user: { select: { name: true, profileImage: true } } } }, reviews: { include: { user: { select: { name: true, profileImage: true } } }, take: 10 } },
    });
    if (!product) return ApiResponse.notFound(res, 'Product not found.');
    return ApiResponse.success(res, product);
  } catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { seller: true } });
    if (!product) return ApiResponse.notFound(res, 'Product not found.');
    if (product.seller.userId !== req.user.id && !['SuperAdmin', 'Moderator'].includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Not authorized.');
    }
    const { name, description, price, mrp, category, subCategory, stock, unit, brand, discount, isActive, isFeatured } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (mrp !== undefined) data.mrp = parseFloat(mrp);
    if (category !== undefined) data.category = category;
    if (subCategory !== undefined) data.subCategory = subCategory;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (unit !== undefined) data.unit = unit;
    if (brand !== undefined) data.brand = brand;
    if (discount !== undefined) data.discount = parseFloat(discount);
    if (isActive !== undefined) data.isActive = isActive;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    const updated = await prisma.product.update({ where: { id: req.params.id }, data });
    return ApiResponse.success(res, updated, 'Product updated.');
  } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { seller: true } });
    if (!product) return ApiResponse.notFound(res, 'Product not found.');
    if (product.seller.userId !== req.user.id && !['SuperAdmin', 'Moderator'].includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Not authorized.');
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Product deleted.');
  } catch (error) { next(error); }
};

const getMyProducts = async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return ApiResponse.notFound(res, 'Seller not found.');
    const { page, limit, skip } = parsePagination(req.query);
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where: { sellerId: seller.id }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where: { sellerId: seller.id } }),
    ]);
    return ApiResponse.paginated(res, products, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getMyProducts };
