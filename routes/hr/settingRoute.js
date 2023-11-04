var express = require('express');
var router = express.Router();
var settingController = require('../../controllers/hr/settingController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');


//------------------------------api module cai dat

//-----------cai dat chung

//cap quyen cho nhan vien
router.post('/permision', formData.parse(), hrService.checkRoleUser, settingController.createPermisionUser);

//lay ra cac quyen cua user buy userId
router.post('/listPermision', formData.parse(), hrService.checkRoleUser, settingController.getListPermisionUser);

router.post('/getListPermisionUserLogin', formData.parse(), hrService.checkRoleUser, settingController.getListPermisionUserLogin);

//tao token han vien
router.post('/createTokenEmp', formData.parse(), settingController.createTokenUser);

module.exports = router;