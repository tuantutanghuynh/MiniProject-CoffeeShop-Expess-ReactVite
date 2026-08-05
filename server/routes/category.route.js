const express = require('express');
const requireLogin = require('../middlewares/requireLogin');
const requireAdmin = require('../middlewares/requireAdmin');
const router = express.Router();
const categoryController = require('../controllers/category.controller')

// bắt buộc đăng nhập 
router.use(requireLogin)

//trang xem danh sách danh mục
router.get('/', categoryController.getCategory);

//các chức năng thêm sửa, xóa - Bắt buộc phải là admin
router.get('/new', requireAdmin, categoryController.getCreate);
router.post('/', requireAdmin, categoryController.postCreate);
router.get('/:id/edit', requireAdmin, categoryController.getEdit);
router.post('/:id/update', requireAdmin, categoryController.postUpdate);
router.post('/:id/delete', requireAdmin, categoryController.postDelete);

module.exports = router;
