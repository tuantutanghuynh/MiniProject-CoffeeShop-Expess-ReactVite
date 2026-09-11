const express = require('express');
const router = express.Router();
const apiOrderController = require('../controllers/api.order.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');
const { readRateLimiter, writeRateLimiter } = require('../middlewares/rateLimiter');

// Protected User Routes: Cần Token hợp lệ để đặt đơn và xem đơn cá nhân
router.post('/', writeRateLimiter, authenticateJWT, apiOrderController.createOrder);
router.get('/my-orders', readRateLimiter, authenticateJWT, apiOrderController.getMyOrders);

// Protected Admin Routes: Xem tất cả đơn và cập nhật trạng thái
router.get('/', readRateLimiter, authenticateJWT, requireAdmin, apiOrderController.getAllOrders);
router.patch('/:id/status', writeRateLimiter, authenticateJWT, requireAdmin, apiOrderController.updateOrderStatus);

module.exports = router;
