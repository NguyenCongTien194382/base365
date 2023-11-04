const express = require('express');
const blog = require('../../../controllers/timviec/admin/blog');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/listBlog', formData.parse(), blog.listBlog);
router.post('/listCateJob', formData.parse(), blog.listCateJob);
router.post('/addBlog', functions.uploadAvatarForm, blog.addBlog);
router.post('/editBlog', functions.uploadAvatarForm, blog.editBlog);
router.post('/detailBlog', formData.parse(), blog.detailBlog);
router.post('/activeBlog', formData.parse(), blog.activeBlog);
router.post('/hotBlog', formData.parse(), blog.hotBlog);
router.post('/hitsBlog', formData.parse(), blog.hitsBlog);
router.post('/mailBlog', formData.parse(), blog.mailBlog);
router.post('/deleteBlog', formData.parse(), blog.deleteBlog);

module.exports = router;