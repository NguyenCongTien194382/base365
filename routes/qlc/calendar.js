const router = require('express').Router();
const functions = require("../../services/functions")

const CalendarController = require("../../controllers/qlc/calendar")
var formData = require('express-form-data')

//:ấy danh sách lịch làm việc của một công ty
router.post("/list", formData.parse(), functions.checkToken, CalendarController.getAllCalendarCompany)

//Tạo một lịch làm việc mới
router.post("/create", formData.parse(), functions.checkToken, CalendarController.create)

//Chỉnh sửa một lịch làm việc đã có sẵn
router.post("/edit", formData.parse(), functions.checkToken, CalendarController.editCalendar)

//Copy một lịch làm việc đã có sẵn
router.post("/copy", formData.parse(), functions.checkToken, CalendarController.copyCalendar)

//Xóa một lịch làm việc đã có sẵn
router.delete("/del", formData.parse(), functions.checkToken, CalendarController.deleteCalendar)

//Xóa toàn bộ lịch làm việc của một công ty
router.delete("/delAll", formData.parse(), functions.checkToken, CalendarController.deleteCompanyCalendar)


module.exports = router