/**
 * Enterprise Environment Variable Management & Validation Module
 */

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET;

if (!jwtAccessSecret || !jwtRefreshSecret) {
    console.error('[FATAL ERROR] Missing required JWT secrets in environment variables.');
    console.error('Please configure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in your .env file.');
    process.exit(1);
}

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffee_shop',
    
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,

    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};