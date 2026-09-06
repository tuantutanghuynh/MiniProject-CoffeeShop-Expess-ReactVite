require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');

const seedAdmin = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@brewista.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'admin';
            existingAdmin.password = 'admin123456';
            await existingAdmin.save();
            console.log(`Admin account updated successfully:`);
        } else {
            const newAdmin = await User.create({
                fullname: 'Brewista Administrator',
                email: adminEmail,
                password: 'admin123456',
                role: 'admin'
            });
            console.log(`Admin account created successfully:`);
        }

        console.log(`Email: ${adminEmail}`);
        console.log(`Password: admin123456`);
        console.log(`Role: admin`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin account:', error.message);
        process.exit(1);
    }
};

seedAdmin();
