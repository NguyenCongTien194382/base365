var express = require('express');
var router = express.Router();
var recruitmentController = require('../../controllers/hr/recruitmentController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//api lay ra danh sach recruitmentController theo cac truong
router.post('/getRecruitment', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListRecruitment);

//them moi quy trinh
router.post('/createRecruitment', hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.createRecruitment);

//sua quy trinh
router.post('/updateRecruitment', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.updateRecruitment);

//xoa quy trinh tuyen dung vao muc da xoa gan day
router.post('/softDelete', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteRecruitment);


//---giai doan trong quy trinh
router.post('/getStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getStageRecruitment);
//them giai doan trong quy trinh
router.post('/createStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.createStageRecruitment);
//sua giai doan trong quy trinh
router.post('/updateStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.updateStageRecruitment);
//xoa gia doan
router.post('/softDeleteStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteStageRecruitment);

//-------------------------------api tin tuyen dung

//lay ra ds tin va tim kiem tin
router.post('/listNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListRecruitmentNews);
router.post('/listNewActive', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listNewActive);
router.post('/listSchedule', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listSchedule);

//chi tiet tin tuyen dung
router.post('/detailNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getDetailRecruitmentNews);

//them moi tin tuyen dung
router.post('/createNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataRecruitmentNews, recruitmentController.createRecruitmentNews);

//sua
router.post('/updateNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataRecruitmentNews, recruitmentController.updateRecruitmentNews);

//xoa tam thoi
router.post('/softDeleteNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteRecuitmentNews);

//lay lam mau
router.post('/createSampleNews', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.createSampleNews);

//-------------------------------api ung vien

//lay ra danh sach va tim kiem
router.post('/listCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListCandidate);

//lay ra tong so ung vien theo ngay, tuan, thang
router.post('/totalCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getTotalCandidateFollowDayMonth);

//them moi
router.post('/createCandidate', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataCandidate,recruitmentController.createCandidate);

//sua
router.post('/updateCandidate', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataCandidate, recruitmentController.updateCandidate);

//xoa tam thoi
router.post('/softDeleteCandi', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.softDeleteCandidate);

//-----------------------------api giai doan tuyen dung
router.post('/getListProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListProcessInterview);

//them moi
router.post('/createProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 2), recruitmentController.checkDataProcess,recruitmentController.createProcessInterview);

//sua
router.post('/updateProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.checkDataProcess, recruitmentController.updateProcessInterview);

//xoa 
router.post('/deleteProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 4), recruitmentController.deleteProcessInterview);

//-----------------------------chuyen trang thai cua ung vien

//ky hop dong
router.post('/contactJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.createContactJob);

//huy cong viec
router.post('/cancelJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.createCancelJob);

//truot ung vien
router.post('/failJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.createFailJob);

//them lich phong van gui mail
router.post('/scheduleInter', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.addCandidateProcessInterview);

//nhan vien
router.post('/addCandidateGetJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 3), recruitmentController.addCandidateGetJob);

//chi tiet ung vien nhan vien
router.post('/detailCandidateGetJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.detailCandidateGetJob);

//chi tiet ung vien huy
router.post('/detailCandidateCancelJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.detailCandidateCancelJob);

//chi tiet ung vien truot
router.post('/detailCandidateFailJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.detailCandidateFailJob);

//chi tiet ung vien ky hop dong
router.post('/detailCandidateContactJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.detailCandidateContactJob);

router.post('/getListCategory', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.getListCategory);

router.post('/detailCandidateV2', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.detailCandidateV2);

router.post('/listProcessInterview', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listProcessInterview);

router.post('/listProcessInterviewFailJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listProcessInterviewFailJob);

router.post('/listProcessInterviewCancelJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listProcessInterviewCancelJob);

router.post('/listProcessInterviewContactJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listProcessInterviewContactJob);

router.post('/listProcessInterviewGetJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.listProcessInterviewGetJob);

router.post('/wflistCandidate', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidate);

router.post('/wflistCandidateGetJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidateGetJob);

router.post('/wflistCandidateFailJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidateFailJob);

router.post('/wflistCandidateCancelJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidateCancelJob);

router.post('/wflistCandidateContactJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidateContactJob);

router.post('/wflistCandidateSchedule', formData.parse(), hrService.checkRoleUser, hrService.checkRight(1, 1), recruitmentController.wflistCandidateSchedule);


module.exports = router;