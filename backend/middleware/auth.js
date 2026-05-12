// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JWT AUTHENTICATION MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const config = require('../config');
const ApiResponse = require('../utils/apiResponse');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found. Invalid token.');
    }

    if (user.isBlocked) {
      return ApiResponse.forbidden(res, 'Your account has been blocked. Contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }
    return ApiResponse.error(res, 'Authentication failed.', 500);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user && !user.isBlocked) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently continue without user
  }
  next();
};

/**
 * Role-based access control
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }

    next();
  };
};

/**
 * Admin-only middleware (SuperAdmin + Moderator)
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required.');
  }

  if (!['SuperAdmin', 'Moderator'].includes(req.user.role)) {
    return ApiResponse.forbidden(res, 'Admin access required.');
  }

  next();
};

/**
 * SuperAdmin-only middleware
 */
const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required.');
  }

  if (req.user.role !== 'SuperAdmin') {
    return ApiResponse.forbidden(res, 'SuperAdmin access required.');
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  adminOnly,
  superAdminOnly,
};
