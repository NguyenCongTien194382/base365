var express = require('express');
var router = express.Router();
var blog = require('../../controllers/timviec/blog');
var formData = require('express-form-data');
const functions = require('../../services/functions');

// api lấy danh sách tất cả blog
router.post('/getAllListBlog', formData.parse(), blog.getAllListBlog);

// api lấy danh sách blog
router.post('/getListBlog', formData.parse(), blog.listBlog);

// api lấy chi tiết blog
router.post('/detail', formData.parse(), blog.detail);

// api chi tiết tác giả
router.post('/author', formData.parse(), blog.getAuthorDetail);

// api danh sách danh mục
router.post('/getListCategoryBlog', formData.parse(), blog.getListCategoryBlog);

// api danh sách blog theo danh mục
router.post('/getListBlogByCate', formData.parse(), blog.getListBlogByCate);

module.exports = router;