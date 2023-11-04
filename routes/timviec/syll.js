const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const syll = require('../../controllers/timviec/syll');

//lấy danh sách các mẫu syll
router.post('/list', formData.parse(), syll.list);

// xem trước syll
router.post('/preview', formData.parse(), functions.checkTokenV2, syll.preview);

//xem chi tiết syll
router.post('/detail', formData.parse(), functions.checkTokenV2, syll.detail);

//lưu syll
router.post(
    '/save',
    functions.checkToken,
    formData.parse(),
    syll.save
);

// tạo mới mẫu SYLL
router.post(
    '/createSYLL',
    functions.checkToken,
    functions.uploadImgKhoAnh.single('image'),
    syll.createSYLL
);

// sửa mẫu SYLL - findSYLL & updateSYLL
router.post('/findSYLL', functions.checkToken, formData.parse(), syll.findSYLL);
router.post(
    '/updateSYLL',
    functions.checkToken,
    functions.uploadImgKhoAnh.single('image'),
    syll.updateSYLL
);

// xóa mẫu SYLL
router.post(
    '/deleteSYLL',
    functions.checkToken,
    formData.parse(),
    syll.deleteSYLL
);

router.post(
    '/detailUserHoso',
    formData.parse(),
    functions.checkToken,
    syll.detailUserHoso
);

module.exports = router;