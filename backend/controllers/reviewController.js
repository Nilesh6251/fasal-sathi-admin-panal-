// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REVIEW CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) return ApiResponse.badRequest(res, 'productId and rating required.');
    if (rating < 1 || rating > 5) return ApiResponse.badRequest(res, 'Rating must be 1-5.');

    const existing = await prisma.review.findFirst({ where: { userId: req.user.id, productId } });
    if (existing) return ApiResponse.badRequest(res, 'Already reviewed this product.');

    const review = await prisma.review.create({
      data: { userId: req.user.id, productId, rating: parseInt(rating), comment },
    });

    // Update seller avg rating
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (product) {
      const avg = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true } });
      // No direct update to seller rating from product review aggregate here, kept simple
    }

    return ApiResponse.created(res, review, 'Review submitted.');
  } catch (error) { next(error); }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where: { productId: req.params.productId, isVisible: true }, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, profileImage: true } } },
      }),
      prisma.review.count({ where: { productId: req.params.productId, isVisible: true } }),
    ]);
    return ApiResponse.paginated(res, reviews, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return ApiResponse.notFound(res, 'Review not found.');
    if (review.userId !== req.user.id && !['SuperAdmin', 'Moderator'].includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Not authorized.');
    }
    await prisma.review.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Review deleted.');
  } catch (error) { next(error); }
};

const toggleReviewVisibility = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return ApiResponse.notFound(res, 'Review not found.');
    const updated = await prisma.review.update({ where: { id: req.params.id }, data: { isVisible: !review.isVisible } });
    return ApiResponse.success(res, updated, `Review ${updated.isVisible ? 'shown' : 'hidden'}.`);
  } catch (error) { next(error); }
};

module.exports = { createReview, getProductReviews, deleteReview, toggleReviewVisibility };
