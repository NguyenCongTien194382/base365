const express = require('express');
const router = express.Router();
const orders = require('../../controllers/timviec/orders');
const formData = require('express-form-data');
const functions = require('../../services/functions')

//Đặt hàng
router.post('/placeOrder', formData.parse(), orders.orderProduct);

router.get('/getPromoPoints', formData.parse(), functions.checkToken, orders.getPromotionalPoints);

router.post('/getDiscountData', formData.parse(), orders.getDiscountData);

router.post('/getPriceListByType', formData.parse(), orders.getPriceListByType)

router.post('/getNews', formData.parse(), orders.getNews)

router.post('/getOrderHistory', formData.parse(), orders.getOrderHistory);

router.post('/getOrderDetails', formData.parse(), orders.getOrderDetails);

router.post('/getPricelists', formData.parse(), orders.getPricelists);

router.post('/getVipData', formData.parse(), orders.getVipData);

router.post('/getLatestOrderId', formData.parse(), orders.getLatestOrderId);

router.post('/downloadOrderPDF', formData.parse(), orders.downloadOrderPDF);

router.post('/getServiceOrder', formData.parse(), orders.getServiceOrder)


module.exports = router;