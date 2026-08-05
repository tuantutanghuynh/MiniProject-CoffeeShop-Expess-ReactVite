const Category = require('../models/category.model');

//GET /categories - Danh sách danh mjc và tìm kiếm
exports.getCategory = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        let query = {};

        if (keyword && keyword.trim() !== '') {
            query.name = { $regex: keyword.trim(), $options: 'i' };
        }

        const categories = await Category.find(query).sort({ createdAt: -1 });

        res.render('categories/index', {
            title: 'Quản lý danh mục',
            categories,
            keyword: keyword || ''
        });
    } catch (error) {
        next(error);
    }
};

//GET /categories/new Hiển thị form thêm mới
exports.getCreate = (req, res) => {
    res.render('categories/create', { title: 'Thêm danh mục mới' });
};

//POST /categories - xử lý thêm mới danh mục
exports.postCreate = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim() === '') {
            return res.render('categories/create', {
                title: 'Thêm danh mục mới',
                errors: { name: 'Tên danh mục không được để trống' },
                category: { name, description }
            })
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.render('categories/create', {
                title: 'Thêm danh mục mới',
                errors: { name: 'Tên danh mục mới đã tồn tại' },
                category: { name, description }
            });
        }

        const newCategory = new Category({
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        await newCategory.save();
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

//GET /categories/:id/edit - hiểm thị form chỉnh sửa
exports.getEdit = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).render('error', {
                title: '404 not found',
                message: 'Không tìm thấy danh mục yêu cầu'
            });
        }

        res.render('categories/edit', {
            title: 'Sửa danh mục',
            category
        });
    } catch (error) {
        next(error);
    }
};

//POST - /categories/:id/update - xử lý cập nhật danh mục
exports.postUpdate = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        if (!name || name.trim() === '') {
            return res.render('categories/edit', {
                title: 'Sửa danh mục',
                errors: { name: 'Tên danh mục không được để trống' },
                category: { _id: categoryId, name, description }
            });
        }

        //kiểm tra xem tên mới có bị trùng danh mục khác không
        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: categoryId }
        });

        if (existingCategory) {
            return res.render('categories/edit', {
                title: 'Sửa danh mục',
                errors: { name: 'Tên danh mục đã tồn tại' },
                category: { _id: categoryId, name, description }
            });
        }

        await Category.findByIdAndUpdate(categoryId, {
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        res.redirect('/categories')

    } catch (error) {
        next(error);
    }
};

//POST /categories/:id/delete - xử lý xóa danh mục
exports.postDelete = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};