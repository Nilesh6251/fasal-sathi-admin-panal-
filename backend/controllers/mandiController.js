// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MANDI BHAV (PRICE) CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const addMandiPrice = async (req, res, next) => {
  try {
    const { crop, variety, market, district, state, minPrice, maxPrice, modalPrice, unit, date, source } = req.body;
    const price = await prisma.mandiPrice.create({
      data: { crop, variety, market, district, state, minPrice: parseFloat(minPrice), maxPrice: parseFloat(maxPrice), modalPrice: parseFloat(modalPrice), unit: unit || 'quintal', date: new Date(date || Date.now()), source },
    });
    return ApiResponse.created(res, price, 'Mandi price added.');
  } catch (error) { next(error); }
};

const bulkAddMandiPrices = async (req, res, next) => {
  try {
    const { prices } = req.body;
    if (!prices || !Array.isArray(prices)) return ApiResponse.badRequest(res, 'Prices array required.');
    const data = prices.map(p => ({
      crop: p.crop, variety: p.variety, market: p.market, district: p.district, state: p.state,
      minPrice: parseFloat(p.minPrice), maxPrice: parseFloat(p.maxPrice), modalPrice: parseFloat(p.modalPrice),
      unit: p.unit || 'quintal', date: new Date(p.date || Date.now()), source: p.source,
    }));
    const result = await prisma.mandiPrice.createMany({ data });
    return ApiResponse.created(res, { count: result.count }, `${result.count} prices added.`);
  } catch (error) { next(error); }
};

const getMandiPrices = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { crop, state, district, market, startDate, endDate } = req.query;
    const where = {};
    if (crop) where.crop = { contains: crop };
    if (state) where.state = state;
    if (district) where.district = district;
    if (market) where.market = { contains: market };
    if (startDate || endDate) { where.date = {}; if (startDate) where.date.gte = new Date(startDate); if (endDate) where.date.lte = new Date(endDate); }

    const [prices, total] = await Promise.all([
      prisma.mandiPrice.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
      prisma.mandiPrice.count({ where }),
    ]);
    return ApiResponse.paginated(res, prices, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getMandiPriceAnalytics = async (req, res, next) => {
  try {
    const { crop, state, days } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (parseInt(days) || 30));
    const where = { date: { gte: startDate } };
    if (crop) where.crop = crop;
    if (state) where.state = state;

    const prices = await prisma.mandiPrice.findMany({ where, orderBy: { date: 'asc' } });
    const cropGroups = {};
    prices.forEach(p => {
      if (!cropGroups[p.crop]) cropGroups[p.crop] = [];
      cropGroups[p.crop].push({ date: p.date, minPrice: p.minPrice, maxPrice: p.maxPrice, modalPrice: p.modalPrice, market: p.market });
    });

    return ApiResponse.success(res, { period: `${days || 30} days`, analytics: cropGroups });
  } catch (error) { next(error); }
};

const deleteMandiPrice = async (req, res, next) => {
  try {
    await prisma.mandiPrice.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Price deleted.');
  } catch (error) { next(error); }
};

module.exports = { addMandiPrice, bulkAddMandiPrices, getMandiPrices, getMandiPriceAnalytics, deleteMandiPrice };
