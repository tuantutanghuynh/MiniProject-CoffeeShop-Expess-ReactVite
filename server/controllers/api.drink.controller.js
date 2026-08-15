// Nạp Model Drink và các thư viện File System
const Drink = require('../models/drink.model');
const fs = require('fs');
const path = require('path');

/**
 * [GET] /api/v1/drinks - Lấy danh sách đồ uống (Hỗ trợ lọc theo keyword, categoryId, isAvailable)
 */
exports.getDrinks = async (req, res, next) => {
    try {
        const { keyword, categoryId, isAvailable } = req.query;
        let query = { isDeleted: false }; // Chỉ lấy các món CHƯA bị xóa mềm

        if (keyword && keyword.trim() !== '') {
            query.name = { $regex: keyword.trim(), $options: 'i' };
        }
        if (categoryId && categoryId.trim() !== '') {
            query.category = categoryId;
        }
        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        // populate('category') thực hiện JOIN phụ để lấy tên và mô tả của danh mục
        const drinks = await Drink.find(query)
            .populate('category', 'name description')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: drinks.length, data: drinks });
    } catch (error) {
        next(error);
    }
};

/**
 * [GET] /api/v1/drinks/:id - Lấy thông tin chi tiết của 1 đồ uống
 */
exports.getDrinkById = async (req, res, next) => {
    try {
        const drink = await Drink.findOne({ _id: req.params.id, isDeleted: false }).populate('category', 'name');
        if (!drink) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đồ uống yêu cầu.' });
        }
        res.json({ success: true, data: drink });
    } catch (error) {
        next(error);
    }
};

/**
 * [POST] /api/v1/drinks - Thêm mới đồ uống kèm Upload ảnh (Admin)
 */
exports.createDrink = async (req, res, next) => {
    try {
        const { name, price, category, description, sizes, toppings } = req.body;
        
        // Lấy tên file ảnh đã được Multer middleware xử lý lưu vào đĩa
        const image = req.file ? req.file.filename : '';

        const drink = new Drink({
            name: name.trim(),
            price: Number(price),
            category,
            image,
            description: description ? description.trim() : '',
            sizes: sizes ? JSON.parse(sizes) : [],       // Parse chuỗi JSON gửi từ FormData
            toppings: toppings ? JSON.parse(toppings) : [] // Parse chuỗi JSON gửi từ FormData
        });

        await drink.save();
        res.status(201).json({ success: true, message: 'Thêm đồ uống thành công!', data: drink });
    } catch (error) {
        next(error);
    }
};

/**
 * [PUT] /api/v1/drinks/:id - Cập nhật đồ uống (Admin)
 */
exports.updateDrink = async (req, res, next) => {
    try {
        const drinkId = req.params.id;
        const drink = await Drink.findById(drinkId);
        if (!drink) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đồ uống.' });
        }

        const { name, price, category, description, isAvailable, sizes, toppings } = req.body;
        let imageName = drink.image;

        // Nếu người dùng upload ảnh mới ➔ Xóa ảnh cũ trên đĩa cứng
        if (req.file) {
            if (drink.image) {
                const oldPath = path.join(__dirname, '../public/images', drink.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            imageName = req.file.filename;
        }

        drink.name = name ? name.trim() : drink.name;
        drink.price = price !== undefined ? Number(price) : drink.price;
        drink.category = category || drink.category;
        drink.image = imageName;
        drink.description = description !== undefined ? description.trim() : drink.description;
        drink.isAvailable = isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : drink.isAvailable;
        if (sizes) drink.sizes = JSON.parse(sizes);
        if (toppings) drink.toppings = JSON.parse(toppings);

        await drink.save();
        res.json({ success: true, message: 'Cập nhật đồ uống thành công!', data: drink });
    } catch (error) {
        next(error);
    }
};

/**
 * [DELETE] /api/v1/drinks/:id - Xóa mềm đồ uống (Soft Delete: isDeleted = true)
 */
exports.deleteDrink = async (req, res, next) => {
    try {
        const drink = await Drink.findById(req.params.id);
        if (drink) {
            drink.isDeleted = true; // Xóa mềm giữ toàn vẹn dữ liệu đơn hàng cũ
            await drink.save();
        }
        res.json({ success: true, message: 'Xóa đồ uống thành công!' });
    } catch (error) {
        next(error);
    }
};
