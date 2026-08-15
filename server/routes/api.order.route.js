const express = require('express');
const router = express.Router();
const apiOrderController = require('../controllers/api.order.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');

// Protected User Routes: Cần Token hợp lệ để đặt đơn và xem đơn cá nhân
router.post('/', authenticateJWT, apiOrderController.createOrder);
router.get('/my-orders', authenticateJWT, apiOrderController.getMyOrders);

// Protected Admin Routes: Xem tất cả đơn và cập nhật trạng thái
router.get('/', authenticateJWT, requireAdmin, apiOrderController.getAllOrders);
router.patch('/:id/status', authenticateJWT, requireAdmin, apiOrderController.updateOrderStatus);

module.exports = router;
