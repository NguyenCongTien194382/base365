const express = require('express');
const formData = require('express-form-data');
const router = express.Router();

const cvuv = require('../../controllers/timviec/cvnew/ungvien.js');

const cv = require('../../controllers/timviec/cvnew/cv.js');

// tạo cv bằng AI365
// router.post('/InsertDataCvUngVien', functions.checkToken, cv.createCvAi365);
router.post('/InsertDataCvUngVien', formData.parse(), cvuv.InsertDataCvUngVien);
router.post('/InsertDataSampleCv', formData.parse(), cvuv.InsertDataSampleCv);


// cv 
router.post('/TakeDataCvUngVien', formData.parse(), cv.TakeDataCvUngVien);
router.post('/TakeDataSampleCv', formData.parse(), cv.TakeDataSampleCv);

module.exports = router;