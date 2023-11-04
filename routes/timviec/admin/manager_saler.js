var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
var controller = require('../../../controllers/timviec/admin/accountManagement');

router.post('/listSaler', formData.parse(), controller.listSaler);
// router.post('/listSaler', formData.parse(), controller.listSaler);

// Cập nhật thông tin admin với qlc
router.post('/updateInfor', formData.parse(), controller.updateInfor);
router.post('/list_emp', formData.parse(), controller.list_emp);
router.post('/look_account', formData.parse(), controller.lockAccount);
router.post('/ListDataEntry', formData.parse(), controller.getListAccountDataEntry);
router.post('/ListAccountHR', formData.parse(), controller.ListAccountHR);
router.post('/active_ns', formData.parse(), controller.lockAccountNS);
router.post('/addHR', formData.parse(), controller.addHR);
router.post('/deleteHR', formData.parse(), controller.deleteHR);
module.exports = router;