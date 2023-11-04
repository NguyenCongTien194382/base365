const router = require("express").Router()
const controller = require("../../../controllers/crm/Contract/ContractAI")
const formData = require("express-form-data")
const functions = require("../../../services/functions")


// Api show hợp đòng
router.post("/read_file", functions.checkToken, formData.parse(), controller.read_file)

// Tìm kiếm từ trong hợp đồng
router.post('/search', functions.checkToken, formData.parse(), controller.search);

// Thay thế từ trong file
router.post('/replace', functions.checkToken, formData.parse(), controller.replace);

router.post('/view', functions.checkToken, formData.parse(), controller.view);
module.exports = router