const Drink = require('../models/drink.model')
const Category = require('../models/category.model')
const fs = require('fs')
const path = require('path');
const { title } = require('process');

//GET /drinks Hiển thị danh sách đồ uống,tìm kiếm và lọc theo danh mục
exports.getDrinks = async (req, res, next) => {
    try {
        const { keyword, categoryId } = req.query;
        let query = {};

        if (keyword && keyword.trim() !== '') {
            query.name = { $regex: keyword.trim(), $options: 'i' }
        }

        if (categoryId && categoryId.trim() !== '') {
            query.category = categoryId;
        }

        const drinks = await Drink.find(query)
            .populate('category')
            .sort({ createdAt: -1 });

        const categories = await Category.find().sort({ name: 1 });

        res.render('drinks/index', {
            title: 'Menu đồ uống',
            drinks,
            categories,
            keyword: keyword || '',
            categoryId: categoryId || ''
        });
    } catch (error) {
        next(error)
    }
};

//GET /drinks/new - HIển thị form thêm mới đồ uống
exports.getCreate = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.render('drinks/create', {
            title: 'Thêm đồ uống mới',
            categories
        });
    } catch (error) {
        next(error);
    }
};

//POST /drinks xử lý thêm đồ uống mới
exports.postCreate = async (req, res, next) => {
    try {
        const { name, price, category, description } = req.body;
        const image = req.file ? req.file.filename : '';
        const newDrink = new Drink({
            name: name.trim(),
            price: Number(price),
            category,
            image,
            description: description ? description.trim() : ''
        });
        await newDrink.save();
        res.redirect('/drinks');
    } catch (error) {
        next(error);
    }
};

//GET /drinks/:id/edit - Hiện form chỉnh sửa đồ uống
exports.getEdit = async (req, res, next) => {
    try {
        const drink = await Drink.findById(req.params.id);
        if (!drink) {
            return res.status(404).render('error', { title: '404 Not Found', message: 'Không tìm thấy đồ uống này' });
        }

        const categories = await Category.find().sort({ name: 1 });
        res.render('drinks/edit', {
            title: 'Sửa đồ uống',
            drink,
            categories
        });
    } catch (error) {
        next(error);
    }
};

//POST /drinks/:id/update - xử lý cập nhật đồ uóng
exports.postUpdate = async (req, res, next) => {
    try {
        const dinkId = req.params.id;
        const { name, price, category, description } = req.body;

        const drink = await Drink.findById(dinkId);
        if (!drink) {
            return res.status(404).render('error', { title: '404 Not Found', message: 'Không tìm thấy đồ uống này' });
        }

        let imageName = drink.image;

        //nếu có upload ảnh mới --> xóa ảnh cũ khỏi thư mục public/images
        if (req.file) {
            if (drink.image) {
                const oldImagePath = path.join(__dirname, '../public/images', drink.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imageName = req.file.filename;
        }

        drink.name = name.trim();
        drink.price = Number(price);
        drink.category = category;
        drink.image = imageName;
        drink.description = description ? description.trim() : '';

        await drink.save();
        res.redirect('/drinks');
    } catch (error) {
        next(error);
    }
};

//POST drinks/:id/delêt - xử lý xóa dồ uống
exports.postDelete = async (req, res, next) => {
    try {
        const drink = await Drink.findById(req.params.id);
        if (drink) {
            //xóa file ảnh trên sever nếu có
            if (drink.image) {
                const imagePath = path.join(__dirname, '../public/images', drink.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await Drink.findByIdAndDelete(req.params.id);
        }
        res.redirect('/drinks')
    } catch (error) {
        next(error);
    }
};