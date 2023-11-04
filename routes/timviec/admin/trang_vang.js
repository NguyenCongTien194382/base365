var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var trang_vang = require('../../../controllers/timviec/admin/trang_vang');

// Thêm mới tag
router.post('/addTag', formData.parse(), trang_vang.addTag);

// Danh sách tag
router.post('/getListTag', formData.parse(), trang_vang.getListTag);

//Lấy danh mục tag
router.post('/getListMenuTag', formData.parse(), trang_vang.getListMenuTag);

// Chỉnh sửa tag
router.post('/editTag', formData.parse(), trang_vang.editTag);

// Lấy chi tiết tag
router.post('/getDetailTag', formData.parse(), trang_vang.getDetailTag);

// Đánh index cho tag
router.post('/indexTag', formData.parse(), trang_vang.indexTag);

//Thêm mới liên kết nhanh
router.post('/addTrangVangCate', formData.parse(), trang_vang.addTrangVangCate);

//Chỉnh sửa liên kết nhanh
router.post('/editTrangVangCate', formData.parse(), trang_vang.editTrangVangCate);

//Lấy danh sách liên kết nhanh
router.post('/getListTrangVangCate', formData.parse(), trang_vang.getListTrangVangCate);

//Lấy chi tiết liên kết nhanh
router.post('/getDetailTrangVangCate', formData.parse(), trang_vang.getDetailTrangVangCate);

module.exports = router;