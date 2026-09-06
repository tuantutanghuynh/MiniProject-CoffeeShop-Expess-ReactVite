require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');

const resetAdmin = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@brewista.com';

        // Xóa hoàn toàn các tài khoản admin cũ trùng email nếu có
        await User.deleteMany({ email: adminEmail });
        console.log(`Cleared existing admin accounts with email: ${adminEmail}`);

        // Tạo tài khoản Admin mới tinh
        const newAdmin = await User.create({
            fullname: 'Brewista Administrator',
            email: adminEmail,
            password: 'admin123456',
            role: 'admin',
            isDeleted: false
        });

        console.log('-------------------------------------------');
        console.log('Recreated Fresh Admin Account Successfully:');
        console.log(`ID:       ${newAdmin._id}`);
        console.log(`Name:     ${newAdmin.fullname}`);
        console.log(`Email:    ${newAdmin.email}`);
        console.log(`Password: admin123456`);
        console.log(`Role:     ${newAdmin.role}`);
        console.log('-------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin account:', error.message);
        process.exit(1);
    }
};

resetAdmin();
