const router = require("express").Router()
const controller = require("../../controllers/qlc/TrackingQR")
const formData = require("express-form-data")
const functions = require("../../services/functions")




///lấy danh sách vị trí công ty chấm công bằng QR
router.post("/", formData.parse(), controller.getlist)

router.post("/create", formData.parse(), controller.CreateQR)

router.post('/update_enable_qr', formData.parse(), controller.update_enable_qr);

router.post('/get_config_timekeeping_qr', functions.checkToken, formData.parse(), controller.get_config_timekeeping_qr);

router.post("/delete", functions.checkToken, formData.parse(), controller.delete)
module.exports = router