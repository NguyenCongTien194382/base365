const express = require('express');
const tag = require('../../../controllers/timviec/admin/tagManager');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/listTagManager', formData.parse(), tag.listTagManager);
router.post('/listCity', tag.listCity);
router.post('/listDistrict', tag.listDistrict);
router.post('/addTagManager', formData.parse(), tag.addTagManager);
router.post('/editTagManager', formData.parse(), tag.editTagManager);
router.post('/indexTagManager', formData.parse(), tag.indexTagManager);
router.post('/detailTagManager', formData.parse(), tag.detailTagManager);
router.post('/deleteTagManager', formData.parse(), tag.deleteTagManager);

module.exports = router;
