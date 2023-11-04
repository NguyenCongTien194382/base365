const router = require("express").Router()
const controller = require("../../controllers/qlc/Feedback")
const formData = require("express-form-data")
const functions = require("../../services/functions")

//check vip

router.post("/", formData.parse(), functions.checkToken, controller.create)

// router.post("/createFeedEmp", formData.parse(), functions.checkToken, controller.createFeedEmp)

module.exports = router