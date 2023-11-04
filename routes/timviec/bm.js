const express = require('express');
const bm = require('../../controllers/timviec/bm');
const formData = require('express-form-data');
const router = express.Router();

// Trang chủ biểu mẫu
router.post('/', bm.home);

// Danh mục biểu mẫu
router.post('/cate', formData.parse(), bm.cate);

// Lấy biểu mẫu theo danh mục
router.post('/listcate', formData.parse(), bm.listcate);

// Lấy 10 tin ở các box tài liệu mới
router.post('/tlm', formData.parse(), bm.tlm);

// Tìm kiếm biểu mẫu
router.post('/search', formData.parse(), bm.search);

// Danh sách biểu mẫu theo tag
router.post('/tag', formData.parse(), bm.tag);

// Chi tiết biểu mẫu
router.post('/detail', formData.parse(), bm.detail);

module.exports = router;