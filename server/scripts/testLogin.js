require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');

const testLogin = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        const email = 'admin@brewista.com';
        const password = 'admin123456';

        const user = await User.findOne({ email });
        console.log('Found user in DB:', user ? { id: user._id, email: user.email, role: user.role, isDeleted: user.isDeleted } : null);

        if (user) {
            const isMatch = await user.comparePassword(password);
            console.log('comparePassword result:', isMatch);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error testing login:', err);
        process.exit(1);
    }
};

testLogin();
