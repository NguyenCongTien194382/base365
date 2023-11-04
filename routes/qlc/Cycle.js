const router = require('express').Router();
const functions = require("../../services/functions")
const CalendarController = require("../../controllers/qlc/Cycle")
var formData = require('express-form-data')

//:ấy danh sách lịch làm việc của một công ty
router.post("/list", formData.parse(), functions.checkToken, CalendarController.getAllCalendarCompany)

//Tạo một lịch làm việc mới
router.post("/create", formData.parse(), functions.checkToken, CalendarController.create)

// Chi tiết lịch làm việc
router.post('/detail', formData.parse(), functions.checkToken, CalendarController.detail);

//Chỉnh sửa một lịch làm việc đã có sẵn
router.post("/edit", formData.parse(), functions.checkToken, CalendarController.edit)

//Copy một lịch làm việc đã có sẵn
router.post("/copy", formData.parse(), functions.checkToken, CalendarController.copyCalendar)

//Xóa một lịch làm việc đã có sẵn
router.delete("/del", formData.parse(), functions.checkToken, CalendarController.deleteCalendar)

//Xóa toàn bộ lịch làm việc của một công ty
router.delete("/delAll", formData.parse(), functions.checkToken, CalendarController.deleteCompanyCalendar)

// Thêm mới nhân viên vào lịch làm việc
router.post('/add_employee', formData.parse(), functions.checkToken, CalendarController.add_employee);

// Loại bỏ nhân viên vào lịch làm việc
router.post('/delete_employee', formData.parse(), functions.checkToken, CalendarController.delete_employee);

// Danh sách nhân viên trong llv
router.post('/list_employee', formData.parse(), functions.checkToken, CalendarController.list_employee);

// Danh sách nhân viên chưa có lịch làm việc
router.post('/list_not_in_cycle', formData.parse(), functions.checkToken, CalendarController.list_not_in_cycle);
module.exports = router