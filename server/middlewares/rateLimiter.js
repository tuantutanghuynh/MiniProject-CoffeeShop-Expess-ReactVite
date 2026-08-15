// Thư viện express-rate-limit dùng để giới hạn số lượng request từ 1 IP
const rateLimit = require('express-rate-limit');

// Thư viện rate-limit-redis tích hợp lưu vết đếm số request vào Redis Server
const RedisStore = require('rate-limit-redis').default;

// Nạp kết nối Redis Client từ Repository
const { redis } = require('../repositories/token.repository');

/**
 * Rate Limiter cho các API Xác thực nhạy cảm (/login, /register, /refresh)
 * Giới hạn tối đa 10 lần thử trong vòng 15 phút trên mỗi địa chỉ IP.
 * Chống tấn công dò mật khẩu (Brute-Force Attack) và Spam Tài Khoản.
 */
exports.authRateLimiter = rateLimit({
    // Sử dụng Redis Store để lưu trữ counter thay vì lưu RAM server (hỗ trợ Distributed System / Cluster)
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args)
    }),
    windowMs: 15 * 60 * 1000, // Cửa sổ thời gian kiểm tra: 15 phút (tính theo miligiây)
    max: 10,                   // Số lượng request tối đa được cho phép trong 15 phút
    standardHeaders: true,     // Trả về thông tin RateLimit trong Response Header tiêu chuẩn (RateLimit-Limit, RateLimit-Remaining)
    legacyHeaders: false,      // Tắt các header cũ (X-RateLimit-Limit)
    message: {
        success: false,
        code: 'TOO_MANY_REQUESTS',
        message: 'Bạn đã thử đăng nhập/đăng ký quá nhiều lần. Vui lòng thử lại sau 15 phút.'
    }
});