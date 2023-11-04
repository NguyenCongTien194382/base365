const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/ContractForCus")
const formData = require("express-form-data")

const functions= require ("../../../services/functions")


// Api show hợp đòng
router.post("/list",functions.checkToken,formData.parse(), controller.showContract)


// Api show chi tiết hợp đồng
router.post("/add",functions.checkToken,formData.parse(), controller.showDetailContract)

// Api xóa hợp đồng
router.post("/delete",functions.checkToken,formData.parse(), controller.deleteContract)
module.exports = router