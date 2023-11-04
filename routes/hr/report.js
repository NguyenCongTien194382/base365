var express = require('express');
var router = express.Router();
var report = require('../../controllers/hr/report');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

// báo cáo nhân sự
router.post('/report', formData.parse(), hrService.checkRoleUser, hrService.checkRight(5, 1), report.report);

// chi tiết báo cáo nhân sự
router.post('/reportDetail', formData.parse(),  hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportDetail);

// biểu đồ báo cáo nhân sự
router.post('/reportChart', formData.parse(), hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportChart);

// báo cáo tuyển dụng
router.post('/reportRecruitment', formData.parse(),  hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportRecruitment);

// Báo cáo thống kê theo nhân viên tuyển dụng
router.post('/reportHr', formData.parse(),  hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportHr);

// Báo cáo thống kê theo nhân viên tuyển dụng
router.post('/reportDetailRecruitment', formData.parse(),  hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportDetailRecruitment);

// Báo cáo chi tiết theo nhân viên giới thiệu ứng viên và tiền thưởng trực tiếp
router.post('/reportDetailHRAndAchievements', formData.parse(),  hrService.checkRoleUser, hrService.checkRight(5, 1), report.reportDetailHRAndAchievements);
module.exports = router;