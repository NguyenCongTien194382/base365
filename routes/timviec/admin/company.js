// luồng ứng viên
var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const company = require('../../../controllers/timviec/admin/company');

const { uploadFileLogoNTD } = require('../../../services/timviec365/admin.js');
// Danh sách ứng viên đăng ký mới
router.post('/list/register', formData.parse(), company.listRegister);
// Danh sách ứng viên sửa, cập nhật hồ sơ
// router.post('/list/update', formData.parse(), candidate.candi_update);
// // Ứng viên tải cv từ máy tính cá nhân
// router.post('/list/checkProfile', formData.parse(), candidate.checkProfile);
// // duyệt hồ sơ ứng viên
// router.post('/profile/active', formData.parse(), candidate.activeProfile);
// // xóa ứng viên
// router.post('/delete', formData.parse(), candidate.delete);
// // ứng viên có điểm hồ sơ < 45
// router.post('/list/percents', formData.parse(), candidate.percents);
// // ứng viên ứng tuyển ntd
// router.post('/list/apply', formData.parse(), candidate.listApply);
// // ứng viên chưa kích hoạt
// router.post('/list/authentic', formData.parse(), candidate.listAuthentic);
// // ứng viên cv
// router.post('/list/cv', formData.parse(), candidate.listCandiSaveCv);
// // ứng viên đã xóa
// router.post('/list/deleted', formData.parse(), candidate.listDeleted);

//Chỉnh sửa NTD
router.post('/updateNTD', formData.parse(), company.updateNTD);
router.post('/createNTD', formData.parse(), company.createNTD);

//API lấy danh sách NTD đăng kí mới
router.post('/getListNewRegistrationNTD', functions.checkToken, formData.parse(), company.getListNewRegistrationNTD);
// note NTD 
router.post('/noteNTD', formData.parse(), company.noteNTD);
router.post('/countGetListNewRegistrationNTD', functions.checkToken, formData.parse(), company.countGetListNewRegistrationNTD);

//API lấy danh sách NTD đăng nhập
router.post('/getListLoginNTD', functions.checkToken, formData.parse(), company.getListLoginNTD);

//API lấy danh sách NTD ẩn
router.post('/getListHideNTD', formData.parse(), company.getListHideNTD_2);
router.post('/countGetListHideNTD', formData.parse(), company.countGetListHideNTD_2);

//API lấy danh sách NTD đăng kí lỗi
router.post('/getListRegistrationFailedNTD', formData.parse(), company.getListRegistrationFailedNTD);

//API lấy thông tin NTD đăng ký lỗi
router.post('/getDetailFailedNTD', formData.parse(), company.getDetailFailedNTD);

//API delete NTD đăng kí lỗi
router.post('/deleteFailedNTD', formData.parse(), company.deleteFailedNTD);

// Kích hoạt NTD
router.post('/activeNTD', formData.parse(), company.activeNTD);

router.post('/deleteCompany', formData.parse(), company.deleteCompany);

router.post('/listCompanyTest', formData.parse(), company.listCompanyTest);

//API lấy ra kinh doanh
router.post('/getDataKD', formData.parse(), company.getDataKD);

// api đăng nhập bằng admin
router.post('/loginAdmin', formData.parse(), functions.checkToken, company.loginAdmin)

router.post('/listExcellGoogle', formData.parse(), company.listExcellGoogle);

module.exports = router;