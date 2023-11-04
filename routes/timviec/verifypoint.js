const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const verifypoint = require('../../controllers/timviec/verifypoint');

// xac nhan diem unw vien 
// checkPointUser
router.post('/checkPointUser', formData.parse(), verifypoint.checkPointUser);
// checkPointUserForUsed
router.post('/checkPointUserForUsed', formData.parse(), verifypoint.checkPointUserForUsed);
router.post('/takeListUserBadge', formData.parse(), verifypoint.takeListUserBadge);
router.post('/setUpToDiamond', formData.parse(), verifypoint.setUpToDiamond);
module.exports = router;