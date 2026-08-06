const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    drink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Số lượng phải tối thiếu là 1']
    },
    selectedSize: {
        type: String,
        default: 'M'
    },
    selectedToppings: [{ type: String }]
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
            default: 'pending'
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
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;