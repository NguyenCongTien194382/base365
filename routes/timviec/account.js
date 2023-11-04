var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../services/functions');
const controller = require('../../controllers/timviec/account');

// Lấy danh sách tài khoản để đăng nhập
router.post('/getAccPermission', formData.parse(), controller.getAccPermission);

// Xóa video
router.post('/deleteVideo', functions.checkToken, formData.parse(), controller.deleteVideo);

// Lấy danh sách tài khoản để đăng nhập
router.post('/checkAccount', formData.parse(), controller.checkAccount);

// Lấy danh sách tài khoản ứng viên để đăng nhập
router.post('/getAccPermissionCandi', formData.parse(), controller.getAccPermissionCandi);
module.exports = router;