var express = require('express');
var router = express.Router();
var forceDeleteController = require('../../controllers/hr/forceDeleteController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module du lieu xoa gan day

//lay ra danh sach
router.post('/listDetailDelete', formData.parse(), hrService.checkRoleUser, forceDeleteController.listDetailDelete);

//api xoa
router.post('/delete', formData.parse(), hrService.checkRoleUser, hrService.checkRight(7, 3),  forceDeleteController.delete);

//khoi phuc
router.post('/restoreDelete', formData.parse(), hrService.checkRoleUser, hrService.checkRight(7, 3),  forceDeleteController.restoreDelete);

module.exports = router;