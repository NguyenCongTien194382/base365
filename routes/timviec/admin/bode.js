let express = require('express');
let router = express.Router();
let bode = require('../../../controllers/timviec/admin/bode');
let formData = require('express-form-data');
const functions = require('../../../services/functions');

// Danh mục Câu hỏi tuyển dụng
router.post('/bodecate', formData.parse(), bode.bodecate);
router.post('/addCateBD', formData.parse(), bode.addCateBD);
router.post('/editCateBD', formData.parse(), bode.editCateBD);
router.post('/deleteCateBD', formData.parse(), bode.deleteCateBD);
//chi tiết danh mục bộ đề
router.post('/detailDMBD', formData.parse(), bode.detailDMBD);

// // Câu hỏi tuyển dụng
router.post('/BoDe', formData.parse(), bode.BoDe);
router.post('/addBD', formData.parse(), bode.addBD);
router.post('/editBD', formData.parse(), bode.editBD);
router.post('/deleteBD', formData.parse(), bode.deleteBD);
router.post('/detailBD', formData.parse(), bode.detailBD);

// // Tag
router.post('/tagAllBD', formData.parse(), bode.tagAllBD);
router.post('/tagBD', formData.parse(), bode.tagBD);
router.post('/addTagBD', formData.parse(), bode.addTagBD);
router.post('/editTagBD', formData.parse(), bode.editTagBD);
router.post('/activeTagBD', formData.parse(), bode.activeTagBD);
router.post('/deleteTagBD', formData.parse(), bode.deleteTagBD);
router.post('/detailTagBD', formData.parse(), bode.detailTagBD);


router.post('/allListDMBD', formData.parse(), bode.allListDMBD);

module.exports = router;