// routes/raonhanh.js
const express = require('express');
const router = express.Router();

const newRN365Router = require('./raonhanh365/new');
const blogRaoNhanh365Router = require('./raonhanh365/blog');
const orderRaoNhanh = require('./raonhanh365/order');
const userRaoNhanh = require('./raonhanh365/user');
const companyRaoNhanh365Router = require('./raonhanh365/company');
const cartRaoNhanh365Router = require('./raonhanh365/cart');
const priceListRaoNhanh365Router = require('./raonhanh365/priceList');
const adminRaonhanh365 = require('./raonhanh365/admin');
const topCache = require('./raonhanh365/topCache')

router.use('/new', newRN365Router);
router.use('/blog', blogRaoNhanh365Router);
router.use('/orderRaoNhanh', orderRaoNhanh);
router.use('/userRaoNhanh', userRaoNhanh);
router.use('/com', companyRaoNhanh365Router);
router.use('/cart', cartRaoNhanh365Router);
router.use('/priceList', priceListRaoNhanh365Router);
router.use('/admin', adminRaonhanh365);
router.use('/topCache', topCache);

module.exports = router;