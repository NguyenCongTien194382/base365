var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const functions = require('../../services/functions');
const controller = require('../../controllers/timviec/checkSpamNew');


router.post('/trungtu', formData.parse(), controller.trungtu);

module.exports = router;