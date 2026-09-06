require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');
const apiAuthController = require('../controllers/api.auth.controller');
const apiOrderController = require('../controllers/api.order.controller');
const { verifyAccessToken } = require('../services/jwt.service');

const testAdminFlow = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        const user = await User.findOne({ email: 'admin@brewista.com' });
        
        const { generateAccessToken } = require('../services/jwt.service');
        const { token: accessToken, payload } = generateAccessToken(user);

        console.log('Generated Access Token:', accessToken);
        console.log('Payload:', payload);

        // Test verifying token
        const decoded = verifyAccessToken(accessToken);
        console.log('Decoded Token:', decoded);

        // Test authenticateJWT simulation
        const req = {
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                jti: decoded.jti,
                exp: decoded.exp
            }
        };

        const res = {
            json: (data) => console.log('GET ORDERS DATA SUCCESS:', data ? (data.data ? data.data.length : data) : null),
            status: (code) => {
                console.log('STATUS:', code);
                return res;
            }
        };

        const next = (err) => console.error('NEXT ERROR IN GET ORDERS:', err);

        await apiOrderController.getAllOrders(req, res, next);
        process.exit(0);
    } catch (err) {
        console.error('TEST ERROR:', err);
        process.exit(1);
    }
};

testAdminFlow();
