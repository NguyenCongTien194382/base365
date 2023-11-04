var express = require('express');
var router = express.Router();
var admin = require('../../controllers/timviec/admin/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const { uploadFileUv } = require('../../services/timviec365/admin.js');
const { uploadFileUvInsert } = require('../../services/timviec365/admin.js');
var employer = require('../../controllers/timviec/admin/company');
const candidate = require('../../controllers/timviec/admin/candidate');
var accountManagement = require('../../controllers/timviec/admin/accountManagement');

const { uploadFileXlsx } = require('../../services/timviec365/admin.js');

// api đăng nhập
router.post('/check/login', formData.parse(), admin.login);

// api lấy dữ liệu modules
router.post('/getModules', formData.parse(), admin.getModules);

// api check quyền truy cập 
router.post('/check/accessmodule', formData.parse(), admin.accessmodule);
// api lấy dữ liệu admin qua adm_bophan
router.post('/getInfoAdminUser', formData.parse(), admin.getInfoAdminUser);

router.post('/translate', admin.translate);

// api lấy dữ liệu admin
router.post('/infor', formData.parse(), admin.infor);

router.post('/inforBophan', formData.parse(), admin.inforBophan);


router.post('/bophan/list', formData.parse(), admin.bophan_list);

// Công ty
router.post('/company/listing', formData.parse(), admin.listingCompany);


// api đăng ký admin
// router.post('/postNewAdmin', formData.parse(), admin.postAdmin);

// // api cập nhập admin
// router.post('/updateAdmin', functions.checkToken, formData.parse(), admin.updateAdmin);

// // api lấy thông tin chi tiết admin
// router.post('/getAdminDetail', functions.checkToken, formData.parse(), admin.getAdminDetail);

// // api lấy danh sách admin
// router.post('/getListAdmin', functions.checkToken, formData.parse(), admin.getListAdmin);

// // api xóa admin  
// router.post('/deleteAdmin', functions.checkToken, formData.parse(), admin.deleteAdmin);

// // api cập nhập active    
// router.post('/updateActive', functions.checkToken, formData.parse(), admin.updateActive);

// // api cập nhập password    
// router.post('/updatePassword', functions.checkToken, formData.parse(), admin.updatePassword);

// // luồng ứng viên
// const candidate = require('../../controllers/timviec/admin/candidate');
// // Danh sách ứng viên đăng ký mới
// router.post('/uv/list/register', formData.parse(), candidate.candi_register);
// // Danh sách ứng viên sửa, cập nhật hồ sơ
// router.post('/uv/list/update', formData.parse(), candidate.candi_update);
// // Ứng viên tải cv từ máy tính cá nhân
// router.post('/uv/list/checkProfile', formData.parse(), candidate.checkProfile);
// // duyệt hồ sơ ứng viên
// router.post('/uv/profile/active', formData.parse(), candidate.activeProfile);
// // xóa ứng viên
// router.post('/uv/delete', formData.parse(), candidate.delete);
// // ứng viên có điểm hồ sơ < 45
// router.post('/uv/list/percents', formData.parse(), candidate.percents);
// // ứng viên ứng tuyển ntd
// router.post('/uv/list/apply', formData.parse(), candidate.listApply);

router.post('/topupCredits', formData.parse(), functions.checkToken, admin.topupCredits);

// admin sửa hồ sơ ứng viên
router.post('/uv/updateCandiDate', formData.parse(), admin.updateCandiDate);

//Thông tin chi tiết ứng viên
router.post('/uv/infoCandidate', formData.parse(), admin.infoCandidate);

router.post('/uv/insertCandiDate', formData.parse(), admin.insertCandiDate);

router.post('/uv/statusApplyForJob', formData.parse(), admin.statusApplyForJob);
router.post('/uv/countStatusApplyForJob', formData.parse(), admin.countStatusApplyForJob);

//admin làm mới hồ sơ ứng viên
router.post('/uv/RefreshProfile', formData.parse(), admin.RefreshProfile);

// Danh sách ứng viên chưa cập nhập hồ sơ
router.post('/uv/list/unsethoso', formData.parse(), candidate.candi_unseths);

//Nhà tuyển dụng
//API lấy danh sách NTD đăng kí mới
router.post('/getListNewRegistrationNTD', functions.checkToken, formData.parse(), employer.getListNewRegistrationNTD);

//API lấy danh sách NTD ẩn
router.post('/getListHideNTD', formData.parse(), employer.getListHideNTD_2);
router.post('/countGetListHideNTD', formData.parse(), employer.countGetListHideNTD_2);


//API lấy danh sách NTD đăng kí lỗi
router.post('/getListRegistrationFailedNTD', formData.parse(), employer.getListRegistrationFailedNTD);

// router.post('/getListAccountSale', formData.parse(), accountManagement.getListAccountSale);

router.post('/getListAccountPesonnel', formData.parse(), accountManagement.getListAccountPesonnel);

router.post('/lockAccount', formData.parse(), accountManagement.lockAccount);

router.post('/uv/listCvUv', formData.parse(), admin.listCvUv);
router.post('/uv/countListCvUv', formData.parse(), admin.countListCvUv);

router.post('/uv/listCvUvHide', formData.parse(), admin.listCvUvHide);
router.post('/uv/countListCvUvHide', formData.parse(), admin.countListCvUvHide);

router.post('/uv/addUvSiteVeTinh', uploadFileXlsx.any(), admin.addUvSiteVeTinh);

router.post('/uv/excelUvTimviec', formData.parse(), admin.excelUvTimviec);

//Lấy toàn bộ danh sách admin
router.post('/getAllListAdmin', formData.parse(), admin.getListAllAdmin);


module.exports = router;