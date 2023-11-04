var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const { uploadFileUv, uploadFileTmp } = require('../../../services/functions.js');
const controller = require('../../../controllers/timviec/app_chat/candidate');

// Cập nhật thông tin
router.post('/update_infor', functions.checkToken, uploadFileUv.fields([
    { name: "cvUpload" },
    { name: "videoUpload" }
]), controller.update_infor);
router.post('/update_hstt', functions.checkToken, formData.parse(), controller.update_hstt);

module.exports = router;