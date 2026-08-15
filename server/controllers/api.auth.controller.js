// Nạp Model User
const User = require('../models/user.model');

// Thư viện bcrypt để so sánh mật khẩu
const bcrypt = require('bcrypt');

// Thư viện express-validator để kiểm tra kết quả validate form
const { validationResult } = require('express-validator');

// Thư viện JWT Service tự viết để phát hành và verify token
const { 
    generateAccessToken, 
    generateRefreshToken, 
    verifyRefreshToken 
} = require('../services/jwt.service');

// Redis Repository để quản lý kho Refresh Token và Blacklist
const { 
    storeRefreshToken, 
    getRefreshToken, 
    removeRefreshToken, 
    revokeAllUserRefreshTokens, 
    blacklistAccessToken 
} = require('../repositories/token.repository');

/**
 * [POST] /api/v1/auth/register - Đăng ký tài khoản người dùng mới
 */
exports.register = async (req, res, next) => {
    try {
        // Gom kết quả kiểm tra validation từ các rules ở router
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                errors: errors.array()
            });
        }

        const { fullname, email, password } = req.body;

        // Kiểm tra xem Email đã tồn tại trong DB chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                code: 'EMAIL_EXISTS',
                message: 'Email này đã được sử dụng.'
            });
        }

        // Tạo instance User mới và lưu vào DB (Pre-save hook sẽ tự băm mật khẩu)
        const newUser = new User({ fullname, email, password });
        await newUser.save();

        // Trả về response 201 Created kèm dữ liệu an toàn (loại bỏ password)
        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            data: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error); // Chuyển lỗi sang Global Error Handler
    }
};

/**
 * [POST] /api/v1/auth/login - Đăng nhập và cấp cặp Token (Access & Refresh Token)
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                code: 'MISSING_CREDENTIALS',
                message: 'Vui lòng nhập đầy đủ email và mật khẩu.'
            });
        }

        // Tìm User theo email và phải chưa bị xóa mềm
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(401).json({
                success: false,
                code: 'INVALID_CREDENTIALS',
                message: 'Email hoặc mật khẩu không chính xác.'
            });
        }

        // So sánh mật khẩu thô gửi lên với chuỗi băm trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                code: 'INVALID_CREDENTIALS',
                message: 'Email hoặc mật khẩu không chính xác.'
            });
        }

        // Phát hành cặp Access Token (15 phút) và Refresh Token (7 ngày)
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Giải mã Refresh Token lấy `jti` để lưu vào Redis
        const jwt = require('jsonwebtoken');
        const decodedRefresh = jwt.decode(refreshToken);
        await storeRefreshToken(user._id.toString(), decodedRefresh.jti, refreshToken);

        // Trả về cặp Token cùng thông tin User
        res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * [POST] /api/v1/auth/refresh - Cấp đổi Token mới (Refresh Token Rotation & Reuse Detection)
 */
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                code: 'TOKEN_MISSING',
                message: 'Vui lòng cung cấp Refresh Token.'
            });
        }

        // 1. Verify chữ ký số và thời hạn của Refresh Token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (err) {
            return res.status(401).json({
                success: false,
                code: 'REFRESH_TOKEN_INVALID',
                message: 'Refresh Token không hợp lệ hoặc đã hết hạn.'
            });
        }

        const userId = decoded.sub;
        const jti = decoded.jti;

        // 2. Tra cứu Redis xem Refresh Token này còn tồn tại không
        const storedToken = await getRefreshToken(userId, jti);

        // PHÁT HIỆN REUSE ATTACK: Nếu token không có trong Redis ➔ Đã bị dùng rồi!
        if (!storedToken) {
            // Xóa sạch toàn bộ Refresh Token của User đó trên Redis (Revoke Family)
            await revokeAllUserRefreshTokens(userId);
            return res.status(401).json({
                success: false,
                code: 'TOKEN_REUSE_DETECTED',
                message: 'Phát hiện cảnh báo bảo mật! Toàn bộ phiên làm việc của bạn đã bị hủy.'
            });
        }

        // 3. Xóa Refresh Token cũ khỏi Redis (Rotation)
        await removeRefreshToken(userId, jti);

        // 4. Kiểm tra User trong DB
        const user = await User.findById(userId);
        if (!user || user.isDeleted) {
            return res.status(401).json({
                success: false,
                code: 'USER_DISABLED',
                message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.'
            });
        }

        // 5. Tạo cặp Token mới hoàn toàn (Access & Refresh mới)
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // 6. Lưu Refresh Token mới vào Redis
        const jwt = require('jsonwebtoken');
        const newDecodedRefresh = jwt.decode(newRefreshToken);
        await storeRefreshToken(userId, newDecodedRefresh.jti, newRefreshToken);

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * [POST] /api/v1/auth/logout - Đăng xuất & Vô hiệu hóa Tokens
 */
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const authUser = req.user; // Nhận từ middleware authenticateJWT

        // 1. Tính số giây còn sống còn lại của Access Token (exp - now)
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const remainingTtl = authUser.exp - nowInSeconds;

        // Đưa Access Token hiện tại vào Blacklist Redis đến khi nó tự hết hạn
        await blacklistAccessToken(authUser.jti, remainingTtl);

        // 2. Xóa Refresh Token trên Redis nếu client có gửi kèm
        if (refreshToken) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(refreshToken);
                if (decoded && decoded.jti) {
                    await removeRefreshToken(authUser.id, decoded.jti);
                }
            } catch (err) {
                // Bỏ qua lỗi parse refresh token
            }
        }

        res.json({
            success: true,
            message: 'Đăng xuất thành công!'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * [GET] /api/v1/auth/me - Lấy thông tin cá nhân của User đang đăng nhập từ req.user
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
