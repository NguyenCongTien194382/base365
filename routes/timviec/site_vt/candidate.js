var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const controller = require('../../../controllers/timviec/site_vt/candidate');

// Lấy danh sách tài khoản để đăng nhập
router.post('/register', formData.parse(), controller.register);
router.post('/update', formData.parse(), controller.update);
router.post('/update_list', controller.update_list);

module.exports = router;