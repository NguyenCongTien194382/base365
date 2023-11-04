const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions');
const mail365 = require('../../controllers/timviec/mail365');

// api trang chủ
router.post('/home', formData.parse(), mail365.home);

// api lấy nội dung seo
router.post('/seo', formData.parse(), mail365.seo);
router.post('/seo_category', formData.parse(), mail365.seo_category);

// ds danh mục
router.post('/list', formData.parse(), mail365.getCategories);

// ds email theo danh mục

router.post('/findByCategory', formData.parse(), mail365.findByCategory);

// xem trước email

router.post('/preview', formData.parse(), mail365.preview);

// chi tiết email
router.post('/detail', functions.checkToken, formData.parse(), mail365.detail);

// Lưu email
router.post('/save', functions.checkToken, formData.parse(), mail365.save);

// Lưu thành viên
router.post('/save/member', functions.checkToken, formData.parse(), mail365.save_member);

// Lấy danh sách thành viên đã lưu
router.post('/list/save_member', functions.checkToken, formData.parse(), mail365.list_save_member);

// Lấy chi tiết mail ntd đã lưu
router.post('/list/detailUserMail', functions.checkToken, formData.parse(), mail365.detailUserMail);

router.post('/list/updateDownLoad', functions.checkToken, formData.parse(), mail365.updateDownLoad);
module.exports = router;