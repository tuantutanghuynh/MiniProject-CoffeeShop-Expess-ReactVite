// Nạp Model Category
const Category = require('../models/category.model');

/**
 * [GET] /api/v1/categories - Lấy tất cả danh mục (Hỗ trợ lọc theo keyword)
 */
exports.getCategories = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        let query = {};
        
        // Nếu có truyền từ khóa tìm kiếm
        if (keyword && keyword.trim() !== '') {
            // Dùng toán tử $regex của MongoDB tìm kiếm không phân biệt chữ hoa thường ($options: 'i')
            query.name = { $regex: keyword.trim(), $options: 'i' };
        }
        
        // Sắp xếp danh mục mới tạo lên đầu (.sort({ createdAt: -1 }))
        const categories = await Category.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

/**
 * [POST] /api/v1/categories - Tạo danh mục mới (Yêu cầu quyền Admin)
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống.' });
        }
        
        // Kiểm tra trùng tên danh mục
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Tên danh mục này đã tồn tại.' });
        }
        
        const category = new Category({ 
            name: name.trim(), 
            description: description ? description.trim() : '' 
        });
        
        await category.save();
        res.status(201).json({ success: true, message: 'Tạo danh mục thành công!', data: category });
    } catch (error) {
        next(error);
    }
};

/**
 * [PUT] /api/v1/categories/:id - Cập nhật thông tin danh mục (Admin)
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;
        
        // Kiểm tra xem có danh mục NÀO KHÁC (_id: { $ne: categoryId }) bị trùng tên hay không
        const existing = await Category.findOne({ name: name.trim(), _id: { $ne: categoryId } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Tên danh mục này đã bị trùng.' });
        }
        
        // { new: true } để Mongoose trả về Document sau khi đã update thay vì trước khi update
        const category = await Category.findByIdAndUpdate(
            categoryId, 
            { name: name.trim(), description: description ? description.trim() : '' },
            { new: true }
        );
        
        res.json({ success: true, message: 'Cập nhật danh mục thành công!', data: category });
    } catch (error) {
        next(error);
    }
};

/**
 * [DELETE] /api/v1/categories/:id - Xóa danh mục khỏi hệ thống (Admin)
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Xóa danh mục thành công!' });
    } catch (error) {
        next(error);
    }
};
