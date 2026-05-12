// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod, shippingAddress, notes } = req.body;
    if (!items || !items.length) return ApiResponse.badRequest(res, 'Order items required.');

    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return ApiResponse.badRequest(res, `Product ${item.productId} not found.`);
      if (product.stock < item.quantity) return ApiResponse.badRequest(res, `Insufficient stock for ${product.name}.`);
      const price = product.price * item.quantity;
      totalAmount += price;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id, totalAmount, paymentMethod: paymentMethod || 'cod', shippingAddress, notes,
        orderItems: { create: orderItems },
      },
      include: { orderItems: { include: { product: true } } },
    });

    // Reduce stock
    for (const item of items) {
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }

    return ApiResponse.created(res, order, 'Order placed successfully.');
  } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where: { userId: req.user.id }, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { orderItems: { include: { product: { select: { name: true, images: true, price: true } } } } },
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);
    return ApiResponse.paginated(res, orders, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status, paymentStatus } = req.query;
    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, phone: true } }, orderItems: { include: { product: { select: { name: true, price: true } } } } },
      }),
      prisma.order.count({ where }),
    ]);
    return ApiResponse.paginated(res, orders, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id },
      include: { user: { select: { name: true, email: true, phone: true } }, orderItems: { include: { product: true } } },
    });
    if (!order) return ApiResponse.notFound(res, 'Order not found.');
    if (order.userId !== req.user.id && !['SuperAdmin', 'Moderator'].includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Not authorized.');
    }
    return ApiResponse.success(res, order);
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const data = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    const order = await prisma.order.update({ where: { id: req.params.id }, data });
    return ApiResponse.success(res, order, 'Order updated.');
  } catch (error) { next(error); }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus };
