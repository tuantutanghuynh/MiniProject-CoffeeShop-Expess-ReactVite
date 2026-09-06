const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

/**
 * Multer Disk Storage Configuration
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'drink-' + uniqueSuffix + ext);
    }
});

/**
 * File MIME Type Filter (Images only: jpg, jpeg, png, webp, gif)
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(createError(400, 'Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit max file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;
