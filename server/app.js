require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');

const connectDB = require('./config/db');

// Connect Database
connectDB();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.route');
const categoryRouter = require('./routes/category.route');
const drinkRouter = require('./routes/drink.route');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'coffee_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
    })
);

// Global locals for views
app.use((req, res, next) => {
    res.locals.accountId = req.session.accountId || null;
    res.locals.fullname = req.session.fullname || null;
    res.locals.role = req.session.role || null;
    next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);
app.use('/drinks', drinkRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: 'Lỗi ' + (err.status || 500) });
});

module.exports = app;
