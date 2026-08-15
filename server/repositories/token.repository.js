// Thư viện ioredis dùng để kết nối và thao tác với Redis Caching Server
const Redis = require('ioredis');

// Cấu hình biến môi trường
const env = require('../config/env');

// Khởi tạo đối tượng Redis Client
const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    lazyConnect: true // Bật lazyConnect để ứng dụng không bị văng lỗi nặng nếu Redis khởi động chậm
});

// Lắng nghe sự kiện kết nối thành công và sự kiện lỗi kết nối
redis.on('connect', () => console.log('Redis Client Kết Nối Thành Công'));
redis.on('error', (err) => console.log('Lỗi kết nối Redis Client:', err.message));

/**
 * 1. Lưu Refresh Token vào Redis
 * Cấu trúc Key: refresh:<userId>:<jti>
 * TTL mặc định: 7 ngày (604800 giây)
 */
exports.storeRefreshToken = async (userId, jti, token, ttlSeconds = 604800) => {
    const key = `refresh:${userId}:${jti}`;
    // Lệnh SET key value EX seconds: Lưu key kèm thời gian tự hủy TTL
    await redis.set(key, token, 'EX', ttlSeconds);
};

/**
 * 2. Kiểm tra xem Refresh Token có tồn tại trong Redis hay không
 * Trả về chuỗi token nếu còn sống, hoặc null nếu đã bị hủy/hết hạn
 */
exports.getRefreshToken = async (userId, jti) => {
    const key = `refresh:${userId}:${jti}`;
    return await redis.get(key);
};

/**
 * 3. Xóa Refresh Token cụ thể khỏi Redis
 * Thực hiện trong luồng Refresh Token Rotation khi đổi token cũ lấy token mới
 */
exports.removeRefreshToken = async (userId, jti) => {
    const key = `refresh:${userId}:${jti}`;
    await redis.del(key);
};

/**
 * 4. Kích hoạt Thu Hồi Toàn Bộ (Revoke Family - Token Reuse Detection)
 * Khi phát hiện 1 Refresh Token cũ bị dùng lại (dấu hiệu Hacker đánh cắp token)
 * Xóa sạch TẤT CẢ Refresh Token có tiền tố `refresh:<userId>:*`
 */
exports.revokeAllUserRefreshTokens = async (userId) => {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
        await redis.del(keys); // Xóa hàng loạt tất cả các key tìm thấy
        console.warn(`⚠️ [SECURITY ALERT] Phát hiện Refresh Token Reuse! Đã thu hồi toàn bộ ${keys.length} tokens của UserId: ${userId}`);
    }
};

/**
 * 5. Thêm Access Token vào Blacklist trên Redis khi Đăng Xuất (Logout)
 * Cấu trúc Key: bl:<jti>
 * TTL: Thời gian sống còn lại của Access Token (remainingTtlSeconds)
 */
exports.blacklistAccessToken = async (jti, remainingTtlSeconds) => {
    if (remainingTtlSeconds > 0) {
        await redis.set(`bl:${jti}`, 'revoke', 'EX', remainingTtlSeconds);
    }
};

/**
 * 6. Kiểm tra xem Access Token (jti) có bị nằm trong Blacklist hay không
 * Trả về true nếu token đã bị đưa vào Blacklist (người dùng đã đăng xuất)
 */
exports.isAccessTokenBlacklisted = async (jti) => {
    const res = await redis.get(`bl:${jti}`);
    return res === 'revoke';
};

// Export instance redis để sử dụng ở các middleware khác (ví dụ: rateLimiter)
module.exports.redis = redis;
