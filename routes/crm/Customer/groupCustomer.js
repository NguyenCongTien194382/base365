const express = require('express')
const router = express.Router();
const formData = require("express-form-data")
const GroupCustomerController = require('../../../controllers/crm/Customer/GroupCustomer')
const funtions = require('../../../services/functions')


// get danh sách group
router.post("/list_group_khach_hang", funtions.checkToken, formData.parse(), GroupCustomerController.getListGroup)

//tạo group mới

router.post("/create_GroupKH", funtions.checkToken, formData.parse(), GroupCustomerController.createGroup)

//chỉnh sửa các thuộc tính 1 group
router.post("/update_GroupKH", funtions.checkToken, formData.parse(), GroupCustomerController.update)

// xoá group chỉ định
router.post("/delete_khach_hang", funtions.checkToken, formData.parse(), GroupCustomerController.delete)

router.post('/details', funtions.checkToken, formData.parse(), GroupCustomerController.details)

module.exports = router;