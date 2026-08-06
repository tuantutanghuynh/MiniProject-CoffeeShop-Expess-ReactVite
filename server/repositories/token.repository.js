const Redis = require('ioredis');
const env = require('../config/env')

const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
});

redis.on('connect', () => console.log('Redis Client Kết Nối Thành Công'));
redis.on('error', (error) => console.log('Lỗi kết nối Redis Client', err));

//1,Lưu Refresh token vào redis (Key: refresh:<userId>: <jti>, TTL 7 ngày = 604800s)
exports.storeRefreshToken = async (userId, jti, token, ttlSeconds = 604800) => {
    const key = `refresh:${userId}:${jti}`;
    await redis.set(key, token, 'EX', ttlSeconds);
}


//2. kiểm tra xem refresh token có tồn tại trong redis không
exports.getRefeshToken = async (userId, jti) => {
    const key = `refresh:${userId}:${jti}`;
    return await redis.get(key);
}

//3.xóa refresh token cụ thể (khi cấ đổi token mới -rotation)
exports.removeRefreshToken = async (userId, jti) => {
    const key = `refresh:${userId}:${jti}`;
    await redis.del(key);
};

//4. phát hiện token bị đánh cắp: xóa sạch toàn bộ refresh token của user (Revoke familly)
exports.revokeAllUserRefreshTokens = async (userId) => {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (key.lenght > 0) {
        await redis.del(keys);
        console.warn(`[SECURITY ALERT] Phát hiện Refresh Token Reuse! Đã thu hồi toàn bộ ${keys.length} tokens của UserId: ${userId}`);
    }
};

//5. thêm access token vào Blacklist khi logout (Key: bl:<jti>, TTL = thời gian còn lại của token)
exports.blacklistAccessToken = async (jti, remainingTtlSeconds) => {
    if (remainingTtlSeconds > 0) {
        await redis.set(`bl:${jti}`, 'revoke', 'EX', remainingTtlSeconds);
    }
};

//6. kiểm tra xem access token có nằm trong blacklist hay không
exports.isAccessTokenBlacklisted = async (jti) => {
    const res = await redis.get(`bl:${jti}`);
    return res === 'revoke';
}

module.exports.redis = redis;
