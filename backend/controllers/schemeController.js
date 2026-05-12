// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GOVERNMENT SCHEME CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createScheme = async (req, res, next) => {
  try {
    const { title, description, ministry, eligibility, benefits, state, category, applyUrl, isFeatured, startDate, expiryDate } = req.body;
    const data = { title, description, ministry, eligibility, benefits, state, category, applyUrl, isFeatured: isFeatured === true || isFeatured === 'true' };
    if (startDate) data.startDate = new Date(startDate);
    if (expiryDate) data.expiryDate = new Date(expiryDate);
    if (req.file) data.pdfUrl = `/uploads/pdfs/${req.file.filename}`;
    if (req.body.imageUrl) data.imageUrl = req.body.imageUrl;

    const scheme = await prisma.governmentScheme.create({ data });
    return ApiResponse.created(res, scheme, 'Scheme created.');
  } catch (error) { next(error); }
};

const getAllSchemes = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { state, category, search, isFeatured, isActive } = req.query;
    const where = {};
    if (state) where.state = state;
    if (category) where.category = category;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    else where.isActive = true;
    if (search) where.title = { contains: search };

    const [schemes, total] = await Promise.all([
      prisma.governmentScheme.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.governmentScheme.count({ where }),
    ]);
    return ApiResponse.paginated(res, schemes, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await prisma.governmentScheme.findUnique({ where: { id: req.params.id } });
    if (!scheme) return ApiResponse.notFound(res, 'Scheme not found.');
    return ApiResponse.success(res, scheme);
  } catch (error) { next(error); }
};

const updateScheme = async (req, res, next) => {
  try {
    const { title, description, ministry, eligibility, benefits, state, category, applyUrl, isFeatured, isActive, startDate, expiryDate } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (ministry !== undefined) data.ministry = ministry;
    if (eligibility !== undefined) data.eligibility = eligibility;
    if (benefits !== undefined) data.benefits = benefits;
    if (state !== undefined) data.state = state;
    if (category !== undefined) data.category = category;
    if (applyUrl !== undefined) data.applyUrl = applyUrl;
    if (isFeatured !== undefined) data.isFeatured = isFeatured === true || isFeatured === 'true';
    if (isActive !== undefined) data.isActive = isActive === true || isActive === 'true';
    if (startDate) data.startDate = new Date(startDate);
    if (expiryDate) data.expiryDate = new Date(expiryDate);
    if (req.file) data.pdfUrl = `/uploads/pdfs/${req.file.filename}`;

    const scheme = await prisma.governmentScheme.update({ where: { id: req.params.id }, data });
    return ApiResponse.success(res, scheme, 'Scheme updated.');
  } catch (error) { next(error); }
};

const deleteScheme = async (req, res, next) => {
  try {
    await prisma.governmentScheme.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Scheme deleted.');
  } catch (error) { next(error); }
};

module.exports = { createScheme, getAllSchemes, getSchemeById, updateScheme, deleteScheme };
