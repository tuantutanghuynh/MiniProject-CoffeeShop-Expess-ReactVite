require('dotenv').config();

const requireEnvs = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'MONGO_URI'];

for (const envName of requireEnvs) {
    if (!process.env[envName]) {
        console.error(`X [FATAL SECURITY ERROR] Khuyết biến môi trường bắt buộc: ${envName}`);
        process.exit(1);
    }
}

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_ISSUER: process.env.JWT_ISSUER || 'coffeeshop-api',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'coffeeshop-client',
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    REDIS_HOST: process.env.REDIS_PORT || 6379
};