let express = require('express');
let router = express.Router();
let adminCv = require('../../../controllers/timviec/admin/cv');
let formData = require('express-form-data');
const functions = require('../../../services/functions');
const { uploadFileUv } = require('../../../services/timviec365/admin.js');

// api đăng nhập
router.post('/listCv', formData.parse(), adminCv.listCv);
router.post('/detailCv', formData.parse(), adminCv.detailCv);
router.post('/createCv', formData.parse(), adminCv.createCv);
router.post('/updateStatusCv', formData.parse(), adminCv.updateStatusCv);
router.post('/deleteCv', formData.parse(), adminCv.deleteCv);

router.post('/listDanhMucCv', formData.parse(), adminCv.listDanhMucCv);
router.post('/createDanhMucCv', functions.uploadAvatarCV, adminCv.createDanhMucCv);
router.post('/deleteDanhMucCv', formData.parse(), adminCv.deleteDanhMucCv);
router.post('/detailDanhMucCv', formData.parse(), adminCv.detailDanhMucCv);
router.post('/updateDanhMucCv', functions.uploadAvatarCV, adminCv.updateDanhMucCv);
router.post('/updateStatusDanhMucCv', formData.parse(), adminCv.updateStatusDanhMucCv);

router.post('/listDanhMucCvDesign', formData.parse(), adminCv.listDanhMucCvDesign);
router.post('/updateStatusDanhMucCvDesign', formData.parse(), adminCv.updateStatusDanhMucCvDesign);
router.post('/createDanhMucCvDesign', formData.parse(), adminCv.createDanhMucCvDesign);
router.post('/deleteDanhMucCvDesign', formData.parse(), adminCv.deleteDanhMucCvDesign);
router.post('/detailDanhMucCvDesign', formData.parse(), adminCv.detailDanhMucCvDesign);
router.post('/updateDanhMucCvDesign', formData.parse(), adminCv.updateDanhMucCvDesign);

router.post('/listDanhMucCvLang', formData.parse(), adminCv.listDanhMucCvLang);
router.post('/updateIndexDanhMucCvLang', formData.parse(), adminCv.updateIndexDanhMucCvLang);
router.post('/createDanhMucCvLang', formData.parse(), adminCv.createDanhMucCvLang);
router.post('/deleteDanhMucCvLang', formData.parse(), adminCv.deleteDanhMucCvLang);
router.post('/detailDanhMucCvLang', formData.parse(), adminCv.detailDanhMucCvLang);
router.post('/updateDanhMucCvLang', formData.parse(), adminCv.updateDanhMucCvLang);

router.post('/listDanhMucCvCate', formData.parse(), adminCv.listDanhMucCvCate);
router.post('/updateStatusDanhMucCvCate', formData.parse(), adminCv.updateStatusDanhMucCvCate);
router.post('/createDanhMucCvCate', formData.parse(), adminCv.createDanhMucCvCate);
router.post('/deleteDanhMucCvCate', formData.parse(), adminCv.deleteDanhMucCvCate);
router.post('/detailDanhMucCvCate', formData.parse(), adminCv.detailDanhMucCvCate);
router.post('/updateDanhMucCvCate', formData.parse(), adminCv.updateDanhMucCvCate);

router.post('/listPointCv', formData.parse(), adminCv.listPointCv);

router.post('/listLangCv', formData.parse(), adminCv.listLangCv);

module.exports = router;