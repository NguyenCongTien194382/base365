const router = require('express').Router()
const Controllers = require('../../controllers/qlc/CompanyWebIP');
const functions = require("../../services/functions");
var formData = require('express-form-data');

router.post('/list', functions.checkToken, formData.parse(), Controllers.list);


module.exports = router