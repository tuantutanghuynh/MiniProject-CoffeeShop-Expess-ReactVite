// Thư viện multer chuyên dùng xử lý Multipart Form Data (Upload File) trong Express
const multer = require('multer');

// Module path dùng để thao tác với đường dẫn thư mục và đuôi định dạng file
const path = require('path');

/**
 * Cấu hình nơi lưu trữ file (Storage Engine) trên ổ đĩa Server
 */
const storage = multer.diskStorage({
    // Định nghĩa thư mục lưu trữ file upload
    destination: function (req, file, cb) {
        // cb(null, path_to_directory): Tham số 1 là null (không có lỗi), tham số 2 là đường dẫn thư mục
        cb(null, path.join(__dirname, '../public/images'));
    },
    // Định nghĩa quy tắc đặt tên file độc nhất để tránh bị trùng lặp/ghi đè file
    filename: function (req, file, cb) {
        // Tạo chuỗi thời gian ngẫu nhiên: Date.now() kết hợp số ngẫu nhiên 9 chữ số
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Trích xuất đuôi file gốc (ví dụ: .jpg, .png)
        const ext = path.extname(file.originalname);
        
        // Đặt tên file hoàn chỉnh: image-1722435000000-849201934.jpg
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

/**
 * Bộ lọc định dạng file (File Filter) - Chỉ chấp nhận các file hình ảnh
 */
const fileFilter = (req, file, cb) => {
    // Kiểm tra định dạng MIME type của file upload
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Chấp nhận file
    } else {
        cb(new Error('Chỉ chấp nhận các file ảnh định dạng JPG, JPEG, PNG, WEBP!'), false);
    }
};

/**
 * Khởi tạo Middleware Multer với các cấu hình lưu trữ, giới hạn kích thước và bộ lọc
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file tối đa 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
