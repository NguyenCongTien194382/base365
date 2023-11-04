const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const jobApplication = require('../../controllers/timviec/jobApplication');

// lấy danh sách các mẫu đơn
router.post('/list', formData.parse(), jobApplication.list);

// tìm đơn danh sách theo ngành 
router.post('/list/cate', formData.parse(), jobApplication.listByCate);

// danh sách ngành đơn
router.post('/category/list', formData.parse(), jobApplication.category);

// xem trước đơn xin việc
router.post('/preview', formData.parse(), functions.checkTokenV2, jobApplication.preview);

// xem chi tiết đơn
router.post('/detail', functions.checkTokenV2, formData.parse(), jobApplication.detail);

// lưu và tải DON
router.post('/save', formData.parse(), functions.checkToken, jobApplication.save);

// thêm mới NganhDon
router.post('/createNganhDon', formData.parse(), functions.checkToken, jobApplication.createNganhDon);

// sửa NganhDon- findNganhDon & updateNganhDon
router.post('/findNganhDon', functions.checkToken, formData.parse(), jobApplication.findNganhDon);
router.post('/updateNganhDon', functions.checkToken, formData.parse(), jobApplication.updateNganhDon);

// xóa NganhDon
router.post('/deleteNganhDon', functions.checkToken, formData.parse(), jobApplication.deleteNganhDon);

// tạo mới mẫu Don
router.post('/createDon', functions.checkToken, functions.uploadImgKhoAnh.single('image'), jobApplication.createDon);

// sửa mẫu Don - findDon & updateDon
router.post('/findDon', functions.checkToken, formData.parse(), jobApplication.findDon);
router.post('/updateDon', functions.checkToken, functions.uploadImgKhoAnh.single('image'), jobApplication.updateDon);

// xóa mẫu Don
router.post('/deleteDon', functions.checkToken, formData.parse(), jobApplication.deleteDon);

router.post('/detailUserDon', formData.parse(), functions.checkToken, jobApplication.detailUserDon);


module.exports = router;