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
/**
 * Read Rate Limiter: Max 300 requests / 15 phút — áp cho các route GET công khai
 */
const readRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:read:'
    }),
    message: {
        success: false,
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please try again later.'
    }
});

/**
 * Write Rate Limiter: Max 50 requests / 15 phút — áp cho POST/PUT/PATCH/DELETE
 */
const writeRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:write:'
    }),
    message: {
        success: false,
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many write requests. Please try again later.'
    }
});

module.exports = {
    authRateLimiter,
    readRateLimiter,
    writeRateLimiter
};