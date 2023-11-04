var express = require('express');
var router = express.Router();
const toolHr = require('../../controllers/tools/hr');
var formData = require('express-form-data');

// api quét data recruitment
router.post('/toolcancelJob', formData.parse(), toolHr.cancelJob)
router.post('/toolFailJob', formData.parse(), toolHr.failJob)
router.post('/toolContactJob', formData.parse(), toolHr.contactJob)
router.post('/toolNotify', formData.parse(), toolHr.notify)
router.post('/toolPermission', formData.parse(), toolHr.permission)
router.post('/toolPolicys', formData.parse(), toolHr.policy)
router.post('/toolstageRecruitment', formData.parse(), toolHr.stageRecruitment)
// router.post('/toolsS')
// router.post('/toolsProvisionsOfCompany',formData.parse(), toolHr.)

// api quét data HR Cường
router.post('/toolAchievementFors', formData.parse(), toolHr.AchievementFors)
router.post('/toolAddInfoLeads', formData.parse(), toolHr.AddInfoLeads)
router.post('/toolBlogs', formData.parse(), toolHr.Blogs)
router.post('/toolCategorys', formData.parse(), toolHr.Categorys)
router.post('/toolCiSessions', formData.parse(), toolHr.CiSessions)
router.post('/toolCitys', formData.parse(), toolHr.Citys)
router.post('/toolCrontabQuitJobs', formData.parse(), toolHr.CrontabQuitJobs)
router.post('/toolDepartmentDetails', formData.parse(), toolHr.DepartmentDetails)
router.post('/toolDescPositions', formData.parse(), toolHr.DescPositions)
router.post('/toolDevices', formData.parse(), toolHr.Devices)
router.post('/toolInfoLeaders', formData.parse(), toolHr.InfoLeaders)
router.post('/toolInfringesFors', formData.parse(), toolHr.toolInfringe)
router.post('/toolavatar', formData.parse(), toolHr.avatar)
router.post('/toolCandidates', formData.parse(), toolHr.Candidates)
router.post('/toolEmployeePolicys', formData.parse(), toolHr.EmployeePolicys)
router.post('/toolEmployeePolicySpecifics', formData.parse(), toolHr.EmployeePolicySpecifics)
router.post('/provisionOfCompany', formData.parse(), toolHr.provisionOfCompany)
router.post('/toolAppoint', formData.parse(), toolHr.appoint)
router.post('/toolQuitJob', formData.parse(), toolHr.quitJob)
router.post('/toolTransferJob', formData.parse(), toolHr.transferJob)
router.post('/toolResign', formData.parse(), toolHr.toolResign)
router.post('/toolSalary', formData.parse(), toolHr.toolSalary)


// api
//----------------------------------------------api quet data HR----------------------
router.post('/jobDes', formData.parse(), toolHr.toolJobDes);
router.post('/anotherSkill', formData.parse(), toolHr.toolAnotherSkill);
router.post('/perDetail', formData.parse(), toolHr.toolPermisionDetail);
router.post('/remind', formData.parse(), toolHr.toolRemind);
router.post('/processInter', formData.parse(), toolHr.toolProcessInterview);
router.post('/processTraining', formData.parse(), toolHr.toolProcessTraining);
router.post('/signature', formData.parse(), toolHr.toolSignatureImage);
router.post('/scheduleInter', formData.parse(), toolHr.toolScheduleInterview);
router.post('/inviteInter', formData.parse(), toolHr.toolInviteInterview);
router.post('/recruitment', formData.parse(), toolHr.toolRecruitment);
router.post('/recruitmentNews', formData.parse(), toolHr.toolRecruitmentNews);
router.post('/getJob', formData.parse(), toolHr.getJob);
router.post('/perUser', formData.parse(), toolHr.perUser);

module.exports = router;