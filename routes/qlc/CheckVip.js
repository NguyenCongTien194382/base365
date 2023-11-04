const router = require("express").Router()
const controller = require("../../controllers/qlc/CheckVip")
const formData = require("express-form-data")
const functions = require("../../services/functions")

//check vip

router.post("/afterLogin", formData.parse(), functions.checkToken, controller.afterLogin)
router.post("/beforeLogin", formData.parse(), controller.beforeLogin)

module.exports = router