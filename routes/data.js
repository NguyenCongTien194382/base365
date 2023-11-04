const express = require('express');
const formData = require('express-form-data');

const data = require('../controllers/data')
const router = express.Router();
const functions = require('../services/functions');

//api lấy dữ liệu của thành phố
router.post('/city', formData.parse(), data.getDataCity);
router.post('/district', formData.parse(), data.getDataDistrict);
router.post('/timviec/category', formData.parse(), data.getDataCategoryTv365);
router.post('/timviec/tag', formData.parse(), data.getDataTagTv365);
router.post('/timviec/cv/lang', formData.parse(), data.getDataLangCV);
router.post('/timviec/cv/design', formData.parse(), data.getDataDesignCV);
router.post('/timviec/modules', formData.parse(), data.modules);
router.post('/timviec/district/tag', formData.parse(), data.getDistrictTag);
router.post('/timviec/getUserOnline', formData.parse(), data.getUserOnline);
router.post('/timviec/getDataUserOnline', formData.parse(), data.getDataUserOnline);
router.post('/timviec/getDataUserOnline2', formData.parse(), data.getDataUserOnline2);
router.post('/timviec/getDataUserOnline3', formData.parse(), data.getDataUserOnline3);
router.post('/timviec/getTblTag', formData.parse(), data.getTblTag);
router.post('/timviec/getDataUserOnlineOne', formData.parse(), data.getDataUserOnlineOne);
router.post('/timviec/getDataUserOnlineOneCity', formData.parse(), data.getDataUserOnlineOneCity);
module.exports = router;