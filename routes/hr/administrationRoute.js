var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const hrService =  require('../../services/hr/hrService');
const administration = require('../../controllers/hr/administrationController')
const functions = require('../../services/functions')
// thêm nhóm quy định
router.post('/addProvision',hrService.checkRoleUser, hrService.checkRight(2, 2),formData.parse(),administration.addProvision)

// thêm quy đinh
router.post('/addPolicy',formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 2), administration.addPolicy)

//chinh sua quy dinh
router.post('/updatePolicy', formData.parse(), hrService.checkRoleUser, hrService.checkRight(2, 3), administration.updatePolicy)

// danh sách nhóm quy định 
router.get('/listProvision',hrService.checkRoleUser,administration.listProvision)

// chi tiết nhóm quy định 
router.get('/detailProvision',hrService.checkRoleUser,administration.detailProvision)

// sửa nhóm quy định
router.put('/updateProvision',hrService.checkRoleUser, hrService.checkRight(2, 3),formData.parse(),administration.updateProvision)

// xoá nhóm quy định
router.delete('/deleteProvision',hrService.checkRoleUser, hrService.checkRight(2, 4),formData.parse(),administration.deleteProvision)

// danh sách quy định theo nhóm quy định
router.get('/listPolicy',hrService.checkRoleUser,administration.listPolicy)

// chi tiết quy định theo nhóm quy định
router.get('/detailPolicy',hrService.checkRoleUser,administration.detailPolicy)

// xoá quy định theo nhóm quy định
router.delete('/deletePolicy',hrService.checkRoleUser, hrService.checkRight(2, 4),formData.parse(),administration.deletePolicy)


// Thêm mới nhóm chính sách
router.post('/addEmployeePolicy',hrService.checkRoleUser, hrService.checkRight(2, 2),formData.parse(),administration.addEmployeePolicy)

// Sửa nhóm chính sách
router.put('/updateEmployeePolicy',hrService.checkRoleUser, hrService.checkRight(2, 3),formData.parse(),administration.updateEmployeePolicy)

// xoá nhóm chính sachs nhân viên
router.delete('/deleteEmployeePolicy',hrService.checkRoleUser, hrService.checkRight(2, 4),formData.parse(),administration.deleteEmployeePolicy)

// Thêm mới chính sách
router.post('/addEmpoyePolicySpecific',hrService.checkRoleUser, hrService.checkRight(2, 2),formData.parse(),administration.addEmpoyePolicySpecific)

// Danh sách nhóm chính sách
router.get('/listEmpoyePolicy',hrService.checkRoleUser,administration.listEmpoyePolicy)

// chi tiết nhóm chính sách
router.get('/getDetailPolicy',hrService.checkRoleUser,administration.getDetailPolicy)

// danh sách quy định theo nhóm quy định
router.get('/listEmployeePolicySpecific',hrService.checkRoleUser,administration.listEmployeePolicySpecific)


// chi tiết chính sách
router.get('/detailEmployeePolicySpecific',hrService.checkRoleUser,administration.detailEmployeePolicySpecific)

// xoá nhóm chính sách
router.delete('/deleteEmployeePolicySpecific',hrService.checkRoleUser, hrService.checkRight(2, 4),formData.parse(),administration.deleteEmployeePolicySpecific)

// sửa chính sách
router.put('/updateEmployeePolicySpecific',hrService.checkRoleUser, hrService.checkRight(2, 4),formData.parse(),administration.updateEmployeePolicySpecific)


module.exports = router;