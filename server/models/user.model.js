// Thư viện Mongoose để làm việc với MongoDB
const mongoose = require('mongoose');

// Thư viện bcrypt dùng để băm (hash) mật khẩu và so sánh mật khẩu an toàn
const bcrypt = require('bcrypt');

/**
 * Khai báo Schema cho Người dùng (User Schema)
 */
const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Họ tên không được để trống'],
            trim: true // Tự động cắt bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        },
        email: {
            type: String,
            required: [true, 'Email không được để trống'],
            unique: true, // Tạo Unique Index trong MongoDB ngăn trùng lặp email
            lowercase: true, // Tự động chuyển email về chữ viết thường
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu không được để trống'],
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Chỉ cho phép 1 trong 2 giá trị này
            default: 'user'         // Mặc định tài khoản mới là người dùng phổ thông
        },
        avatar: {
            type: String,
            default: 'default-avatar.png'
        },
        isDeleted: {
            type: Boolean,
            default: false // Trạng thái vô hiệu hóa / xóa mềm
        }
    },
    {
        timestamps: true // Tự động sinh ra 2 trường createdAt và updatedAt
    }
);

/**
 * Pre-save Hook: Tự động mã hóa mật khẩu trước khi lưu document vào MongoDB
 * Bắt buộc dùng `function` truyền thống để từ khóa `this` trỏ đúng tới Document User chuẩn bị lưu.
 */
userSchema.pre('save', async function (next) {
    // Nếu mật khẩu không bị thay đổi (ví dụ khi sửa tên hoặc avatar), bỏ qua bước mã hóa
    if (!this.isModified('password')) return next();

    try {
        // Sinh muối (salt) với độ phức tạp cost factor = 10
        const salt = await bcrypt.genSalt(10);
        
        // Băm mật khẩu bằng salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Tạo Model tên 'User' từ userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;