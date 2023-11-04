var express = require('express');
var router = express.Router();
var managerEmployeeController = require('../../controllers/hr/managerEmployeeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module quan ly nhan vien

//api lay ra danh sach nhan vien va tim kiem
router.post('/listEmployee', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 1), managerEmployeeController.getListEmployee);
router.post('/createEmployee', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 2), managerEmployeeController.createEmployee);
router.post('/updateEmployee', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3), managerEmployeeController.updateEmployee);

module.exports = router;