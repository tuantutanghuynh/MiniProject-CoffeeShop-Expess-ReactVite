require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const env = require('../config/env');
const apiAuthController = require('../controllers/api.auth.controller');

const testController = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        const req = {
            body: {
                email: 'admin@brewista.com',
                password: 'admin123456'
            }
        };

        const res = {
            json: (data) => console.log('RESPONSE JSON:', data),
            status: (code) => {
                console.log('RESPONSE STATUS:', code);
                return res;
            }
        };

        const next = (err) => console.error('NEXT ERROR:', err);

        await apiAuthController.login(req, res, next);
        process.exit(0);
    } catch (err) {
        console.error('CATCH ERROR:', err);
        process.exit(1);
    }
};

testController();
