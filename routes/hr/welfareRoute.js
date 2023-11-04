var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var walfare  = require('../../controllers/hr/walfareController');
const HR =  require('../../services/hr/hrService');
const hrService = require('../../services/hr/hrService');
// thêm khen thưởng cá nhân
router.post('/addAchievement',hrService.checkRoleUser, hrService.checkRight(3, 2),formData.parse(),walfare.addAchievement)

// thêm khen thưởng tập thể
router.post('/addAchievementGroup',hrService.checkRoleUser, hrService.checkRight(3, 2),formData.parse(),walfare.addAchievementGroup)

// sửa khen thưởng
router.put('/updateAchievement',hrService.checkRoleUser, hrService.checkRight(3, 3),formData.parse(),walfare.updateAchievement)

// danh sách khen thưởng 
router.get('/listAchievement',hrService.checkRoleUser, hrService.checkRight(3, 1),walfare.listAchievement)

// Thêm mới kỉ luật cá nhân 
router.post('/addInfinges',hrService.checkRoleUser, hrService.checkRight(3, 2),formData.parse(),walfare.addInfinges)

// Thêm mới kỉ luật cá nhân 
router.post('/addInfingesGroup',hrService.checkRoleUser, hrService.checkRight(3, 2),formData.parse(),walfare.addInfingesGroup)

// sửa  kỉ luật
router.put('/updateInfinges',hrService.checkRoleUser, hrService.checkRight(3, 3),formData.parse(),walfare.updateInfinges)

// danh sách kỉ luật
router.get('/listInfinges',hrService.checkRoleUser, hrService.checkRight(3, 1),walfare.listInfinges)

router.get('/layDanhSachSua',hrService.checkRoleUser, hrService.checkRight(3, 1),walfare.layDanhSachSua)


module.exports = router;