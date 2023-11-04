const express = require('express');
const formData = require('express-form-data');
const router = express.Router();

const videoController = require('../../../controllers/timviec/admin/video');

router.post('/video/new', formData.parse(), videoController.ListVideoNew);

router.post(
	'/video/candidate',
	formData.parse(),
	videoController.ListVideoCandidate
);

router.post(
	'/video/company',
	formData.parse(),
	videoController.ListVideoCompany
);

router.post('/video/delete', formData.parse(), videoController.deleteVideo);

router.post('/video/active', formData.parse(), videoController.activeVideo);

module.exports = router;
