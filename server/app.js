// Load environment variables from .env file
require('dotenv').config();

// http-errors library for standardized HTTP errors
const createError = require('http-errors');

// Express Web Framework
const express = require('express');
const path = require('path');
const morganLogger = require('morgan');

// CORS middleware allowing React Frontend cross-origin requests
const cors = require('cors');
const helmet = require('helmet');

// Database connection function
const connectDB = require('./config/db');

const env = require('./config/env');
const logger = require('./config/logger');

// Connect to MongoDB on server startup
connectDB();

// Load REST API v1 Routers
const apiAuthRouter = require('./routes/api.auth.route');
const apiCategoryRouter = require('./routes/api.category.route');
const apiDrinkRouter = require('./routes/api.drink.route');
const apiOrderRouter = require('./routes/api.order.route');

// Initialize Express application
const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(cors({
    origin: function (origin, callback) {
        //orgin là undefined khi rquest không có header origin
        //post man, curl, hoặc server-to server vẫn nên cho qua
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allow by CORS'))
        }
    }
}))

app.use(helmet({
    // Mặc định helmet chặn resource cross-origin (ảnh, v.v.) — mở lại
    // vì đây là API + static file server phục vụ 1 frontend khác origin.
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(morganLogger('dev'));              // Log HTTP requests in dev mode
app.use(express.json());                   // Parse JSON Request Body
app.use(express.urlencoded({ extended: false })); // Parse Form URL-encoded data

// Serve static files for uploaded drink images in public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Mount RESTful API v1 Routers
app.use('/api/v1/auth', apiAuthRouter);
app.use('/api/v1/categories', apiCategoryRouter);
app.use('/api/v1/drinks', apiDrinkRouter);
app.use('/api/v1/orders', apiOrderRouter);

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Coffee Shop RESTful API Server is running smoothly!',
        version: 'v1'
    });
});

// Catch 404 Not Found for unhandled URL routes
app.use(function (req, res, next) {
    next(createError(404, 'Endpoint does not exist on the API system.'));
});

// Global API Error Handler Middleware
app.use(function (err, req, res, next) {
    const status = err.status || 500;

    //chỉ log chi tiết lỗi thực sự thuộc về server
    if (status >= 500) {
        logger.error(err.stack || err.message);
    }

    res.status(status).json({
        success: false,
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.expose ? err.message : 'Internal Server Error'
    });
});
module.exports = app;
