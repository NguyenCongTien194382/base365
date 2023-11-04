const router = require("express").Router();
const formData = require("express-form-data");
const controllers = require("../../../controllers/crm/CustomerCare/CustomerCare");
const functions = require("../../../services/functions")

//Api hiển thị lịch sử cuộc gọi
router.post('/logcall', functions.checkToken, formData.parse(), controllers.Callhistory)

//Api gọi điện 
router.post('/call', functions.checkToken, formData.parse(), controllers.Call)

//Api danh sách line 
router.post('/listLine', functions.checkToken, formData.parse(), controllers.QuanLyLine)

router.post('/listLine_v2', functions.checkToken, formData.parse(), controllers.QuanLyLine_v2)

//Api đổ ra sô line để tìm kiém
router.post('/listSearch', functions.checkToken, formData.parse(), controllers.listLineSearch)

//Edit người phụ trách
router.post("/update", functions.checkToken, formData.parse(), controllers.updateLine)


module.exports = router;