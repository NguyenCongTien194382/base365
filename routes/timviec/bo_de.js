const express = require('express');
const bo_de = require('../../controllers/timviec/bo_de');
const formData = require('express-form-data');
const router = express.Router();

router.post('/', bo_de.home);
router.post('/cate', formData.parse(), bo_de.cate);
router.post('/search', formData.parse(), bo_de.search);
router.post('/search_tag', formData.parse(), bo_de.search_tag);
router.post('/detail', formData.parse(), bo_de.detail);

module.exports = router;