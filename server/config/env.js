// Đọc biến môi trường từ file .env vào process.env của Node.js runtime
require('dotenv').config();

// Danh sách các biến môi trường BẮT BUỘC phải khai báo (Enterprise Security Rule)
const requireEnvs = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'MONGO_URI'];

// Duyệt qua từng biến bắt buộc để kiểm tra sự tồn tại
for (const envName of requireEnvs) {
    if (!process.env[envName]) {
        // In cảnh báo Fatal Error ra Console nếu bị thiếu Secret
        console.error(`❌ [FATAL SECURITY ERROR] Khuyết biến môi trường bắt buộc: ${envName}`);
        
        // Ngắt ứng dụng ngay lập tức, ngầm ngăn chặn việc khởi động Server với Secret mặc định yếu
        process.exit(1);
    }
}

// Export một Object chứa toàn bộ cấu hình hệ thống đã được validate an toàn
module.exports = {
    PORT: process.env.PORT || 3000,                               // Cổng lắng nghe HTTP Server
    MONGO_URI: process.env.MONGO_URI,                            // Chuỗi kết nối MongoDB Database
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,        // Secret Key dùng để ký Access Token
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,      // Secret Key dùng để ký Refresh Token
    JWT_ISSUER: process.env.JWT_ISSUER || 'coffeeshop-api',      // Định danh Server phát hành Token (iss claim)
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'coffeeshop-client', // Định danh Đối tượng nhận Token (aud claim)
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',           // Địa chỉ IP/Domain của Redis Server
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379           // Cổng mạng của Redis Server (chuyển sang kiểu Số)
};