// Thư viện jsonwebtoken để mã hóa (sign) và giải mã/xác thực (verify) JWT
const jwt = require('jsonwebtoken');

// Module crypto chuẩn của Node.js dùng để sinh ngẫu nhiên UUIDv4 cho claim `jti`
const crypto = require('crypto');

// Nạp các biến cấu hình môi trường đã được validate an toàn
const env = require('../config/env');

// Thuật toán ký cố định (Chỉ định cứng để tránh tấn công Algorithm Confusion / alg: none)
const ALGORITHM = 'HS256';

/**
 * 1. Tạo Access Token cho Người dùng
 * Payload tối giản chỉ chứa: sub (User ID), role (Quyền hạn), jti (JWT ID ngẫu nhiên)
 * Hạn sử dụng: 15 phút
 */
exports.generateAccessToken = (user) => {
    const payload = {
        sub: user._id.toString(), // Subject: ID của người dùng dạng chuỗi
        role: user.role,           // Quyền của người dùng ('user' hoặc 'admin')
        jti: crypto.randomUUID()   // JWT ID duy nhất dạng UUIDv4 dùng cho Blacklisting
    };

    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        algorithm: ALGORITHM,      // Cố định thuật toán HMAC-SHA256
        expiresIn: '15m',          // Thời gian sống: 15 phút
        issuer: env.JWT_ISSUER,    // Kiểm tra Issuer đúng server phát hành
        audience: env.JWT_AUDIENCE // Kiểm tra Audience đúng đối tượng nhận
    });
};

/**
 * 2. Tạo Refresh Token cho Người dùng
 * Payload tối giản: sub (User ID), jti (JWT ID ngẫu nhiên)
 * Hạn sử dụng: 7 ngày
 */
exports.generateRefreshToken = (user) => {
    const payload = {
        sub: user._id.toString(), // Subject: ID người dùng
        jti: crypto.randomUUID()   // JWT ID dùng cho Refresh Token Rotation & Reuse Detection
    };

    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        algorithm: ALGORITHM,      // Cố định thuật toán HS256
        expiresIn: '7d',           // Thời gian sống: 7 ngày
        issuer: env.JWT_ISSUER,    // Cập nhật Issuer
        audience: env.JWT_AUDIENCE // Cập nhật Audience
    });
};

/**
 * 3. Xác thực và Giải mã Access Token
 * Bắt buộc kiểm tra chữ ký với ACCESS_TOKEN_SECRET và xác minh thuật toán + standard claims
 */
exports.verifyAccessToken = (token) => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
        algorithms: [ALGORITHM],   // Bắt buộc thuật toán phải là HS256
        issuer: env.JWT_ISSUER,    // Bắt buộc khớp Issuer
        audience: env.JWT_AUDIENCE // Bắt buộc khớp Audience
    });
};

/**
 * 4. Xác thực và Giải mã Refresh Token
 * Bắt buộc kiểm tra chữ ký với REFRESH_TOKEN_SECRET và xác minh thuật toán + standard claims
 */
exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET, {
        algorithms: [ALGORITHM],   // Bắt buộc thuật toán phải là HS256
        issuer: env.JWT_ISSUER,    // Bắt buộc khớp Issuer
        audience: env.JWT_AUDIENCE // Bắt buộc khớp Audience
    });
};
