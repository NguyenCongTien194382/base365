const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');
const controllers = require('../../controllers/timviec/notification');

// Trang chủ
router.post('/deleteNoti', functions.checkToken, formData.parse(), controllers.deleteNoti);

module.exports = router;