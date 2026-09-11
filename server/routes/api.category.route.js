const express = require('express');
const router = express.Router();
const apiCategoryController = require('../controllers/api.category.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');
const { readRateLimiter, writeRateLimiter } = require('../middlewares/rateLimiter');

// Public Route: Lấy danh sách danh mục
router.get('/', readRateLimiter, apiCategoryController.getCategories);
router.get('/:id', readRateLimiter, apiCategoryController.getCategoryById);
// Protected Admin Routes: Cần Token hợp lệ + Quyền Admin
router.post('/', writeRateLimiter, authenticateJWT, requireAdmin, apiCategoryController.createCategory);
router.put('/:id', writeRateLimiter, authenticateJWT, requireAdmin, apiCategoryController.updateCategory);
router.delete('/:id', writeRateLimiter, authenticateJWT, requireAdmin, apiCategoryController.deleteCategory);

module.exports = router;
