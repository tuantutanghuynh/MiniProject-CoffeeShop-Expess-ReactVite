// Thư viện Mongoose
const mongoose = require('mongoose');

/**
 * Khai báo Schema cho Danh mục sản phẩm (Category Schema)
 */
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên danh mục không được để trống'],
            unique: true, // Không cho phép trùng tên danh mục
            trim: true
        },
        description: {
            type: String,
            default: '',
            trim: true
        }
    },
    {
        timestamps: true // Tự động tạo createdAt và updatedAt
    }
);

// Tạo Model 'Category'
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;