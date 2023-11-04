const router = require("express").Router()
const controller = require("../../controllers/qlc/TrackingWifi")
const formData = require("express-form-data")
const functions = require("../../services/functions")



// đổ danh sách wifi chấm công 
router.post("/list", formData.parse(), functions.checkToken, controller.getlist)
    //tạo để test
router.post("/create", formData.parse(), functions.checkToken, controller.Create)

router.post("/edit", formData.parse(), functions.checkToken, controller.edit)

router.post("/delete", formData.parse(), functions.checkToken, controller.delete)

router.post("/set_company_wifi_default", formData.parse(), functions.checkToken, controller.set_company_wifi_default)


module.exports = router