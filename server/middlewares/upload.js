const multer = require('multer');
const path = require('path');

//Cấu hình vị trí lưu file và đổi tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.filename + '-' + uniqueSuffix + ext);
    }
});

//filter chỉ cho phép upload file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file định dạng hình ảnh!'), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //giới hạn 5mb
});

module.exports = upload;
