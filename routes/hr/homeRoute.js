var express = require('express');
var router = express.Router();
var homeController = require('../../controllers/hr/homeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');


//------------------------------api home
router.post('/getListInfo', formData.parse(), hrService.checkRoleUser, homeController.getListInfo);

// api winform - danh sách khen thưởng 
router.post('/totalAchievement', formData.parse(), hrService.checkRoleUser, homeController.totalAchievement);

// api winform - danh sách kỉ luật
router.post('/totalInfringe', formData.parse(), hrService.checkRoleUser, homeController.totalInfringe);

// api winform - danh sách ứng viên
router.post('/totalCandidate', formData.parse(), hrService.checkRoleUser, homeController.totalCandidate);

// api winform - danh sách ứng viên đến phỏng vấn
router.post('/totalInterview', formData.parse(), hrService.checkRoleUser, homeController.totalInterview);

// api winform - danh sách ứng viên hẹn đi làm
router.post('/totalOfferJob', formData.parse(), hrService.checkRoleUser, homeController.totalOfferJob);

module.exports = router;