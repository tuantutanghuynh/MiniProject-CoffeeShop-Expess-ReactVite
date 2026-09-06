const createError = require('http-errors');
const Order = require('../models/order.model');
const Drink = require('../models/drink.model');

/**
 * Create Order API (Server-side Total Price Calculation for Security)
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { items, phone, address, note } = req.body;
        const userId = req.user.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw createError(400, 'Order cart items cannot be empty.');
        }

        if (!phone || !address) {
            throw createError(400, 'Phone number and delivery address are required.');
        }

        let calculatedTotalAmount = 0;
        const orderSnapshotItems = [];

        for (const item of items) {
            const drink = await Drink.findOne({ _id: item.drinkId, isDeleted: false, isAvailable: true });
            if (!drink) {
                throw createError(400, `Drink item ID ${item.drinkId} is unavailable or does not exist.`);
            }

            let itemUnitPrice = drink.price;

            // Calculate size extra price
            if (item.selectedSize && drink.sizes && drink.sizes.length > 0) {
                const foundSize = drink.sizes.find(s => s.name === item.selectedSize);
                if (foundSize) {
                    itemUnitPrice += foundSize.extraPrice;
                }
            }

            // Calculate toppings price
            if (item.selectedToppings && Array.isArray(item.selectedToppings) && drink.toppings) {
                for (const topName of item.selectedToppings) {
                    const foundTopping = drink.toppings.find(t => t.name === topName);
                    if (foundTopping) {
                        itemUnitPrice += foundTopping.price;
                    }
                }
            }

            const itemTotalPrice = itemUnitPrice * item.quantity;
            calculatedTotalAmount += itemTotalPrice;

            orderSnapshotItems.push({
                drink: drink._id,
                name: drink.name,
                price: itemUnitPrice,
                selectedSize: item.selectedSize || 'M',
                selectedToppings: item.selectedToppings || [],
                quantity: item.quantity
            });
        }

        const newOrder = await Order.create({
            user: userId,
            items: orderSnapshotItems,
            totalAmount: calculatedTotalAmount,
            phone,
            address,
            note,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            data: newOrder
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get My Orders API (Authenticated User)
 */
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get All Orders API (Admin Only)
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullname email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Order Status API (Admin Only - PATCH)
 */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            throw createError(400, 'Invalid order status. Allowed: ' + validStatuses.join(', '));
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            throw createError(404, 'Order not found.');
        }

        res.json({
            success: true,
            message: 'Order status updated successfully.',
            data: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};
