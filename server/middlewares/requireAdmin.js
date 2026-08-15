/**
 * Middleware Phân Quyền Quản Trị Viên (Authorization Middleware)
 * Kiểm tra xem người dùng đã được xác thực qua JWT có vai trò 'admin' hay không.
 * Bắt buộc đứng SAU middleware `authenticateJWT` trong chuỗi router.
 */
module.exports = (req, res, next) => {
    // Kiểm tra req.user đã được gán bởi authenticateJWT và role chính xác là 'admin'
    if (req.user && req.user.role === 'admin') {
        // Cho phép request đi tiếp tới Controller xử lý nghiệp vụ của Admin
        return next();
    }

    // Nếu không phải Admin, trả về HTTP Status 403 Forbidden
    res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện chức năng này! Yêu cầu quyền Quản trị viên (Admin).'
    });
};