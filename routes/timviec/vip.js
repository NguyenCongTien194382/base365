const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions')
const vip = require('../../controllers/timviec/vip');

// Trang chủ
router.post('/checkIsUserOrdered', formData.parse(), vip.checkIsUserOrdered);

router.post('/getLastMonthTotalSpending', formData.parse(), vip.getLastMonthTotalSpending);

router.post('/sendOTPVerifyEmail', formData.parse(), vip.sendOTPVerifyEmail);

router.post('/updateVipNTD', formData.parse(), vip.updateVipNTD);

router.post('/updateGPKDNTD', formData.parse(), vip.updateGPKDNTD);

module.exports = router;