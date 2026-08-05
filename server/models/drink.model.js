// TODO: Định nghĩa Drink Model tại đây
const mongoose = require('mongoose');


const sizeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ['S', 'M', 'L'],
            required: true
        },
        extraPrice: {
            type: Number,
            default: 0,
            min: 0
        }
    }, { _id: false });

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const drinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên đồ uống không được để trống.'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Giá đồ uống không được để trống'],
            min: [0, 'Giá đồ uống không được là số âm']
        },
        sizes: [sizeSchema],
        toppings: [toppingSchema],
        image: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Đồ uống phải thuộc một danh mục']
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Drink = mongoose.model('Drink', drinkSchema);
module.exports = Drink;