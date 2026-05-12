// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEATHER CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const logWeather = async (req, res, next) => {
  try {
    const { city, state, temperature, humidity, windSpeed, condition, forecast, alertType, alertMessage } = req.body;
    const log = await prisma.weatherLog.create({
      data: { userId: req.user?.id || null, city, state, temperature: temperature ? parseFloat(temperature) : null, humidity: humidity ? parseFloat(humidity) : null, windSpeed: windSpeed ? parseFloat(windSpeed) : null, condition, forecast: forecast ? JSON.stringify(forecast) : null, alertType, alertMessage },
    });
    return ApiResponse.created(res, log, 'Weather logged.');
  } catch (error) { next(error); }
};

const getWeatherLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { city, state, alertType, startDate, endDate } = req.query;
    const where = {};
    if (city) where.city = city;
    if (state) where.state = state;
    if (alertType) where.alertType = alertType;
    if (startDate || endDate) { where.date = {}; if (startDate) where.date.gte = new Date(startDate); if (endDate) where.date.lte = new Date(endDate); }

    const [logs, total] = await Promise.all([
      prisma.weatherLog.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
      prisma.weatherLog.count({ where }),
    ]);
    return ApiResponse.paginated(res, logs, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getWeatherAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.weatherLog.findMany({
      where: { alertType: { not: null }, date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      orderBy: { date: 'desc' }, take: 20,
    });
    return ApiResponse.success(res, alerts);
  } catch (error) { next(error); }
};

module.exports = { logWeather, getWeatherLogs, getWeatherAlerts };
