const router = require('express').Router();
const TeamController = require('../../controllers/qlc/Team')
const formData = require('express-form-data')
const functions = require("../../services/functions")

//Lấy toàn bộ dữ liệu tổ
router.post("/list", formData.parse(), TeamController.list);
//Tạo mới dữ liệu của một tổ
router.post("/create", formData.parse(), functions.checkToken, TeamController.createTeam);
//Chỉnh sửa dự liệu của một tổ
router.post("/edit", formData.parse(), functions.checkToken, TeamController.editTeam);
//Xóa dữ liệu của một tổ
router.delete("/del", formData.parse(), functions.checkToken, TeamController.deleteTeam);


module.exports = router