// luồng ứng viên
var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
//const functions = require('../../services/functions');
const controller = require('../../../controllers/timviec/admin/account');
// Danh sách ứng viên đăng ký mới
router.post('/list', formData.parse(), controller.list);

// Active tài khoản
router.post('/active', formData.parse(), controller.active);

// Thêm mới admin
router.post('/add', controller.add);

// Chi tiết admin
router.post('/detail', formData.parse(), controller.detail);

// Chỉnh sửa admin
router.post('/edit', controller.edit);

// đổi mật khẩu
module.exports = router;