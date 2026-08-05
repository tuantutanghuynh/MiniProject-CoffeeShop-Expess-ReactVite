const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// validate rule cho đăng ký
const registerValidation = [
    body('fullname').notEmpty().withMessage('Họ tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải tối thiểu 6 ký tự'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu nhập lại không khớp');
        }
        return true;
    })
];

// route đăng ký
router.get('/register', authController.getRegister);
router.post('/register', registerValidation, authController.postRegister);

// route đăng nhập
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// route đăng xuất
router.get('/logout', authController.logout);

module.exports = router;
