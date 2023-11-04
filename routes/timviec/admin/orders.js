// luồng khuyến mãi - mua hàng
var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const orders = require('../../../controllers/timviec/admin/orders');

router.post('/supporterCancelOrder', formData.parse(), orders.supporterCancelOrder);

router.post('/supporterAcceptOrder', formData.parse(), orders.supporterAcceptOrder);

router.post('/adminCancelOrder', formData.parse(), orders.adminCancelOrder);

router.post('/adminAcceptOrder', formData.parse(), orders.adminAcceptOrder);

router.post('/exchangePointOrder', formData.parse(), orders.exchangePointOrder);

router.post('/acceptCancelGiaykdNtd', formData.parse(), orders.acceptCancelGiaykdNtd);

router.post('/updateStatusDownloadChat365', formData.parse(), orders.updateStatusDowloadChat365);

router.post('/postNewHandleService', formData.parse(), orders.postNewHandleService);

router.post('/getSupporterOrderList', formData.parse(), orders.getSupporterOrderList);

router.post('/getAdminOrderList', formData.parse(), orders.getAdminOrderList);

router.post('/hideOrderAdmin', formData.parse(), orders.hideOrderAdmin);

router.post('/getGPKDNTDList', formData.parse(), orders.getGPKDNTDList);

router.post('/getOrderCashflow', formData.parse(), orders.getOrderCashflow);

router.post('/addOrderManually', formData.parse(), orders.addOrderManually);

router.post('/getSupporterList', formData.parse(), orders.getSupporterList);
router.post('/pinNewsAutomatic', formData.parse(), orders.pinNewsAutomatic);

module.exports = router;