// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REQUEST VALIDATION MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ApiResponse = require('../utils/apiResponse');

/**
 * Validate required fields in request body
 */
const validateRequired = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return ApiResponse.badRequest(
        res,
        `Missing required fields: ${missing.join(', ')}`,
        missing.map(field => ({ field, message: `${field} is required` }))
      );
    }

    next();
  };
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.badRequest(res, 'Invalid email format.');
    }
  }
  next();
};

/**
 * Validate phone number format (Indian)
 */
const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  if (phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return ApiResponse.badRequest(res, 'Invalid Indian phone number format.');
    }
  }
  next();
};

/**
 * Validate password strength
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (password && password.length < 6) {
    return ApiResponse.badRequest(res, 'Password must be at least 6 characters.');
  }
  next();
};

/**
 * Validate role
 */
const validateRole = (req, res, next) => {
  const { role } = req.body;
  const validRoles = ['SuperAdmin', 'Moderator', 'Seller', 'Farmer'];

  if (role && !validRoles.includes(role)) {
    return ApiResponse.badRequest(
      res,
      `Invalid role. Must be one of: ${validRoles.join(', ')}`
    );
  }
  next();
};

module.exports = {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateRole,
};
