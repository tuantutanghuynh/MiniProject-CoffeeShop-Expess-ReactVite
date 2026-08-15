// Hàm giải mã và xác thực Access Token từ JWT Service
const { verifyAccessToken } = require('../services/jwt.service');

// Hàm kiểm tra Blacklist Access Token trên Redis Repository
const { isAccessTokenBlacklisted } = require('../repositories/token.repository');

// Model User dùng để kiểm tra trạng thái hoạt động thực tế của người dùng trong Database
const User = require('../models/user.model');

/**
 * Middleware Xác Thực JWT Access Token (Authentication Middleware)
 * Kiểm tra tính hợp lệ của Header Authorization Bearer <token>
 */
module.exports = async (req, res, next) => {
    // Lấy chuỗi Authorization từ HTTP Header
    const authHeader = req.headers.authorization;

    // Kiểm tra xem Header có tồn tại và bắt đầu bằng định dạng chuẩn 'Bearer ' hay không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            code: 'AUTH_HEADER_MISSING',
            message: 'Yêu cầu không hợp lệ, không tìm thấy Authorization Header Bearer.'
        });
    }

    // Tách lấy phần Token thực sự (bỏ qua từ khóa 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // 1. Xác thực chữ ký số (Signature) và các Standard Claims (iss, aud, exp, alg)
        const decoded = verifyAccessToken(token);

        // 2. Kiểm tra xem Access Token này (dựa vào `jti`) có bị đưa vào Blacklist trên Redis hay chưa (do Đăng xuất)
        const isBlacklisted = await isAccessTokenBlacklisted(decoded.jti);
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_REVOKED',
                message: 'Phiên làm việc đã bị hủy (Đã đăng xuất). Vui lòng đăng nhập lại.'
            });
        }

        // 3. Kiểm tra trạng thái thực tế của User trong Database (phòng trường hợp vừa bị Admin khóa hoặc xóa)
        const user = await User.findById(decoded.sub).select('-password');
        if (!user || user.isDeleted) {
            return res.status(401).json({
                success: false,
                code: 'USER_DISABLED',
                message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.'
            });
        }

        // Đính kèm đối tượng thông tin đã xác thực an toàn vào req.user để các Controller phía sau sử dụng
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            jti: decoded.jti,
            exp: decoded.exp
        };

        // Chuyển tiếp request sang Middleware hoặc Controller tiếp theo
        next();
    } catch (error) {
        // Phân loại lỗi Token theo chuẩn Enterprise Security
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_EXPIRED',
                message: 'Access Token đã hết hạn. Vui lòng gửi Refresh Token để lấy token mới.',
                expiredAt: error.expiredAt
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_INVALID',
                message: 'Token không hợp lệ hoặc chữ ký bị giả mạo.'
            });
        }
        return res.status(401).json({
            success: false,
            code: 'AUTH_FAILED',
            message: 'Xác thực thất bại.'
        });
    }
};