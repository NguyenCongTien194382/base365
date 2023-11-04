const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const trangVang = require('../../controllers/timviec/trangVang');

// Trang chủ
router.post('/', trangVang.home);

// danh mục lĩnh vực ngành nghề
router.post('/getLV', formData.parse(), trangVang.getLV);

// lấy danh mục mà được gộp trùng tên
router.post('/getLvDistinct', trangVang.getLvDistinct);
// tìm kiếm công ty theo điều kiện
router.post('/findCompany', formData.parse(), trangVang.findCompany);

router.post('/yp_list_company', formData.parse(), trangVang.yp_list_company);
router.post('/yp_list_cate', formData.parse(), trangVang.yp_list_cate);

module.exports = router;