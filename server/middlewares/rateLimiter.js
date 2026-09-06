const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const { redisClient } = require('../repositories/token.repository');

/**
 * Authentication Rate Limiter: Max 100 requests per 15 minutes per IP (Development Friendly)
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Increased limit for smooth local testing
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:auth:'
    }),
    message: {
        success: false,
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many authentication attempts. Please try again after 15 minutes.'
    }
});

module.exports = {
    authRateLimiter
};