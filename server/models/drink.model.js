// Thư viện Mongoose
const mongoose = require('mongoose');

/**
 * Sub-schema cho các kích thước của đồ uống (Size: S, M, L và phụ thu extraPrice)
 */
const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên size: 'S', 'M', 'L'
    extraPrice: { type: Number, default: 0 } // Giá phụ thu thêm cho size này
}, { _id: false });

/**
 * Sub-schema cho Toppings đi kèm (Topping: Trân châu, Thạch, Kem cheese...)
 */
const toppingSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên topping
    price: { type: Number, required: true }  // Giá tiền topping
}, { _id: false });

/**
 * Schema chính cho Đồ uống (Drink Schema)
 */
const drinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên đồ uống không được để trống'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Giá đồ uống không được để trống'],
            min: [0, 'Giá tiền không được nhỏ hơn 0']
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Quan hệ khóa ngoại tới Collection 'Category'
            required: [true, 'Đồ uống phải thuộc một danh mục']
        },
        image: {
            type: String,
            default: '' // Đường dẫn tên file ảnh lưu trong thư mục public/images
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        sizes: [sizeSchema],        // Danh sách mảng các Size khả dụng
        toppings: [toppingSchema],  // Danh sách mảng các Topping khả dụng
        isAvailable: {
            type: Boolean,
            default: true // Trạng thái còn hàng / tạm hết hàng
        },
        isDeleted: {
            type: Boolean,
            default: false // Cờ Soft Delete (Xóa mềm giữ toàn vẹn dữ liệu)
        }
    },
    {
        timestamps: true // Tự động tạo createdAt và updatedAt
    }
);

// Tạo Model 'Drink'
const Drink = mongoose.model('Drink', drinkSchema);

module.exports = Drink;