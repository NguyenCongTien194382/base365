const express = require('express');
const router = express.Router();
const priceList = require('../../controllers/timviec/priceList');
const formData = require('express-form-data');

// danh mục bảng giá
router.post('/getPriceList', priceList.getPriceList);

// chi tiết gói dich vụ
router.post('/viewDetail', formData.parse(), priceList.viewDetail);

// thêm bảng giá
router.post('/addPrice', formData.parse(), priceList.addPrice);

// chỉnh sửa bảng giá
router.post('/editPrice', formData.parse(), priceList.editPrice);

// xem chi tiết bảng giá
router.post('/detailPrice', formData.parse(), priceList.detailPrice);

module.exports = router;