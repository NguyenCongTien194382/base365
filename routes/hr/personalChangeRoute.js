var express = require('express');
var router = express.Router();
var personalChangeController = require('../../controllers/hr/personalChangeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module quan ly nhan vien

//----------bo nhiem/quy hoach
router.post('/getListAppoint', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1), personalChangeController.getListAppoint);
router.post('/updateAppoint', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3), personalChangeController.getAndCheckData, personalChangeController.updateAppoint);
router.post('/deleteAppoint', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 4), personalChangeController.deleteAppoint);

//----------luan chuyen cong tac
router.post('/getListTranferJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1),  personalChangeController.getListTranferJob);
router.post('/updateTranferJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3),  personalChangeController.getAndCheckData, personalChangeController.updateTranferJob);
router.post('/deleteTranferJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 4),  personalChangeController.deleteTranferJob);

//----------giam bien che
router.post('/getListQuitJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1),  personalChangeController.getListQuitJob);
router.post('/updateQuitJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3),  personalChangeController.getAndCheckData, personalChangeController.updateQuitJob);
router.post('/deleteQuitJob', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 4),  personalChangeController.deleteQuitJob);

//----------nghi sai quy dinh
router.post('/getListQuitJobNew', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1),  personalChangeController.getListIllegalQuitJob);
router.post('/updateQuitJobNew', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3),  personalChangeController.getAndCheckData, personalChangeController.updateIllegalQuitJob);
router.post('/deleteQuitJobNew', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 4),  personalChangeController.deleteQuitJobNew);

//khac
router.post('/getListEmployee', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1),  personalChangeController.getListEmployee);
router.post('/getListSalary', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1),  personalChangeController.getListSalary);

module.exports = router;