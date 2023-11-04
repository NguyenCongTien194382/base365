const router = require('express').Router();
const DeparmentController = require('../../controllers/qlc/Deparment')
const functions = require("../../services/functions")
const formData = require('express-form-data')

//API lấy tất cả dữ liệu phòng ban 
router.post("/list", formData.parse(), functions.checkTokenV2, DeparmentController.list);

//API tạo mới một phòng ban
router.post("/create", formData.parse(), functions.checkToken, DeparmentController.createDeparment);

//API thay dổi thông tin của một phòng ban
router.post("/edit", formData.parse(), functions.checkToken, DeparmentController.editDeparment);

//API xóa một phòng ban theo id
router.delete("/del", formData.parse(), functions.checkToken, DeparmentController.deleteDeparment);


module.exports = router