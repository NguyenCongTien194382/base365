const express = require('express');
const office = require('../../../controllers/timviec/admin/office');
const formData = require('express-form-data');
const functions = require('../../../services/functions')
const router = express.Router();

router.post('/posts', formData.parse(), office.posts);
router.post('/addPosts', functions.uploadAvatarForm, office.addPosts);
router.post('/detailPosts', formData.parse(), office.detailPosts);
router.post('/editPosts', functions.uploadAvatarForm, office.editPosts);
router.post('/activePosts', formData.parse(), office.activePosts);
router.post('/mailPosts', formData.parse(), office.mailPosts);
router.post('/hotPosts', formData.parse(), office.hotPosts);
router.post('/deletePosts', formData.parse(), office.deletePosts);

module.exports = router;