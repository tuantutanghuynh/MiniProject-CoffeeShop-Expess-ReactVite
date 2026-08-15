// Thư viện Mongoose
const mongoose = require('mongoose');

/**
 * Sub-schema snapshot chi tiết từng món ăn trong Đơn hàng (OrderItem)
 * Lưu trữ snapshot tên món và giá tại thời điểm đặt để tránh bị thay đổi nếu Admin sửa giá trong DB về sau.
 */
const orderItemSchema = new mongoose.Schema({
    drink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink',
        required: true
    },
    name: { type: String, required: true },  // Snapshot tên món tại thời điểm đặt
    price: { type: Number, required: true }, // Snapshot đơn giá thực tế tại thời điểm đặt
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Số lượng phải lớn hơn hoặc bằng 1']
    },
    selectedSize: { type: String, default: 'M' },       // Size đã chọn: 'S', 'M', 'L'
    selectedToppings: [{ type: String }]                // Mảng chứa tên các topping đã chọn
}, { _id: false });

/**
 * Schema chính cho Đơn hàng (Order Schema)
 */
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Người đặt hàng
            required: true
        },
        items: [orderItemSchema], // Mảng danh sách các món đặt
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Tổng tiền không được nhỏ hơn 0']
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
            default: 'pending' // Trạng thái mặc định khi vừa tạo đơn: Đang chờ xử lý
        },
        phone: {
            type: String,
            required: [true, 'Số điện thoại nhận hàng không được để trống']
        },
        address: {
            type: String,
            required: [true, 'Địa chỉ giao hàng không được để trống']
        },
        note: {
            type: String,
            default: '' // Ghi chú thêm từ khách hàng
        }
    },
    {
        timestamps: true // Tự động lưu thời gian tạo đơn createdAt và updatedAt
    }
);

// Tạo Model 'Order'
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;