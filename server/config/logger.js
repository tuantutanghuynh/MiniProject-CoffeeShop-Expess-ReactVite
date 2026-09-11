const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = winston.format;

//Formet chung: [thời gian] level: nội dung (hoặc full stack nếu là Error)
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        //1.console có màu dễ đọc khi đev
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}), logFormat)
        }),
        //2. file tổng hợp mọi level giữ 14 ngày
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '../logs/app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        }),
        // 3. File riêng CHỈ level 'error', giữ 30 ngày
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '../logs/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '30d'
        })
    ]
});

module.exports = logger