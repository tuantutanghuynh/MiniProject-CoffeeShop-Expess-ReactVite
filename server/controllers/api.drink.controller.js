const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const Drink = require('../models/drink.model');
const Category = require('../models/category.model');

/**
 * Get List of Drinks API (Filter by keyword, categoryId, isAvailable)
 */
exports.getDrinks = async (req, res, next) => {
    try {
        const { keyword, categoryId, isAvailable } = req.query;
        let query = { isDeleted: false };

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        if (categoryId) {
            query.category = categoryId;
        }

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        const drinks = await Drink.find(query)
            .populate('category', 'name description')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: drinks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Drink by ID API
 */
exports.getDrinkById = async (req, res, next) => {
    try {
        const drink = await Drink.findOne({ _id: req.params.id, isDeleted: false })
            .populate('category', 'name description');

        if (!drink) {
            throw createError(404, 'Drink not found.');
        }

        res.json({
            success: true,
            data: drink
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create Drink API (Admin Only + Multer File Upload)
 */
exports.createDrink = async (req, res, next) => {
    try {
        const { name, price, category, description, isAvailable, sizes, toppings } = req.body;

        if (!name || !price || !category) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            throw createError(400, 'Drink name, price, and category are required.');
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            throw createError(400, 'Selected category does not exist.');
        }

        let parsedSizes = [];
        let parsedToppings = [];

        if (sizes) {
            parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
        }
        if (toppings) {
            parsedToppings = typeof toppings === 'string' ? JSON.parse(toppings) : toppings;
        }

        const newDrink = await Drink.create({
            name: name.trim(),
            price: Number(price),
            category,
            description,
            image: req.file ? req.file.filename : null,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            sizes: parsedSizes,
            toppings: parsedToppings
        });

        res.status(201).json({
            success: true,
            message: 'Drink created successfully.',
            data: newDrink
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

/**
 * Update Drink API (Admin Only + Multer File Upload)
 */
exports.updateDrink = async (req, res, next) => {
    try {
        const drinkId = req.params.id;
        const { name, price, category, description, isAvailable, sizes, toppings } = req.body;

        const existingDrink = await Drink.findOne({ _id: drinkId, isDeleted: false });
        if (!existingDrink) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            throw createError(404, 'Drink to update was not found.');
        }

        let imageFilename = existingDrink.image;

        if (req.file) {
            imageFilename = req.file.filename;
            if (existingDrink.image) {
                const oldImagePath = path.join(__dirname, '../public/images', existingDrink.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        let parsedSizes = existingDrink.sizes;
        let parsedToppings = existingDrink.toppings;

        if (sizes) {
            parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
        }
        if (toppings) {
            parsedToppings = typeof toppings === 'string' ? JSON.parse(toppings) : toppings;
        }

        const updatedDrink = await Drink.findByIdAndUpdate(
            drinkId,
            {
                name: name ? name.trim() : existingDrink.name,
                price: price ? Number(price) : existingDrink.price,
                category: category || existingDrink.category,
                description: description !== undefined ? description : existingDrink.description,
                image: imageFilename,
                isAvailable: isAvailable !== undefined ? isAvailable : existingDrink.isAvailable,
                sizes: parsedSizes,
                toppings: parsedToppings
            },
            { new: true, runValidators: true }
        ).populate('category', 'name description');

        res.json({
            success: true,
            message: 'Drink updated successfully.',
            data: updatedDrink
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

/**
 * Soft Delete Drink API (Admin Only)
 */
exports.deleteDrink = async (req, res, next) => {
    try {
        const drink = await Drink.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!drink) {
            throw createError(404, 'Drink to delete was not found.');
        }

        res.json({
            success: true,
            message: 'Drink deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
