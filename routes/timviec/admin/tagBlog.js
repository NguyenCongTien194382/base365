const express = require('express');
const TagBlog = require('../../../controllers/timviec/admin/tagBlog');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/listTagBlog', formData.parse(), TagBlog.listTagBlog);
router.post('/addTagBlog', formData.parse(), TagBlog.addTagBlog);
router.post('/editTagBlog', formData.parse(), TagBlog.editTagBlog);
router.post('/detailTagBlog', formData.parse(), TagBlog.detailTagBlog);
router.post('/deleteTagBlog', formData.parse(), TagBlog.deleteTagBlog);
router.post('/addExcelTagBlog', functions.uploadExcel, TagBlog.addExcelTagBlog);

module.exports = router;
