var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const qlc = require('../../controllers/tools/quanlichung')



//API Quản lí chung 
router.post('/toolSettingIP', qlc.toolsettingIP);
router.post('/toolDeparment', qlc.toolDeparment);
router.post('/toolGroup', qlc.toolGroup);
router.post('/toolCompany', qlc.toolCompany);
router.post('/toolHisTracking', qlc.toolHisTracking);
router.post('/toolCheckDevice', qlc.toolCheckDevice);
router.post('/toolShifts', qlc.toolShifts);
router.post('/toolFeedback', qlc.toolFeedback);
router.post('/toolReportError', qlc.toolReportError);
router.post('/toolCalendarWorkEmployee', qlc.toolCalendarWorkEmployee);
router.post('/toolCTCalendarWorkEmployee', qlc.toolCTCalendarWorkEmployee);
router.post('/company_coordinate', formData.parse(), qlc.company_coordinate);
router.post('/company_web_ip', formData.parse(), qlc.company_web_ip);
router.post('/company_wifi', formData.parse(), qlc.company_wifi);

module.exports = router;