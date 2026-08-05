const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

//GET /auth/register - hiển thị form đăng ký
exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Đăng ký tài khoản' });
}

//POST /auth/register - xử lý đăng ký
exports.postRegister = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMap = {};
            errors.array().forEach(e => { errMap[e.path] = e.msg; });
            return res.render('auth/register', {
                title: 'Đăng ký tài khoản',
                errors: errMap,
                oldData: req.body
            });
        }

        const { fullname, email, password } = req.body;

        //kiểm tra email trùng
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Đăng ký tài khoản',
                errors: { email: 'Email này đã dược đăng ký' },
                oldData: req.body
            });
        }

        //tạo user mới,(user model sẽ tự mã hóa password qua pre('save') hook)
        const newUser = new User({ fullname, email, password });
        await newUser.save();

        //cấp session và chuyển hướng
        req.session.userId = newUser._id;
        req.session.fullname = newUser.fullname;
        req.session.role = newUser.role;

        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

//GET /auth/logic - Hiển thị form đăng nhập
exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Đăng nhập' });
}

//POST /auth/login - xử lý đăng nhập
exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('auth/login', {
                title: 'Đăng nhập',
                error: 'Vui lòng đăng nhập đầy đủ email và mật khẩu',
                oldEmail: email

            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', {
                title: 'Đăng nhập',
                error: 'Email hoặc mật khẩu không chính xác',
                oldEmail: email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', {
                title: 'Đăng nhập',
                error: 'Email hoặc mật khẩu không chính xác',
                oldEmail: email
            });
        }
        //đăng nhập thàh công --> cấp session
        req.session.userId = user._id;
        req.session.fullname = user.fullname;
        req.session.role = user.role;

        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

//xủ lý đăng xuất
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.err('Lỗi khi hủy session', err);
        }
        res.redirect('auth/loin');
    });
};