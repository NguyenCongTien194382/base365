// luồng ứng viên
var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../../services/functions');
const candidate = require('../../../controllers/timviec/admin/candidate');
const { uploadFileTmp } = require('../../../services/functions.js');
// Danh sách ứng viên đăng ký mới
router.post('/list/register', formData.parse(), candidate.candi_register);
router.post('/list/countRegister', formData.parse(), candidate.count_candi_register);
// Danh sách ứng viên sửa, cập nhật hồ sơ
router.post('/list/update', formData.parse(), candidate.candi_update);
router.post('/list/countUpdate', formData.parse(), candidate.count_candi_update_2);
// Ứng viên tải cv từ máy tính cá nhân
router.post('/list/checkProfile', formData.parse(), candidate.checkProfile);
router.post('/list/countCheckProfile', formData.parse(), candidate.countCheckProfile);
// duyệt hồ sơ ứng viên
router.post('/profile/active', formData.parse(), candidate.activeProfile);
// xóa ứng viên
router.post('/delete', formData.parse(), candidate.delete);
// ứng viên có điểm hồ sơ < 45
router.post('/list/percents', formData.parse(), candidate.percents);
router.post('/list/countPercents', formData.parse(), candidate.countPercents_2);
// ứng viên ứng tuyển ntd
router.post('/list/apply', formData.parse(), candidate.listApply);
router.post('/list/countApply', formData.parse(), candidate.countListApply);
// ứng viên chưa kích hoạt
router.post('/list/countAuthentic', formData.parse(), candidate.countListAuthentic_2);
router.post('/list/authentic', formData.parse(), candidate.listAuthentic_2);
// ứng viên cv
router.post('/list/cv', formData.parse(), candidate.listCandiSaveCv);
// ứng viên đã xóa
router.post('/list/deleted', formData.parse(), candidate.listDeleted);
// Thêm ứng viên add lỗi 
router.post('/InsertUserAddFail2', formData.parse(), candidate.InsertUserAddFail2);
// InsertUserAddFail
router.post('/InsertUserAddFail', formData.parse(), candidate.InsertUserAddFail);
// ứng viên add lỗi 
router.post('/takeListUserAddFail', formData.parse(), candidate.takeListUserAddFail);
// ứng viên ứng tuyển sai
router.post('/candi_apply_wrong', formData.parse(), candidate.candi_apply_wrong);
router.post('/count_candi_apply_wrong', formData.parse(), candidate.count_candi_apply_wrong);
// ứng viên bị kinh doanh ẩn 
router.post('/candi_hide_kd', formData.parse(), candidate.candi_hide_kd);
router.post('/count_candi_hide_kd', formData.parse(), candidate.count_candi_hide_kd);
// ứng viên bị ẩn 
router.post('/candi_hide', formData.parse(), candidate.candi_hide);
router.post('/count_candi_hide', formData.parse(), candidate.count_candi_hide);
// ứng viên đăng nhập trong ngày 
router.post('/candi_login', formData.parse(), candidate.candi_login_2);
// Lam mới
router.post('/refreshCandi', formData.parse(), candidate.refreshCandi);
// Lam mới
router.post('/candiAll', formData.parse(), candidate.candiAll);
router.post('/countCandiAll', formData.parse(), candidate.countCandiAll_2);

// Lấy thông tin ứng viên chưa hoàn thiện hồ sơ (unser_unset)
router.post('/user_unset/infor', formData.parse(), candidate.inforUserUnset);

// Xóa thông tin ứng viên khi nhập liệu cập nhật xong
router.post('/user_unset/delete', formData.parse(), candidate.deleteUserUnset);

// active ứng viên 
router.post('/activeUV', formData.parse(), candidate.activeUV);

router.post('/deleteCandidate', formData.parse(), candidate.deleteCandidate);

router.post(
    '/getCandidateSpamIp',
    formData.parse(),
    candidate.getCandidateSpamIP
);
router.post(
    '/listCandidateTest',
    formData.parse(),
    candidate.listCandidateTest
);
router.post(
    '/candiNotCompleteAppCv',
    formData.parse(),
    candidate.candiNotCompleteAppCv_2
);

router.post('/addExcel', uploadFileTmp.single('excell'), candidate.addExcel);

// active UV UTS
router.post('/activeUVUTS', formData.parse(), candidate.activeUVUTS);

// delete UV UTS
router.post('/deleteUVUTS', formData.parse(), candidate.deleteUVUTS);

// active bị loại ứng viên
router.post('/removeUVCHTHS', formData.parse(), candidate.removeUVCHTHS);

//Gửi ứng viên NTD
router.post('/sendUv_NTD', formData.parse(), candidate.sendUv_NTD);

// api đăng nhập bằng admin
router.post('/loginAdminUV', formData.parse(), functions.checkToken, candidate.loginAdminUV);

router.post('/deleteCrm', formData.parse(), candidate.deleteCrm);

router.post('/listExcellGoogle', formData.parse(), candidate.listExcellGoogle);

router.post('/changePassUvAdm', formData.parse(), candidate.changePassUvAdm);

router.post('/listUVUTNews', formData.parse(), candidate.listUVUTNews);

// Xóa nộp hồ sơ
router.post('/deleteNhs', formData.parse(), candidate.deleteNhs);

router.post('/listCVSaved', formData.parse(), candidate.listCVSaved);

router.post('/scanErrCv', formData.parse(), candidate.scanErrCv);

module.exports = router;