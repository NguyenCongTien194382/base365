const router = require('express').Router()
const Controllers = require('../../controllers/qlc/CompanyCoordinate');
const functions = require("../../services/functions");
var formData = require('express-form-data');

router.post('/add', functions.checkToken, formData.parse(), Controllers.add);
router.post('/list', functions.checkToken, formData.parse(), Controllers.list);
router.post('/delete', functions.checkToken, formData.parse(), Controllers.delete);
router.post('/set_coordinate_default', functions.checkToken, formData.parse(), Controllers.set_coordinate_default);


module.exports = router