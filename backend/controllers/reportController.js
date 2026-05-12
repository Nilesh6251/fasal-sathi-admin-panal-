// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const generateReport = async (req, res, next) => {
  try {
    const { type, category, data } = req.body;
    const report = await prisma.report.create({
      data: { userId: req.user.id, type: type || 'custom', category, data: data ? JSON.stringify(data) : null },
    });
    return ApiResponse.created(res, report, 'Report generated.');
  } catch (error) { next(error); }
};

const getAllReports = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { type, category } = req.query;
    const where = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({ where, skip, take: limit, orderBy: { generatedAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.report.count({ where }),
    ]);
    return ApiResponse.paginated(res, reports, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!report) return ApiResponse.notFound(res, 'Report not found.');
    return ApiResponse.success(res, report);
  } catch (error) { next(error); }
};

const deleteReport = async (req, res, next) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Report deleted.');
  } catch (error) { next(error); }
};

module.exports = { generateReport, getAllReports, getReportById, deleteReport };
