let express = require('express');
let router = express.Router();
let bm = require('../../../controllers/timviec/admin/bm');
let formData = require('express-form-data');
const functions = require('../../../services/functions');

//chi tiết danh mục biểu mẫu
router.post('/detailDMBM', formData.parse(), bm.detailDMBM);
router.post('/tagAllBM', formData.parse(), bm.tagAllBM);

// Danh mục biểu mẫu
router.post('/cate', formData.parse(), bm.cate);
router.post('/addCate', formData.parse(), bm.addCate);
router.post('/editCate', formData.parse(), bm.editCate);
router.post('/deleteCate', formData.parse(), bm.deleteCate);

// Biểu mẫu
router.post('/form', formData.parse(), bm.form);
router.post('/addForm', functions.uploadAvatarForm, bm.addForm);
router.post('/editForm', functions.uploadAvatarForm, bm.editForm);
router.post('/pinForm', formData.parse(), bm.pinForm);
router.post('/deleteForm', formData.parse(), bm.deleteForm);
router.post('/detailForm', formData.parse(), bm.detailForm);

// Tag
router.post('/tag', formData.parse(), bm.tag);
router.post('/addTag', formData.parse(), bm.addTag);
router.post('/editTag', formData.parse(), bm.editTag);
router.post('/activeTag', formData.parse(), bm.activeTag);
router.post('/deleteTag', formData.parse(), bm.deleteTag);
router.post('/detailTag', formData.parse(), bm.detailTag);

module.exports = router;