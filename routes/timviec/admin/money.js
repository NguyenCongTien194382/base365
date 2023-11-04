let express = require('express');
let router = express.Router();
let adminMoney = require('../../../controllers/timviec/admin/money');
let formData = require('express-form-data');
const functions = require('../../../services/functions');

router.post('/listCom', formData.parse(), adminMoney.listCom);
router.post('/listPlusMoney', formData.parse(), adminMoney.listPlusMoney);
router.post('/listUseMoney', formData.parse(), adminMoney.listUseMoney);
router.post('/detailPlusMoney', formData.parse(), adminMoney.detailPlusMoney);
router.post('/refundMoney', formData.parse(), functions.checkToken, adminMoney.refundMoney);

module.exports = router;