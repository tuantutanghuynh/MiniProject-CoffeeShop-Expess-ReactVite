require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Redis = require('ioredis');
const env = require('../config/env');

const clearRateLimit = async () => {
    try {
        const redisClient = new Redis({
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_PASSWORD
        });

        const keys = await redisClient.keys('rl:auth:*');
        if (keys && keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cleared ${keys.length} rate limiter keys from Redis.`);
        } else {
            console.log('No rate limiter keys found in Redis.');
        }

        redisClient.quit();
        process.exit(0);
    } catch (err) {
        console.error('Error clearing rate limit:', err);
        process.exit(1);
    }
};

clearRateLimit();
