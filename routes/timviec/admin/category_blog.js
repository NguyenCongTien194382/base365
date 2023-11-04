var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var categoryBlog = require('../../../controllers/timviec/admin/category_blog');

// Thêm mới danh mục blog
router.post('/add', formData.parse(), categoryBlog.add);

// Danh sách danh mục blog
router.post('/getList', formData.parse(), categoryBlog.getList);

// Chỉnh sửa danh mục blog
router.post('/edit', formData.parse(), categoryBlog.edit);

// Lấy chi tiết danh mục blog
router.post('/getDetail', formData.parse(), categoryBlog.getDetail);

// Xóa thông tin danh mục blog 
router.post('/deleteMany', formData.parse(), categoryBlog.deleteMany);

// Active danh mục blog 
router.post('/active', formData.parse(), categoryBlog.active);

module.exports = router;