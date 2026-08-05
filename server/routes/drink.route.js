const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drink.controller')
const requireLogin = require('../middlewares/requireLogin')
const requireAdmin = require('../middlewares/requireAdmin')
const upload = require('../middlewares/upload')

// Tất cả routes đồ uống đều yêu cầu đăng nhập
router.use(requireLogin)

//xem danh sách đồ uống
router.get('/', drinkController.getDrinks);

//các chức năng thêm sửa xóa bắt buộc quyền ADMIN
router.get('/new', requireAdmin, drinkController.getCreate)
router.post('/', requireAdmin, upload.single('image'), drinkController.postCreate);

router.get('/:id/edit', requireAdmin, drinkController.getEdit)
router.post('/:id/update', requireAdmin, upload.single('image'), drinkController.postUpdate);

router.post('/:id/delete', requireAdmin, drinkController.postDelete);

module.exports = router;
