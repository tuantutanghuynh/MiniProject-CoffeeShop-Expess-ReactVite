// Đọc biến môi trường từ file .env
require('dotenv').config();

// Thư viện http-errors để sinh lỗi HTTP chuẩn
const createError = require('http-errors');

// Thư viện Express Web Framework
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Thư viện CORS cho phép React Frontend kết nối tới API từ domain/port khác
const cors = require('cors');

// Hàm kết nối CSDL MongoDB
const connectDB = require('./config/db');

// Thực hiện kết nối CSDL khi khởi động ứng dụng
connectDB();

// Nạp các Router REST API v1
const apiAuthRouter = require('./routes/api.auth.route');
const apiCategoryRouter = require('./routes/api.category.route');
const apiDrinkRouter = require('./routes/api.drink.route');
const apiOrderRouter = require('./routes/api.order.route');

// Khởi tạo ứng dụng Express
const app = express();

app.use(cors());                          // Bật CORS cho phép ứng dụng React Frontend kết nối
app.use(logger('dev'));                    // In log HTTP Request ra màn hình Terminal
app.use(express.json());                   // Middleware đọc dữ liệu JSON gửi trong Request Body
app.use(express.urlencoded({ extended: false })); // Middleware đọc dữ liệu Form URL Encoded
app.use(cookieParser());                   // Middleware đọc HTTP Cookie

// Phục vụ file tĩnh (Static Files) cho ảnh sản phẩm được upload trong thư mục public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Gắn nhóm định tuyến RESTful API v1
app.use('/api/v1/auth', apiAuthRouter);
app.use('/api/v1/categories', apiCategoryRouter);
app.use('/api/v1/drinks', apiDrinkRouter);
app.use('/api/v1/orders', apiOrderRouter);

// Endpoint Health Check kiểm tra trạng thái hoạt động của Server
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Coffee Shop RESTful API Server đang hoạt động trơn tru!',
        version: 'v1'
    });
});

// Bắt lỗi 404 Not Found nếu client gọi URL không tồn tại
app.use(function (req, res, next) {
    next(createError(404, 'Endpoint không tồn tại trên hệ thống API.'));
});

// Middleware Xử Lỗi Toàn Cục (Global API Error Handler)
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        success: false,
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Lỗi hệ thống máy chủ.'
    });
});

module.exports = app;
