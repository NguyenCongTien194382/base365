const router = require("express").Router()
const controller = require("../../../controllers/crm/Customer/CustomerContact")
const formData = require("express-form-data")
const functions= require ("../../../services/functions")




//thêmm liên hệ  khách hàng
router.post("/add",functions.checkToken,formData.parse(),controller.addContact)

//sửa liên hệ khách hàng
router.post("/edit",functions.checkToken,formData.parse(),controller.editContact)

//xóa liên hệ khách hàng
router.post("/delete",functions.checkToken,formData.parse(),controller.deleteContact)





module.exports = router