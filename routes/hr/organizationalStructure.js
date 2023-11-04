var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var organizationalStructure = require('../../controllers/hr/organizationalStructure');
const { uploadSignature } = require('../../services/hr/hrService');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//thông tin công ty, phòng ban
router.post('/detailInfoCompany', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.detailInfoCompany)

//hiển thị mô tả chi tiết phòng ban, tổ nhóm
router.post('/description', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.description)

//cập nhật mô tả chi tiết phòng ban, tổ nhóm
router.post('/updateDescription', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2), organizationalStructure.updateDescription)

//danh sách chức vụ
router.post('/listPosition', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.listPosition)

//hiển thị nhiệm vụ mỗi chức vụ
router.post('/missionDetail', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.missionDetail)

//cập nhật nhiệm vụ mỗi chức vụ
router.post('/updateMission', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 3), organizationalStructure.updateMission)

//an chuc vu
router.post('/updatePosition', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 3), organizationalStructure.updatePosition)

//tải lên chữ ký 
router.post('/uploadSignature', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2), organizationalStructure.uploadSignature)

//xóa chữ ký
router.post('/deleteSignature', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 4), organizationalStructure.deleteSignature)

//danh sách lãnh đạo
router.post('/listInfoLeader', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.listInfoLeader)

//chi tiết lãnh đạo
router.post('/leaderDetail', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.leaderDetail)

//cập nhật chi tiết lãnh đạo
router.post('/updateLeaderDetail', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 3), organizationalStructure.updateLeaderDetail)

//cap nhat avatar
router.post('/updateLeaderAvatar', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 3), organizationalStructure.updateAvatarLeader)

//cập nhật nhân viên sử dụng con dấu
router.post('/updateEmpUseSignature', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 2), organizationalStructure.updateEmpUseSignature)

//danh sách, tìm kiếm nhân viên sử dụng con dấu
router.post('/listEmpUseSignature', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.listEmpUseSignature)

//xóa nhân viên được sử dụng con dấu
router.post('/deleteEmpUseSignature', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 4), organizationalStructure.deleteEmpUseSignature)

//danh sách chữ ký lãnh đạo
router.post('/listSignatureLeader', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.listSignatureLeader)

// danh sách nhân viên chưa chấm công hoặc đã chấm công
router.post('/listEmUntimed', formData.parse(), hrService.checkRoleUser, hrService.checkRight(4, 1), organizationalStructure.listEmUntimed)

module.exports = router;