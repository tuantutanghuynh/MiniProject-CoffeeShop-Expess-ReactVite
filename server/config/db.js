// Thư viện Mongoose dùng để làm việc với CSDL MongoDB trong Node.js
const mongoose = require('mongoose');

// Thư viện dotenv giúp đọc biến môi trường từ file .env vào process.env
require('dotenv').config();

/**
 * Hàm kết nối cơ sở dữ liệu MongoDB
 * Sử dụng async/await để xử lý bất đồng bộ khi kết nối DB
 */
const connectDB = async () => {
    try {
        // Lấy chuỗi kết nối từ biến môi trường MONGO_URI (hoặc fallback mặc định)
        const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffee_shop';
        
        // Thực hiện kết nối tới MongoDB Server
        const conn = await mongoose.connect(connStr);
        
        // In thông báo khi kết nối thành công kèm theo tên Host kết nối
        console.log(`MongoDB Kết nối thành công: ${conn.connection.host}`);
    } catch (error) {
        // In thông báo lỗi chi tiết nếu không thể kết nối tới DB (ví dụ sai URI hoặc MongoDB daemon chưa bật)
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        
        // Dừng toàn bộ ứng dụng Node.js với mã thoát 1 (Failure)
        process.exit(1);
    }
};

// Export hàm connectDB để file app.js có thể nạp và thực thi khi khởi động Server
module.exports = connectDB;
