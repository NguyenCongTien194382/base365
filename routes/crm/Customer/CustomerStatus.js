const router = require("express").Router();
const formData = require("express-form-data");
const Controllers = require("../../../controllers/crm/Customer/CustomerStatus");
const functions = require ("../../../services/functions")

// get danh sách tình trạng
router.post("/list",functions.checkToken,formData.parse(),Controllers.getList)

//tạo tình trạng 

router.post("/create",functions.checkToken,formData.parse(),Controllers.create)

//chỉnh sửa tình trạng 
router.post("/update",functions.checkToken,formData.parse(),Controllers.update)

// xoá tình trạng khách hàng
router.post("/delete",functions.checkToken,formData.parse(),Controllers.delete)

//chi tiết tình trang
router.post('/details',functions.checkToken,formData.parse(),Controllers.details)
module.exports = router;