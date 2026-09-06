const createError = require('http-errors');
const Category = require('../models/category.model');

/**
 * Get List of Categories API
 */
exports.getCategories = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        const categories = await Category.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Category by ID API
 */
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            throw createError(404, 'Category not found.');
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create Category API (Admin Only)
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            throw createError(400, 'Category name is required.');
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            throw createError(400, 'Category name already exists.');
        }

        const newCategory = await Category.create({
            name: name.trim(),
            description
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: newCategory
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Category API (Admin Only)
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        if (!name || !name.trim()) {
            throw createError(400, 'Category name cannot be empty.');
        }

        const duplicateCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: categoryId }
        });

        if (duplicateCategory) {
            throw createError(400, 'Category name is already used by another category.');
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name: name.trim(), description },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            throw createError(404, 'Category to update was not found.');
        }

        res.json({
            success: true,
            message: 'Category updated successfully.',
            data: updatedCategory
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Category API (Admin Only)
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            throw createError(404, 'Category to delete was not found.');
        }

        res.json({
            success: true,
            message: 'Category deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
