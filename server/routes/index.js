const express = require('express');
const router = express.Router();

/* GET home page - Chuyển hướng về danh sách đồ uống */
router.get('/', function(req, res, next) {
    res.redirect('/drinks');
});

module.exports = router;
