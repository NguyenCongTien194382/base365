const router = require('express').Router();
const CheckDeviceController = require("../../controllers/qlc/CheckDevice");
const functions= require ("../../services/functions")
const formData = require('express-form-data')
//lấy danh sách thiết bị 

//loc danh sach theo cty 
router.post("/list",functions.checkToken,formData.parse(), CheckDeviceController.getlist);

//tao moi yeu cau dang ki thiet bi
router.post("/create",functions.checkToken,formData.parse(), CheckDeviceController.createDevice)

//duyet thiet bi
router.post("/add",functions.checkToken,formData.parse(), CheckDeviceController.add)

//xoa yeu cau cau dang ki thiet bi
router.delete("/delete",functions.checkToken,formData.parse(), CheckDeviceController.delete)


module.exports = router