// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEWS CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createNews = async (req, res, next) => {
  try {
    const { title, content, summary, category, source, author, isBreaking, isFeatured } = req.body;
    const data = { title, content, summary, category, source, author, isBreaking: isBreaking === true || isBreaking === 'true', isFeatured: isFeatured === true || isFeatured === 'true' };
    if (req.files) {
      if (req.files.image) data.imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      if (req.files.video) data.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }
    const news = await prisma.newsArticle.create({ data });
    return ApiResponse.created(res, news, 'News published.');
  } catch (error) { next(error); }
};

const getAllNews = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { category, search, isBreaking, isFeatured } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;
    if (search) where.title = { contains: search };
    if (isBreaking !== undefined) where.isBreaking = isBreaking === 'true';
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const [news, total] = await Promise.all([
      prisma.newsArticle.findMany({ where, skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      prisma.newsArticle.count({ where }),
    ]);
    return ApiResponse.paginated(res, news, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getNewsById = async (req, res, next) => {
  try {
    const news = await prisma.newsArticle.update({ where: { id: req.params.id }, data: { views: { increment: 1 } } });
    if (!news) return ApiResponse.notFound(res, 'News not found.');
    return ApiResponse.success(res, news);
  } catch (error) { next(error); }
};

const updateNews = async (req, res, next) => {
  try {
    const { title, content, summary, category, source, author, isBreaking, isFeatured, isPublished } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (summary !== undefined) data.summary = summary;
    if (category !== undefined) data.category = category;
    if (source !== undefined) data.source = source;
    if (author !== undefined) data.author = author;
    if (isBreaking !== undefined) data.isBreaking = isBreaking === true || isBreaking === 'true';
    if (isFeatured !== undefined) data.isFeatured = isFeatured === true || isFeatured === 'true';
    if (isPublished !== undefined) data.isPublished = isPublished === true || isPublished === 'true';
    if (req.files) {
      if (req.files.image) data.imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      if (req.files.video) data.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }
    const news = await prisma.newsArticle.update({ where: { id: req.params.id }, data });
    return ApiResponse.success(res, news, 'News updated.');
  } catch (error) { next(error); }
};

const deleteNews = async (req, res, next) => {
  try {
    await prisma.newsArticle.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'News deleted.');
  } catch (error) { next(error); }
};

module.exports = { createNews, getAllNews, getNewsById, updateNews, deleteNews };
