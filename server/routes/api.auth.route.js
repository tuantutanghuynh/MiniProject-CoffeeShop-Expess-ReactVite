const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const apiAuthController = require('../controllers/api.auth.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { authRateLimiter } = require('../middlewares/rateLimiter');

// Registration Input Validation Rules
const registerRules = [
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Email address is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
// Login Input Validation Rules
const loginRules = [
    body('email').isEmail().withMessage('Email address is invalid')
];

// Public Routes (Protected by authRateLimiter against brute-force attacks)
router.post('/register', authRateLimiter, registerRules, apiAuthController.register);
router.post('/login', authRateLimiter, loginRules, apiAuthController.login);
router.post('/refresh', authRateLimiter, apiAuthController.refresh);

// Protected Routes (Requires valid JWT Access Token)
router.post('/logout', authenticateJWT, apiAuthController.logout);
router.get('/me', authenticateJWT, apiAuthController.getMe);

module.exports = router;
