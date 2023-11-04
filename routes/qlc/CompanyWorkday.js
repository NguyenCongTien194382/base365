const router = require("express").Router()
const controller = require("../../controllers/qlc/CompanyWorkday")
const formData = require("express-form-data")
const functions = require("../../services/functions")

// Tạo mới và chỉnh sửa
router.post("/create", functions.checkToken, formData.parse(), controller.create)
    // Chi tiết công chuẩn theo tháng 
router.post("/detail", functions.checkToken, formData.parse(), controller.detail)

module.exports = router