const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const letter = require('../../controllers/timviec/letter');

//lấy danh sách các mẫu thư
router.post('/list', formData.parse(), letter.list);

// tìm thư danh sách theo ngành 
router.post('/list/category', formData.parse(), letter.listByCate);

//danh sách ngành thư
router.post('/category/list', formData.parse(), letter.listCategory);

// xem trước thư
router.post('/preview', formData.parse(), functions.checkTokenV2, letter.preview);

//xem chi tiết thư
router.post('/detail', functions.checkTokenV2, formData.parse(), letter.detail);

//lưu thư
router.post('/saveThu', functions.checkToken, formData.parse(), letter.saveThu);

// thêm mới NganhThu
router.post('/createNganhThu', formData.parse(), functions.checkToken, letter.createNganhThu);

// sửa NganhThu- findNganhThu & updateNganhThu
router.post('/findNganhThu', functions.checkToken, formData.parse(), letter.findNganhThu);
router.post('/updateNganhThu', functions.checkToken, formData.parse(), letter.updateNganhThu);

// xóa NganThu
router.post('/deleteNganhThu', functions.checkToken, formData.parse(), letter.deleteNganhThu);

// tạo mới mẫu Thu
router.post('/createThu', functions.checkToken, functions.uploadImgKhoAnh.single('image'), letter.createThu);

// sửa mẫu Thu - findThu & updateThu
router.post('/findThu', functions.checkToken, formData.parse(), letter.findThu);
router.post('/updateThu', functions.checkToken, functions.uploadImgKhoAnh.single('image'), letter.updateThu);

// xóa mẫu Thu
router.post('/deleteThu', functions.checkToken, formData.parse(), letter.deleteThu);

router.post('/detailUserThu', formData.parse(), functions.checkToken, letter.detailUserThu);

module.exports = router;