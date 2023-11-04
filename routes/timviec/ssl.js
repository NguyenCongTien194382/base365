const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const ssl = require('../../controllers/timviec/ssl');

router.post('/home', ssl.home);
router.post('/getkeyword', formData.parse(), ssl.getkeyword);

//so sánh lương
router.post('', formData.parse(), ssl.findSalary)

// Tìm kiếm 
router.search('/search', formData.parse(), ssl.search);

// Tìm kiếm 
router.search('/cate', formData.parse(), ssl.cate);
router.post('/show_ssl', formData.parse(), ssl.show_ssl);

router.post('/GetAllLuongBangCapNganhNghe', formData.parse(), ssl.GetAllLuongBangCapNganhNghe);
module.exports = router;