const express = require('express');
const router = express.Router();
const apiCategoryController = require('../controllers/api.category.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');

// Public Route: Lấy danh sách danh mục
router.get('/', apiCategoryController.getCategories);
router.get('/:id', apiCategoryController.getCategoryById);
// Protected Admin Routes: Cần Token hợp lệ + Quyền Admin
router.post('/', authenticateJWT, requireAdmin, apiCategoryController.createCategory);
router.put('/:id', authenticateJWT, requireAdmin, apiCategoryController.updateCategory);
router.delete('/:id', authenticateJWT, requireAdmin, apiCategoryController.deleteCategory);

module.exports = router;
