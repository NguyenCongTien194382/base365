// luồng tin tuyển dụng
var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const newTV365 = require('../../../controllers/timviec/admin/newTV365');

const functions = require('../../../services/functions');
// Cập nhật chi tiết tin
router.post('/updateNewTv365', formData.parse(), newTV365.updateNewTv365);

// Ghim tin
router.post('/updateNewTv365Hot', formData.parse(), newTV365.updateNewTv365Hot);

// Xóa tin
// router.post('/deleteNewTV365', formData.parse(), newTV365.deleteNewTV365);

// Làm mới tin
router.post('/refreshNew', formData.parse(), newTV365.refreshNew);

// Danh sách tin
router.post('/listNewTV365', formData.parse(), newTV365.listNewTV365);

// Đăng tin
router.post('/postNewTv365', formData.parse(), newTV365.postNewTv365);

// Danh sách tin duyệt index
router.post('/listNewTV365Index', formData.parse(), newTV365.listNewTV365Index);

// Danh sách tin duyệt jobposting
router.post('/listNewTV365Jobposting', formData.parse(), newTV365.listNewTV365Jobposting);

// Cập nhật 1 trường
router.post('/changeNewField', formData.parse(), newTV365.changeNewField);

// Danh sách tin duyệt jobposting
router.post('/listNewTV365New', formData.parse(), newTV365.listNewTV365New);

//active tin
router.post('/activeNew', formData.parse(), newTV365.activeNew);

//danh sách tin spam
router.post('/listNewSpam', formData.parse(), newTV365.listNewSpam);

//danh sách ảnh spam
router.post('/listImageSpam', formData.parse(), newTV365.listImageSpam);

//danh sách tin test
router.post('/listNewTest', formData.parse(), newTV365.listAllNewTest);

router.post('/activeImageSpam', formData.parse(), newTV365.activeImageSpam);

router.delete(
    '/deleteNewTv365/:idNew',
    // functions.checkToken,
    newTV365.deleteNew
);

router.post('/historyGhim', formData.parse(), newTV365.historyGhim);

module.exports = router;