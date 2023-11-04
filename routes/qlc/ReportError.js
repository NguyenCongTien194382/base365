const router = require("express").Router()
const controller = require("../../controllers/qlc/ReportError")
const formData = require("express-form-data")
const functions = require("../../services/functions")

//báo lỗi

router.post("/", formData.parse(),functions.checkToken, controller.create)

module.exports = router