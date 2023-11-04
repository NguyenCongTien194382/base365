const express = require('express');
const news = require('../../../controllers/timviec/admin/news');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/listNews', formData.parse(), news.listNews);
router.post('/listNewsLQ', formData.parse(), news.listNewsLQ);
router.post('/listCate', formData.parse(), news.listCate);
router.post('/listAdminUser', formData.parse(), news.listAdminUser);
router.post('/addNews', functions.uploadAvatarForm, news.addNews);
router.post('/detailNews', formData.parse(), news.detailNews);
router.post('/editNews', functions.uploadAvatarForm, news.editNews);
router.post('/activeNews', formData.parse(), news.activeNews);
router.post('/hotNews', formData.parse(), news.hotNews);
router.post('/deleteNews', formData.parse(), news.deleteNews);

module.exports = router;
