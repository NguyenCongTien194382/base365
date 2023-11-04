const express = require('express');
const formData = require('express-form-data');
const router = express.Router();

const pointController = require('../../../controllers/timviec/admin/point');

router.post('/lt/list', formData.parse(), pointController.lt);

router.post('/lt/plus', formData.parse(), pointController.listPointPlus);

router.post('/lt/lichsu', formData.parse(), pointController.listHistory);

router.post('/lt/ghimtin', formData.parse(), pointController.listHistoryPin);

router.post('/lt/baoluu', formData.parse(), pointController.listReserve);

router.post('/lt/goi', formData.parse(), pointController.listPoint);

router.post('/lt/lichsu_tru', formData.parse(), pointController.listEx);

router.post('/lt/lichsu_cong', formData.parse(), pointController.listPlus);

router.post('/add/goi', formData.parse(), pointController.addPoint);

router.post('/add/congty', formData.parse(), pointController.addPointUsed);

router.post('/baoluu/add', formData.parse(), pointController.addReverse);

router.post('/lt/delete', formData.parse(), pointController.deleteList);

router.post('/baoluu/delete', formData.parse(), pointController.deleteReverse);

router.post('/goi/delete', formData.parse(), pointController.deletePoint);

router.post('/ls/delete', formData.parse(), pointController.deleteHistory);

router.post(
    '/plus/delete',
    formData.parse(),
    pointController.deleteHistoryPlus
);

router.post('/exp/delete', formData.parse(), pointController.deleteHistoryEx);

router.post('/ghim/delete', formData.parse(), pointController.deleteHistoryPin);

router.post(
    '/getInfoUpdatelt',
    formData.parse(),
    pointController.getInfoUpdateLt
);

router.post('/baoluu/update', formData.parse(), pointController.updateReverse);

router.post('/lt/update', formData.parse(), pointController.updateUserL);

router.post('/goi/update', formData.parse(), pointController.updatePoint);

router.post('/goi/info', formData.parse(), pointController.getInfoPoint);

router.post('/ghim/admin', formData.parse(), pointController.getListAdminUsers);

router.post(
    '/exp/refound',
    formData.parse(),
    pointController.updatePointUsedAndCompany
);

router.post('/ls/update', formData.parse(), pointController.updatePointCompany);

router.get('/excel/export', formData.parse(), pointController.exportExcel);

router.post('/excel/info', formData.parse(), pointController.getInfoAllExp);

router.post('/add/company', formData.parse(), pointController.addCompany);

module.exports = router;