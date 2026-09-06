require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');
const { storeRefreshToken, redisClient } = require('../repositories/token.repository');
const apiAuthController = require('../controllers/api.auth.controller');

const testFullLogin = async () => {
    try {
        console.log('1. Connecting to MongoDB...');
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB Connected OK.');

        console.log('2. Testing Redis status...');
        const redisStatus = redisClient.status;
        console.log('Redis status:', redisStatus);

        console.log('3. Testing User query...');
        const user = await User.findOne({ email: 'admin@brewista.com' });
        console.log('User found:', user ? user.email : 'NOT FOUND');

        console.log('4. Simulating Login Controller...');
        const req = {
            body: {
                email: 'admin@brewista.com',
                password: 'admin123456'
            }
        };

        const res = {
            json: (data) => {
                console.log('LOGIN SUCCESS RESPONSE:');
                console.log('Success:', data.success);
                console.log('AccessToken exists:', !!data.accessToken);
                console.log('RefreshToken exists:', !!data.refreshToken);
                console.log('User role:', data.user ? data.user.role : null);
            },
            status: (code) => {
                console.log('HTTP Status Code:', code);
                return res;
            }
        };

        const next = (err) => {
            console.error('LOGIN ERROR IN NEXT:', err);
        };

        await apiAuthController.login(req, res, next);

        process.exit(0);
    } catch (err) {
        console.error('TEST FATAL ERROR:', err);
        process.exit(1);
    }
};

testFullLogin();
