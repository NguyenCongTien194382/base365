const express = require('express');
const router = express.Router();
const functions = require("../../services/functions")

const ShiftController = require('../../controllers/qlc/Shift')
const tool = require('../../controllers/tools/quanlichung')
const formData = require('express-form-data');

//API tạo một ca làm việc mới
router.post("/create", functions.checkToken, formData.parse(), ShiftController.createShift);

//API lấy toàn bộ danh sách ca làm việc
router.get("/list", functions.checkToken, formData.parse(), ShiftController.getListShifts);

//API lấy ca làm việc theo id
router.post("/detail", functions.checkToken, formData.parse(), ShiftController.getShiftById);

// API lấy thông tin ca làm việc lúc chấm công
router.post('/list_shift_user', functions.checkToken, formData.parse(), ShiftController.list_shift_user);

//API lấy danh sách ca làm việc theo Id công ty
// router.get("/all/company", formData.parse(), ShiftController.getShiftByComId)

router.get('/toolShifts', tool.toolShifts);

//API chỉnh sửa thông tin của một ca làm việc
router.post("/edit", functions.checkToken, formData.parse(), ShiftController.editShift)

router.post('/delete', functions.checkToken, formData.parse(), ShiftController.deleteShiftCompany)

//API xóa toàn bộ ca làm việc của một công ty
// router.delete("/all/company", formData.parse(), ShiftController.deleteShiftCompany)

//API xóa toàn bộ ca làm việc đã có trong hệ thống
// router.delete("/", formData.parse(), ShiftController.deleteAllShifts)

module.exports = router