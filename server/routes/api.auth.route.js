const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const apiAuthController = require('../controllers/api.auth.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { authRateLimiter } = require('../middlewares/rateLimiter');

// Quy tắc kiểm tra dữ liệu đầu vào (Validation Rules) cho Đăng ký
const registerRules = [
    body('fullname').notEmpty().withMessage('Họ tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
];

// Public Routes (Tích hợp authRateLimiter chống brute-force)
router.post('/register', authRateLimiter, registerRules, apiAuthController.register);
router.post('/login', authRateLimiter, apiAuthController.login);
router.post('/refresh', authRateLimiter, apiAuthController.refreshToken);

// Protected Routes (Yêu cầu qua Middleware xác thực authenticateJWT)
router.post('/logout', authenticateJWT, apiAuthController.logout);
router.get('/me', authenticateJWT, apiAuthController.getMe);

module.exports = router;
