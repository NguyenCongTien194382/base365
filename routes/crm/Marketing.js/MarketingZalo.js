const router = require("express").Router();
const formData = require("express-form-data");
const Controllers = require("../../../controllers/crm/Marketing/MarketingZalo");
const functions = require("../../../services/functions")

//Lấy lịch sử gửi tin nhắn zalo
router.post('/getListHistory', functions.checkToken, formData.parse(), Controllers.getListHistory);

//Lấy chi tiết danh sách template zalo
router.post('/getListDetailTemplate', functions.checkToken, formData.parse(), Controllers.getListDetailTemplate);

//Lấy ds template zalo để gửi tin nhắn
router.post('/getListTemplate', functions.checkToken, formData.parse(), Controllers.getListTemplate);

//Gửi tin nhắn zalo
router.post('/sendMessageZalo', functions.checkToken, formData.parse(), Controllers.sendMessageZalo);

//Lấy số lượng tin nhắn đc gửi trong ngày, số lượng còn lại
router.post('/getQuota', functions.checkToken, formData.parse(), Controllers.getQuota);

module.exports = router;