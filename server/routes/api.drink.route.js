const express = require('express');
const router = express.Router();
const apiDrinkController = require('../controllers/api.drink.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const requireAdmin = require('../middlewares/requireAdmin');
const upload = require('../middlewares/upload');

// Public Routes: Xem danh sách và chi tiết món ăn
router.get('/', apiDrinkController.getDrinks);
router.get('/:id', apiDrinkController.getDrinkById);

// Protected Admin Routes: Cần Token hợp lệ + Quyền Admin (+ Upload ảnh đối với POST/PUT)
router.post('/', authenticateJWT, requireAdmin, upload.single('image'), apiDrinkController.createDrink);
router.put('/:id', authenticateJWT, requireAdmin, upload.single('image'), apiDrinkController.updateDrink);
router.delete('/:id', authenticateJWT, requireAdmin, apiDrinkController.deleteDrink);

module.exports = router;
