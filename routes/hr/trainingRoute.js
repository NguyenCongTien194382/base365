var express = require('express');
var router = express.Router();
var trainingController = require('../../controllers/hr/trainingController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');


//------------------------------api module vi tri cong viec
//api lay ra danh sach vi tri cong viec
router.post('/listJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1),  trainingController.getListJobDescription);

//them moi vi tri cong viec
router.post('/createJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2),  trainingController.createJobDescription);

//xoa vi tri cong viec => muc du lieu xoa gan day
router.post('/jobSoftDelete', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 4),  trainingController.softDeleteJobDescription);

//---------------------------api quy trinh dao tao
router.post('/listProcessTrain', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1),  trainingController.getListProcessTraining);
router.post('/detailProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1),  trainingController.getDetailProcessTraining);
router.post('/process', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2),  trainingController.createProcessTraining);
router.post('/softDeleteProcess', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 4),  trainingController.softDeleteProcessTraining);

//---------------------------api giai doan trong quy trinh
router.post('/stage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2),  trainingController.createStageProcessTraining);
router.post('/updateStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 3),  trainingController.updateStageProcessTraining);
router.post('/softDeleteStage', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 4),  trainingController.softDeleteStageProcessTraining);

module.exports = router;