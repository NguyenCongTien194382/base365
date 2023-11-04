const router = require("express").Router()
const controller = require("../../controllers/qlc/CalendarWorkEmployee")
const formData = require("express-form-data")
const functions = require("../../services/functions")

//lấy tất cả lịch làm việc nhân viên
router.post("/list/all", functions.checkToken, formData.parse(), controller.getAllCalendarEmp)

//lấy danh sách lịch làm việc của nhân viên theo id
router.get("/:id", formData.parse(), controller.getCalendarById)

//lấy danh sách lịch làm việc của nhân viên theo cty
router.get("/allCompany", formData.parse(), controller.getAllCalendarEmpByCom)

//tạo danh sách lịch làm việc cho nhân viên
// router.post("/", formData.parse(), controller.createCalEmp)

//sửa danh sách 
router.post("/:id", formData.parse(), controller.editCalendar)

//Xóa toàn bộ lịch làm việc của một công ty
router.delete("/allCompany", formData.parse(), controller.deleteCompanyCalendar)

//Xóa toàn bộ lịch làm việc của hệ thống
router.delete("/", formData.parse(), controller.deleteAllCalendars)

//Xóa một lịch làm việc đã có sẵn
router.delete("/:id", formData.parse(), controller.deleteCalendar)
module.exports = router