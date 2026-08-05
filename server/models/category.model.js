// TODO: Định nghĩa Category Model tại đây
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên danh mục không được để trống'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;