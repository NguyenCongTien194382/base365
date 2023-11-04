const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/formContract")
const formData = require("express-form-data")

const functions = require("../../../services/functions")

router.post('/list', functions.checkToken, formData.parse(), controller.list);

//Api thêm hợp đồng
router.post("/add", functions.checkToken, controller.addContract)

//Api sửa hợp dồng
router.post("/edit", functions.checkToken, controller.editContract)

//Api hiển thị xóa loại hợp đồng
router.delete("/delete", functions.checkToken, formData.parse(), controller.deleteContract)

//Api xóa hợp đồng bán
router.delete("/delete/detail", functions.checkToken, formData.parse(), controller.deleteDetailContract)
module.exports = router;