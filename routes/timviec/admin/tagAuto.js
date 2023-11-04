const express = require('express');
const tagAuto = require('../../../controllers/timviec/admin/tagAuto');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/listTagAuto', formData.parse(), tagAuto.listTagAuto);
router.post('/addTagAuto', formData.parse(), tagAuto.addTagAuto);
router.post('/editTagAuto', formData.parse(), tagAuto.editTagAuto);
router.post('/detailTagAuto', formData.parse(), tagAuto.detailTagAuto);
router.post('/deleteTagAuto', formData.parse(), tagAuto.deleteTagAuto);

module.exports = router;
