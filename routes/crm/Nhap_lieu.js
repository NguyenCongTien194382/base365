const router = require('express').Router();
const formData = require("express-form-data");
const controllers = require("../../controllers/crm/Nhap_lieu");
const funtions = require('../../services/functions')

router.post('/NhapLieu',funtions.checkToken,formData.parse(), controllers.nhap_lieu);
module.exports = router;