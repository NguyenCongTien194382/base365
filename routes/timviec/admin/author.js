var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var author = require('../../../controllers/timviec/admin/author');

// Thêm mới tác giả bài viết
router.post('/add', formData.parse(), author.add);

// Danh sách tác giả bài viết
router.post('/getList', formData.parse(), author.getList);

// Chỉnh sửa tác giả bài viết
router.post('/edit', formData.parse(), author.edit);

// Lấy chi tiết tác giả bài viết
router.post('/getDetail', formData.parse(), author.getDetail);

// Xóa thông tin tác giả bài viết
router.post('/deleteMany', formData.parse(), author.deleteMany);

module.exports = router;