const Redis = require('ioredis');
const env = require('../config/env');

/**
 * Initialize Redis Client connection
 */
const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    lazyConnect: true
});

redisClient.connect().then(() => {
    console.log('Redis Client Connected Successfully');
}).catch((err) => {
    console.error('Redis Connection Error:', err.message);
});

module.exports = {
    redisClient,

    /**
     * Store Refresh Token in Redis with TTL (7 days)
     */
    async storeRefreshToken(userId, jti, ttlInSeconds = 7 * 24 * 60 * 60) {
        const key = `refresh:${userId}:${jti}`;
        await redisClient.set(key, 'valid', 'EX', ttlInSeconds);
    },

    /**
     * Verify if Refresh Token exists in Redis
     */
    async isRefreshTokenValid(userId, jti) {
        const key = `refresh:${userId}:${jti}`;
        const result = await redisClient.get(key);
        return result === 'valid';
    },

    /**
     * Revoke a single Refresh Token upon token rotation
     */
    async revokeRefreshToken(userId, jti) {
        const key = `refresh:${userId}:${jti}`;
        await redisClient.del(key);
    },

    /**
     * Revoke all Refresh Tokens of a user (Token Reuse Attack / Revoke Family)
     */
    async revokeAllUserRefreshTokens(userId) {
        const pattern = `refresh:${userId}:*`;
        const keys = await redisClient.keys(pattern);
        if (keys && keys.length > 0) {
            await redisClient.del(keys);
        }
    },

    /**
     * Blacklist Access Token upon Logout with remaining TTL
     */
    async blacklistAccessToken(jti, remainingTtlInSeconds) {
        if (remainingTtlInSeconds <= 0) return;
        const key = `bl:${jti}`;
        await redisClient.set(key, 'blacklisted', 'EX', Math.ceil(remainingTtlInSeconds));
    },

    /**
     * Check if Access Token is blacklisted
     */
    async isAccessTokenBlacklisted(jti) {
        const key = `bl:${jti}`;
        const result = await redisClient.get(key);
        return result === 'blacklisted';
    }
};
