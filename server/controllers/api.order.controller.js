// Nạp Models Order và Drink
const Order = require('../models/order.model');
const Drink = require('../models/drink.model');

/**
 * [POST] /api/v1/orders - Khách hàng đặt đơn hàng mới
 * Quy tắc an toàn: Server-side Total Price Calculation (Tự tính toán giá tiền phía Server)
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { items, phone, address, note } = req.body;
        const userId = req.user.id; // Lấy từ token đã verify ở middleware authenticateJWT

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Đơn hàng phải có ít nhất 1 món.' });
        }

        let calculatedTotal = 0;
        const processedItems = [];

        // Duyệt từng món ăn gửi lên để Server tự tra giá gốc trong DB
        for (const item of items) {
            const drink = await Drink.findOne({ _id: item.drinkId, isDeleted: false });
            if (!drink || !drink.isAvailable) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Món ăn [${item.drinkId}] hiện tạm hết hoặc không tồn tại.` 
                });
            }

            let itemPrice = drink.price; // Đơn giá gốc từ DB

            // Cộng thêm phụ thu của Size nếu khách chọn
            if (item.selectedSize && drink.sizes && drink.sizes.length > 0) {
                const foundSize = drink.sizes.find(s => s.name === item.selectedSize);
                if (foundSize) itemPrice += foundSize.extraPrice;
            }

            // Cộng thêm giá tiền các Toppings nếu khách chọn
            let selectedToppingNames = [];
            if (item.selectedToppings && Array.isArray(item.selectedToppings)) {
                for (const topName of item.selectedToppings) {
                    const foundTop = drink.toppings.find(t => t.name === topName);
                    if (foundTop) {
                        itemPrice += foundTop.price;
                        selectedToppingNames.push(foundTop.name);
                    }
                }
            }

            // Thành tiền món = (giá gốc + size + toppings) * số lượng
            const itemSubtotal = itemPrice * item.quantity;
            calculatedTotal += itemSubtotal;

            // Lưu snapshot thông tin món ăn tại thời điểm đặt đơn
            processedItems.push({
                drink: drink._id,
                name: drink.name,
                price: itemPrice,
                quantity: item.quantity,
                selectedSize: item.selectedSize || 'M',
                selectedToppings: selectedToppingNames
            });
        }

        // Tạo instance Order mới với giá tiền Server tự tính toán
        const newOrder = new Order({
            user: userId,
            items: processedItems,
            totalAmount: calculatedTotal,
            phone,
            address,
            note: note ? note.trim() : ''
        });

        await newOrder.save();
        res.status(201).json({ 
            success: true, 
            message: 'Đặt đơn hàng thành công!', 
            data: newOrder 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * [GET] /api/v1/orders/my-orders - Xem lịch sử đơn hàng của người dùng hiện tại
 */
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

/**
 * [GET] /api/v1/orders - Xem toàn bộ đơn hàng hệ thống (Admin)
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .populate('user', 'fullname email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

/**
 * [PATCH] /api/v1/orders/:id/status - Cập nhật riêng trạng thái đơn hàng (Admin)
 */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ.' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

        res.json({ success: true, message: 'Cập nhật trạng thái đơn thành công!', data: order });
    } catch (error) {
        next(error);
    }
};
