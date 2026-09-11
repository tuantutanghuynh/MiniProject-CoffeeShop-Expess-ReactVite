const express = require('express');
const router = express.Router();
const apiDrinkController = require('../controllers/api.drink.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');
const upload = require('../middlewares/upload');
const { readRateLimiter, writeRateLimiter } = require('../middlewares/rateLimiter');

// Public Routes: Xem danh sách và chi tiết món ăn
router.get('/', readRateLimiter, apiDrinkController.getDrinks);
router.get('/:id', readRateLimiter, apiDrinkController.getDrinkById);

// Protected Admin Routes: Cần Token hợp lệ + Quyền Admin (+ Upload ảnh đối với POST/PUT)
router.post('/', writeRateLimiter, authenticateJWT, requireAdmin, upload.single('image'), apiDrinkController.createDrink);
router.put('/:id', writeRateLimiter, authenticateJWT, requireAdmin, upload.single('image'), apiDrinkController.updateDrink);
router.delete('/:id', writeRateLimiter, authenticateJWT, requireAdmin, apiDrinkController.deleteDrink);

module.exports = router;
