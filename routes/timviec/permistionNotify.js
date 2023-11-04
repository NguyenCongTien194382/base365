var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const permistionNotify = require('../../controllers/timviec/permisionNotify');
const functions = require('../../services/functions');

// router.post('/list', formData.parse(), functions.checkToken, permistionNotify.list);
router.post('/list', formData.parse(), functions.checkToken, permistionNotify.list);
router.post('/getUserByIdChat', formData.parse(), permistionNotify.getUserByIdChat);
router.post('/getListPermissionByUser', formData.parse(), functions.checkToken, permistionNotify.getListPermissionByUser);
router.post('/checkAccount', formData.parse(), functions.checkToken, permistionNotify.checkAccount);
router.post('/getkAccPermission', formData.parse(), permistionNotify.getkAccPermission);
module.exports = router;