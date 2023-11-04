const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions')
const controllers = require('../../controllers/timviec/company_vip');

// Trang chủ
router.post('/home', formData.parse(), controllers.home);

// Chi tiết công ty
router.post('/detail', formData.parse(), controllers.detail);

// Tìm kiếm công ty
router.post('/search', formData.parse(), controllers.search);

module.exports = router;