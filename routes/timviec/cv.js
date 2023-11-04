const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');
const multer = require('multer');
const { uploadFileDocTmpCV } = require('../../services/functions.js');

const cv = require('../../controllers/timviec/cv');

// tìm tất cả mẫu CV
router.post('/getList', formData.parse(), functions.checkTokenV2, cv.getList);

// danh sách ngành cv
router.post('/getNganhCV', formData.parse(), cv.getNganhCV);

// danh sách ngành cv
router.post('/list/cate', formData.parse(), cv.listCvByCate);

// xem trước cv
router.post('/preview', formData.parse(), cv.previewCV);

// chi tiết cv 
router.post('/detail', functions.checkTokenV2, formData.parse(), cv.detail);

// chi tiết cv 
router.post('/like', functions.checkToken, formData.parse(), cv.like);

// lưu và tải cv
router.post('/saveCV', functions.checkToken, formData.parse(), cv.saveCV);

// xem mẫu cv viết sẵn
router.post('/viewAvailableCV/:cateId', formData.parse(), cv.viewAvailable);

// tính điểm cv
router.post('/countPoints', formData.parse(), cv.countPoints);

// tạo mới mẫu cv
router.post('/createCV', formData.parse(), functions.checkToken, cv.createCV);

// sửa mẫu cv - findCV & updateCV
router.post('/findCV/:_id', functions.checkToken, cv.findCV);
router.post('/updateCV/:_id', formData.parse(), functions.checkToken, cv.updateCV);

// xóa mẫu cv
router.post('/deleteCV/:_id', functions.checkToken, cv.deleteCV);

// thêm ngành cv vào danh sách NganhCV
router.post('/createNganhCV', formData.parse(), functions.checkToken, cv.createNganhCV);

// sửa ngành cv vào danh sách NganhCV- findNganhCV & updateNganhCV
router.post('/findNganhCV/:_id', functions.checkToken, cv.findNganhCV);
router.post('/updateNganhCV/:_id', functions.checkToken, formData.parse(), cv.updateNganhCV);

// xóa ngành cv vào danh sách NganhCV
router.post('/deleteNganhCV/:_id', functions.checkToken, formData.parse(), cv.deleteNganhCV);
router.post('/uploadAvatarCV', formData.parse(), cv.uploadAvatarCV);

router.post('/module', formData.parse(), cv.module);

router.post('/cv365', cv.cv365);

router.post('/seo_dm_nn_cv', formData.parse(), cv.seo_dm_nn_cv);
router.post('/cv_mau', formData.parse(), cv.cv_mau);
router.post('/update_point_cv', formData.parse(), cv.update_point_cv);
router.post('/dataFromTimviec365', formData.parse(), cv.dataFromTimviec365);
router.post('/detailBlog', formData.parse(), cv.detailBlog);

// tạo cv bằng AI365
router.post('/createCvAi365', uploadFileDocTmpCV.single('docCV'), cv.createCvAi365);

// chi tiết cv 
router.post('/detailLastCV', functions.checkTokenV2, formData.parse(), cv.detailLastCV);

//Cập nhật xem trước CV cho app
router.post('/updateCVPreview', formData.parse(), cv.updateCVPreview);

//Lấy data xem trước CV cho app
router.post('/detailCVPreview', formData.parse(), cv.detailCVPreview);

//Lấy data Ảnh xem trước CV
router.post('/renderPreview', formData.parse(), cv.renderPreview);

// danh sách url blog cv365
router.post('/getUrlCv365', formData.parse(), cv.getUrlCv365);

//lưu cv bằng AI
router.post('/saveCvDrawAi', formData.parse(), cv.saveCvDrawAi);

router.post('/getListCvAi', formData.parse(), cv.getListCvAi);

router.post('/downloadCV', formData.parse(), cv.downloadCV);

router.post('/downloadCVNTD', formData.parse(), functions.checkTokenV2, cv.downloadCVNTD);

module.exports = router;