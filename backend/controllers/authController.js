// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTHENTICATION CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const config = require('../config');
const ApiResponse = require('../utils/apiResponse');
const { sanitizeUser } = require('../utils/helpers');

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * POST /api/auth/signup
 * Register a new user
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, state, district, crops } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return ApiResponse.badRequest(res, 'User with this email or phone already exists.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role || 'Farmer',
        state: state || null,
        district: district || null,
        crops: crops || null,
      },
    });

    const token = generateToken(user);

    return ApiResponse.created(res, {
      user: sanitizeUser(user),
      token,
    }, 'Account created successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid email or password.');
    }

    if (user.isBlocked) {
      return ApiResponse.forbidden(res, 'Your account has been blocked. Contact support.');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid email or password.');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken(user);

    return ApiResponse.success(res, {
      user: sanitizeUser(user),
      token,
    }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/admin-login
 * Admin panel login (SuperAdmin/Moderator only)
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid credentials.');
    }

    if (!['SuperAdmin', 'Moderator'].includes(user.role)) {
      return ApiResponse.forbidden(res, 'Admin access only.');
    }

    if (user.isBlocked) {
      return ApiResponse.forbidden(res, 'Account blocked.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid credentials.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken(user);

    return ApiResponse.success(res, {
      user: sanitizeUser(user),
      token,
    }, 'Admin login successful.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        seller: true,
      },
    });

    return ApiResponse.success(res, sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/update-profile
 * Update current user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, state, district, crops } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (state) updateData.state = state;
    if (district) updateData.district = district;
    if (crops) updateData.crops = crops;

    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    return ApiResponse.success(res, sanitizeUser(user), 'Profile updated.');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return ApiResponse.badRequest(res, 'Current password is incorrect.');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return ApiResponse.success(res, null, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout (clear FCM token)
 */
const logout = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { fcmToken: null },
    });

    return ApiResponse.success(res, null, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
