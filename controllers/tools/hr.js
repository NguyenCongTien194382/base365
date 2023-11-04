const functions = require('../../services/functions');
//const Recruitment = require('../../models/hr/Recruitments.js');
const HR_AchievementFors = require('../../models/hr/AchievementFors');
const HR_AddInfoLeads = require('../../models/hr/AddInfoLeads');
const HR_Blogs = require('../../models/hr/Blogs');
const HR_Categorys = require('../../models/hr/Categorys');
const HR_CiSessions = require('../../models/hr/CiSessions');
const HR_Citys = require('../../models/hr/Citys');
const HR_CrontabQuitJobs = require('../../models/hr/CrontabQuitJobs');
const HR_Candidates = require('../../models/hr/Candidates');
const HR_EmployeePolicys = require('../../models/hr/EmployeePolicys');
const HR_EmployeePolicySpecifics = require('../../models/hr/EmployeePolicySpecifics');
const HR_ProvisionOfCompanys = require('../../models/hr/ProvisionOfCompanys');

const HR_DepartmentDetails = require('../../models/hr/DepartmentDetails');
const HR_DescPositions = require('../../models/hr/DescPositions');
const HR_Devices = require('../../models/hr/Devices');
const HR_InfoLeaders = require('../../models/hr/InfoLeaders');
const HR_InfringesFors = require('../../models/hr/InfringesFors');
const FormData = require('form-data');
const axios = require('axios');

const JobDes = require('../../models/hr/JobDescriptions');
const AnotherSkill = require('../../models/hr/AnotherSkill');
const PermisionDetail = require('../../models/hr/PermisionDetail');
const Remind = require('../../models/hr/Remind');
const ProcessInterview = require('../../models/hr/ProcessInterview');
const ProcessTraining = require('../../models/hr/ProcessTraining');
const SignatureImage = require('../../models/hr/SignatureImage');
const InviteInterview = require('../../models/hr/InviteInterview');
const ScheduleInterview = require('../../models/hr/ScheduleInterview');
const Recruitment = require('../../models/hr/Recruitment');
const RecruitmentNews = require('../../models/hr/RecruitmentNews');

const HR_Cancel = require('../../models/hr/CancelJob.js');
const HR_FailJob = require('../../models/hr/FailJob.js');
const HR_ContactJob = require('../../models/hr/ContactJob.js');
const HR_GetJobs = require('../../models/hr/GetJob');
const HR_Notifys = require('../../models/hr/Notify.js');
const HR_Permisions = require('../../models/hr/Permision.js');
const HR_Policys = require('../../models/hr/Policys.js');
const HR_StageRecruitments = require('../../models/hr/StageRecruitment.js');
const HR_Luong = require('../../models/hr/Salarys');
const Appoint = require('../../models/hr/personalChange/Appoint');
const QuitJob = require('../../models/hr/personalChange/QuitJob');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const Resign = require('../../models/hr/personalChange/Resign');
const Salarys = require('../../models/Tinhluong/Tinhluong365SalaryBasic');
const permisionuser = require('../../models/hr/PermisionUser');
exports.AchievementFors = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let achievementId = element.achievement_id;
        let listUser = [];
        let achievementAt = element.achievement_at;
        let content = element.content;
        let createdBy = element.created_by;
        if (element.list_user) {
            for (let j = 0; j < element.list_user.split(',').length; j++) {
                listUser.push({ userId: element.list_user.split(',')[j], name: element.list_user_name.split(',')[j] });
            }
        }
        let achievementType = element.achievement_type;
        let appellation = element.appellation;
        let achievementLevel = element.achievement_level;
        let type = element.type;
        let comId = element.com_id;
        let depId = element.dep_id;
        let depName = element.dep_name;
        let createdAt = element.created_at;
        let updatedAt = element.updated_at;
        await HR_AchievementFors.findOneAndUpdate({ id }, {
            id,
            achievementId,
            content,
            createdBy,
            achievementAt,
            achievementType,
            appellation,
            achievementLevel,
            type,
            comId,
            depId,
            depName,
            createdAt,
            updatedAt,
            listUser
        }, { upsert: true, new: true });
        return functions.success(res, 'success');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
// cancel job
exports.cancelJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let canId = element.can_id;
        let isDelete = element.is_delete;
        let deletedAt = element.deleted_at;
        let resiredSalary = element.resired_salary;
        let salary = element.salary;
        let note = element.note;
        let status = element.status;
        let isSwitch = element.is_switch;
        let createdAt = element.created_at;
        await HR_Cancel.findOneAndUpdate({ id },
            { id, canId, isDelete, deletedAt, resiredSalary, salary, note, status, isSwitch, createdAt },
            { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// failJob
exports.failJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let canId = element.can_id;
        let type = element.type;
        let isDelete = element.is_delete;
        let deletedAt = element.deleted_at;
        let note = element.note;
        let email = element.email;
        let contentsend = element.contentsend;
        let isSwitch = element.is_switch;
        let createdAt = element.created_at;
        await HR_FailJob.findOneAndUpdate({ id },
            { id, canId, type, isDelete, deletedAt, note, email, contentsend, isSwitch, createdAt },
            { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.AddInfoLeads = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let epId = element.ep_id;
        let nameDes = element.name_des;
        let description = element.description;
        let createdAt = element.created_at;
        let updatedAt = element.updated_at;
        await HR_AddInfoLeads.findOneAndUpdate({ id }, {
            id,
            epId,
            nameDes,
            description,
            createdAt,
            updatedAt
        }, { upsert: true, new: true });

        return functions.success(res, 'pull data success');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// ContactJob

exports.contactJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let canId = element.can_id;
        let isDelete = element.is_delete;
        let deletedAt = element.deleted_at;
        let resiredSalary = element.resired_salary;
        let salary = element.salary;
        let offerTime = element.offer_time;
        let epOffer = element.ep_offer;
        let note = element.note;
        let isSwitch = element.is_switch;
        let createdAt = element.created_at;
        await HR_ContactJob.findOneAndUpdate({ id }, { id, canId, isDelete, deletedAt, resiredSalary, note, salary, offerTime, epOffer, isSwitch, createdAt }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Blogs = async (req, res, next) => {
    try {

        const element = req.body;
        let id = Number(element.id);
        let content = element.content;
        let comment = element.comment;
        await HR_Blogs.findOneAndUpdate({ id }, { id, content, comment }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Categorys = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.cat_id);
        let name = element.cat_name;
        let title = element.cat_title;
        let tags = element.cat_tags;
        let description = element.cat_description;
        let keyword = element.cat_keyword;
        let parentId = element.cat_parent_id;
        let lq = element.cat_lq;
        let count = element.cat_count;
        let countVl = element.cat_count_vl;
        let order = element.cat_order;
        let active = element.cat_active;
        let hot = element.cat_hot;
        let ut = element.cat_ut;
        let only = element.cat_only;
        let except = element.cat_except;
        let tlq = element.cat_tlq;
        let tlqUv = element.cat_tlq_uv;

        await HR_Categorys.findOneAndUpdate({ id }, {
            id,
            name,
            title,
            tags,
            description,
            keyword,
            parentId,
            lq,
            count,
            countVl,
            order,
            active,
            hot,
            ut,
            only,
            except,
            tlq,
            tlqUv
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.CiSessions = async (req, res, next) => {
    try {
        let data1 = await functions.getDataAxios(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_ci_sessions`);
        for (let i = 0; i < data1.length; i++) {
            let id = data1[i].id;
            let ipAddress = data1[i].ip_address;
            let timestamp = data1[i].timestamp;
            let data = Buffer.from(data1[i].data, 'base64');

            let CiSessions = new HR_CiSessions({
                id,
                ipAddress,
                timestamp,
                data
            });
            await CiSessions.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Citys = async (req, res, next) => {
    try {
        // let page = 1;
        // let result = true;
        // while (result) {
        //     let data = await functions.getDataAxios(`https://phanmemnhansu.timviec365.vn/api/Nodejs/gettbl_per_user?page=${page}`);
        //     if (data.length === 0) {
        //         result = false
        //     }
        //     for (let i = 0; i < data.length; i++) {

        //         // let name = data[i].cit_name;
        //         // let order = data[i].cit_order;
        //         // let type = data[i].cit_type;
        //         // let count = data[i].cit_count;
        //         // let parentId = data[i].cit_parent;
        //         let id = data[i].id;
        //         let userId = data[i].user_id;
        //         let perId = data[i].per_id;
        //         let barId = data[i].bar_id;
        //         await permisionuser.create({
        //             id,
        //             userId,
        //             perId,
        //             barId,
        //         })
        //     }
        //     page++;
        //     console.log(page)
        // }

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.CrontabQuitJobs = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let epID = element.id_ep;
        let comId = element.com_id;
        let currentPosition = element.current_position;
        let currentDepId = element.current_dep_id;
        let createdAt = element.created_at;
        let decisionId = element.decision_id;
        let note = element.note;
        let type = element.type;
        let shiftId = element.shift_id;

        await HR_CrontabQuitJobs.findOneAndUpdate({ id }, {
            id,
            epID,
            comId,
            currentPosition,
            currentDepId,
            createdAt,
            decisionId,
            note,
            type,
            shiftId,
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.DepartmentDetails = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let comId = element.com_id;
        let depId = element.dep_id;
        let description = element.description;
        await HR_DepartmentDetails.findOneAndUpdate({ id }, { id, comId, depId, description }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.DescPositions = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let positionId = element.position_id;
        let comId = element.com_id;
        let description = element.description;
        await HR_DescPositions.findOneAndUpdate({ id }, { id, positionId, comId, description }, { upsert: true, new: true });


    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Devices = async (req, res, next) => {
    try {
        await HR_Devices.deleteMany({});

        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_devices');
        for (let i = 0; i < data.length; i++) {
            let id = Number(data[i].id);
            let userId = data[i].user_id;
            let infoBrower = data[i].info_brower;
            let tokenBrowser = data[i].token_browser;
            let lastLogin = data[i].last_login;
            let deviceType = data[i].device_type;
            let loginType = data[i].login_type;
            let createdAt = data[i].created_at;
            let Devices = new HR_Devices({ id, userId, infoBrower, tokenBrowser, lastLogin, deviceType, loginType, createdAt });
            await Devices.save();
        }
        return functions.success(res, 'pull data success');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.EmployeePolicys = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let name = element.name;
        let timeStart = element.time_start;
        let supervisorName = element.supervisor_name;
        let description = element.description;
        let isDelete = element.is_delete;
        let comId = element.com_id;
        let file = element.file;
        let createdAt = element.created_at;
        let deletedAt = element.deleted_at;
        await HR_EmployeePolicys.findOneAndUpdate({ id }, { id, name, timeStart, supervisorName, description, isDelete, comId, file, createdAt, deletedAt }, { upsert: true, new: true });
        return functions.success(res, 'pull data success');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
exports.EmployeePolicySpecifics = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let name = element.name;
        let timeStart = element.time_start;
        let employeePolicyId = element.employe_policy_id;
        let supervisorName = element.supervisor_name;
        let description = element.description;
        let content = element.content;
        let applyFor = element.apply_for;
        let isDelete = element.is_delete;
        let createdBy = element.created_by;
        let file = element.file;
        let createdAt = element.created_at;
        let updated_at = element.updated_at;
        let deletedAt = element.deleted_at;
        await HR_EmployeePolicySpecifics.findOneAndUpdate({ id }, { id, name, applyFor, timeStart, employeePolicyId, supervisorName, description, content, applyFor, isDelete, createdBy, file, createdAt, updated_at, deletedAt }, { upsert: true, new: true });
        return functions.success(res, 'pull data success');
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
exports.Candidates = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let name = element.name;
        let email = element.email;
        let phone = element.phone;
        let cvFrom = element.cv_from;
        let userRecommend = element.user_recommend;
        let recruitmentNewsId = element.recruitment_news_id;
        let timeSendCv = element.time_send_cv;
        let interviewTime = element.interview_time;
        let interviewResult = element.interview_result;
        let interviewVote = element.interview_vote;
        let salaryAgree = element.salary_agree;
        let status = element.status;
        let cv = element.cv;
        let createdAt = element.created_at;
        let updatedAt = element.updated_at;
        let isDelete = element.is_delete;
        let comId = element.com_id;
        let isOfferJob = element.is_offer_job;
        let gender = element.can_gender;
        let birthday = element.can_birthday;
        let education = element.can_education;
        let exp = element.can_exp;
        let isMarried = element.can_is_married;
        let address = element.can_address;
        let userHiring = element.user_hiring;
        let starVote = element.star_vote;
        let school = element.school;
        let hometown = element.hometown;
        let isSwitch = element.is_switch;
        let epIdCrm = element.ep_id_crm;
        await HR_Candidates.findOneAndUpdate({ id: id }, { name, email, phone, cvFrom, userRecommend, recruitmentNewsId, timeSendCv, interviewTime, interviewResult, interviewVote, salaryAgree, status, cv, createdAt, updatedAt, isDelete, comId, isOfferJob, gender, birthday, education, exp, isMarried, address, userHiring, starVote, school, hometown, isSwitch, epIdCrm }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

// Notify
exports.notify = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let canId = element.can_id;
        let type = element.type;
        let comNotify = element.com_notify;
        let comId = element.com_id;
        let userId = element.user_id;
        let createdAt = new Date(element.created_at);
        await HR_Notifys.findOneAndUpdate({ id }, { id, canId, type, comNotify, comId, userId, createdAt }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.InfoLeaders = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let epId = element.ep_id;
        let description = element.description;
        let desPosition = element.des_position;
        let createdAt = element.created_at;
        let updatedAt = element.updated_at;
        await HR_InfoLeaders.findOneAndUpdate({ id }, { id, epId, description, desPosition, createdAt, updatedAt }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};


// permission
exports.permission = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let namePer = element.name_per;
        await HR_Permisions.findOneAndUpdate({ id }, { id, namePer }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// policys
exports.policy = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let provisionId = element.provision_id;
        let timeStart = element.time_start;
        let supervisorName = element.supervisor_name;
        let applyFor = element.apply_for;
        let content = element.content;
        let createdBy = element.created_by;
        let isDelete = element.is_delete;
        let createdAt = element.created_at;
        let name = element.name;
        let file = element.file;
        let deletedAt = element.deleted_at;

        await HR_Policys.findOneAndUpdate({ id }, { id, provisionId, timeStart, supervisorName, applyFor, content, createdBy, isDelete, createdAt, name, file, deletedAt }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.provisionOfCompany = async (req, res, next) => {
    try {

        const element = req.body;
        let id = Number(element.id);
        await HR_ProvisionOfCompanys.findOneAndUpdate({ id }, {
            id: element.id,
            description: element.description,
            isDelete: element.is_delete,
            name: element.name,
            timeStart: element.time_start,
            supervisorName: element.supervisor_name,
            comId: element.com_id,
            file: element.file,
            createdAt: element.created_at,
            deletedAt: element.deleted_at,
        }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.avatar = async (req, res, next) => {
    try {
        const element = req.body;
        await HR_InfoLeaders.findOneAndUpdate({ epId: Number(element.ep_id) }, { avatar: element.avatar })

        return functions.success(res, 'pull data success');
    } catch (error) {
        return functions.setError(res, error)
    }
}
//stageRecruitment
exports.stageRecruitment = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await HR_StageRecruitments.findOneAndUpdate({ id }, {
            id: element.id,
            recruitmentId: element.recruitment_id,
            name: element.name,
            positionAssumed: element.position_assumed,
            target: element.target,
            complete_time: element.complete_time,
            defscription: element.description,
            isDelete: element.is_delete
        }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.toolInfringe = async (req, res, next) => {
    try {
        const element = req.body;
        let listUser = [];
        if (element.list_user) {
            for (let j = 0; j < element.list_user.split(',').length; j++) {
                listUser.push({ userId: element.list_user.split(',')[j], name: element.list_user_name.split(',')[j] });
            }
        }
        let id = Number(element.id);
        await HR_InfringesFors.findOneAndUpdate({ id }, {
            id: element.id,
            infringeName: element.infringe_name,
            regulatoryBasis: element.regulatory_basis,
            numberViolation: element.number_violation,
            listUser: listUser,
            createdBy: element.created_by,
            infringeAt: element.infringe_at,
            infringeType: element.infringe_type,
            type: element.type,
            companyId: element.com_id,
            depId: element.dep_id,
            depName: element.dep_name,
            createdAt: new Date(element.created_at),
            updatedAt: new Date(element.updated_at)
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolJobDes = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await JobDes.findOneAndUpdate({ id }, {
            id: element.id,
            name: element.name,
            depName: element.department_name,
            des: element.description,
            jobRequire: element.job_require,
            roadMap: element.road_map,
            comId: element.com_id,
            createdAt: element.created_at,
            updatedAt: element.updated_at,
            deletedAt: element.deleted_at,
            isDelete: element.is_delete
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolAnotherSkill = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await AnotherSkill.findOneAndUpdate({ id }, {
            id: element.id,
            canId: element.can_id,
            skillName: element.skill_name,
            skillVote: element.skill_vote,
            createAt: element.created_at
        }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolPermisionDetail = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await PermisionDetail.findOneAndUpdate({ id }, {
            id: element.id,
            perId: element.id_per,
            actName: element.action_name,
            actCode: element.action_code,
            checkAct: element.check_action
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRemind = async (req, res, next) => {
    try {

        const element = req.body;
        let id = Number(element.id);
        await Remind.findOneAndUpdate({ id }, {
            id: element.id,
            type: element.type,
            remindType: element.remind_type,
            canId: element.can_id,
            canName: element.can_name,
            comId: element.com_id,
            userId: element.user_id,
            time: element.time,
            createdAt: element.created_at
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolProcessInterview = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await ProcessInterview.findOneAndUpdate({ id }, {
            id: element.id,
            name: element.name,
            processBefore: element.process_before,
            beforeProcess: element.before_process,
            comId: element.com_id,
            createdAt: element.created_at
        }, { upsert: true, new: true });


        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolProcessTraining = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await ProcessTraining.findOneAndUpdate({ id }, {
            id: element.id,
            name: element.name,
            description: element.description,
            comId: element.com_id,
            isDelete: element.is_delete,
            createdAt: element.created_at,
            updatedAt: element.updated_at,
            deletedAt: element.deleted_at
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolSignatureImage = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await SignatureImage.findOneAndUpdate({ id }, {
            id: element.id,
            empId: element.ep_id,
            imgName: element.image_name,
            createdAt: element.created_at,
            isDelete: element.is_delete,
            deletedAt: element.deleted_at
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolInviteInterview = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await InviteInterview.findOneAndUpdate({ id }, {
            id: element.id,
            posApply: element.position_apply,
            canId: element.candidate_id,
            canEmail: element.candidate_email,
            canName: element.candidate_name,
            hrName: element.hr_name,
            content: element.content,
            note: element.note,
            noteTest: element.note_test,
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolScheduleInterview = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await ScheduleInterview.findOneAndUpdate({ id }, {
            id: Number(element.id),
            canId: element.can_id,
            empInterview: element.ep_interview,
            processInterviewId: element.process_interview_id,
            canEmail: element.uv_email,
            resiredSalary: element.resired_salary,
            salary: element.salary,
            interviewTime: Date(element.interview_time),
            content: element.contentsend,
            isSwitch: element.is_switch,
            note: element.note,
            empCrmId: element.id_ep_crm,
            createdAt: element.created_at,
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRecruitment = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await Recruitment.findOneAndUpdate({ id }, {
            id: element.id,
            name: element.name,
            createdBy: element.created_by,
            createdAt: element.created_at,
            deletedAt: element.deleted_at,
            isDelete: element.is_delete,
            applyFor: element.apply_for,
            slug: element.slug,
            comId: element.com_id,
            isCom: element.is_com
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRecruitmentNews = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await RecruitmentNews.findOneAndUpdate({ id }, {
            id: element.id,
            title: element.title,
            posApply: element.position_apply,
            cityId: element.cit_id,
            address: element.address,
            cateId: element.cate_id,
            salaryId: element.salary_id,
            number: element.number,
            timeStart: Date(element.recruitment_time),
            timeEnd: Date(element.recruitment_time_to),
            jobDetail: element.job_detail,
            wokingForm: element.woking_form,
            probationaryTime: element.probationary_time,
            moneyTip: element.money_tip,
            jobDes: element.job_description,
            interest: element.interest,
            recruitmentId: element.recruitmen_id,
            jobExp: element.job_exp,
            degree: element.degree,
            gender: element.gender,
            jobRequire: element.job_require,
            memberFollow: element.member_follow,
            hrName: element.hr_name,
            createdAt: element.created_at,
            updatedAt: element.updated_at,
            deletedAt: element.deleted_at,
            isDelete: element.is_delete,
            comId: element.com_id,
            isCom: element.is_com,
            createdBy: element.created_by,
            isSample: element.is_sample
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.getJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await HR_GetJobs.findOneAndUpdate({ id }, {
            canId: element.can_id,
            resiredSalary: element.resired_salary,
            salary: element.salary,
            interviewTime: element.interview_time,
            empInterview: element.ep_interview,
            note: element.note,
            email: element.uv_email,
            contentSend: element.contentsend,
            isSwitch: element.is_switch,
            isDelete: element.is_delete,
            deletedAt: element.deleted_at,
            createdAt: element.created_at
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
// // provisionCompany
// exports.stageRecruitment = async (req, res, next) => {
//     try {
//         let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_provisions_of_company?page=1');
//         for (let i = 0; i < data.length; i++) {
//             let id = Number(data[i].id);
//             let description = data[i].description;
//             let isDelete = data[i].is_delete;
//             let name = data[i].name;
//             let timeStart = data[i].time_start;
//             let supervisorName = data[i].supervisor_name;
//             let comId = data[i].com_id;
//             let file = data[i].file;
//             let createdAt = data[i].created_at;
//             let deletedAt = data[i].deleted_at;
//             // const check_id = await HR_Cancel.findById(_id);
//             // if (!check_id || check_id.length === 0) {
//             let data_recruitment = new HR_StageRecruitments({ id, recruitmentId, name, positionAssumed, target, complete_time, description, isDelete });
//             await HR_StageRecruitments.create(data_recruitment);
//             // }
//         }
//         return functions.success(res, "Thành công");
//     } catch (error) {
//         return functions.setError(res, error.message);
//     }
// };


exports.toolSalary = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;

        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://tinhluong.timviec365.vn/api_web/list_luong.php`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {

                    await Salarys.create({
                        id: data[i].sb_id,
                        sb_id_user: data[i].sb_id_user,
                        sb_id_com: data[i].sb_id_com,
                        sb_salary_basic: data[i].sb_salary_basic,
                        sb_salary_bh: data[i].sb_salary_bh,
                        sb_pc_bh: data[i].sb_pc_bh,
                        sb_time_up: data[i].sb_time_up,
                        sb_location: data[i].sb_location,
                        sb_lydo: data[i].sb_lydo,
                        sb_quyetdinh: data[i].sb_quyetdinh,
                        sb_first: data[i].sb_first,
                        sb_time_created: data[i].sb_time_created,
                    });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.appoint = async (req, res, next) => {
    try {
        const element = req.body;
        let id = element.id;
        await Appoint.findOneAndUpdate({ id }, {
            id: element.id,
            ep_id: element.ep_id,
            current_position: element.old_position_id,
            current_dep_id: element.old_dep_id,
            created_at: new Date(element.created_at * 1000),
            decision_id: element.decision_id,
            note: element.note,
        });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.quitJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = element.id;
        await QuitJob.findOneAndUpdate({ id }, {
            id: element.id,
            ep_id: element.ep_id,
            created_at: new Date(element.created_at * 1000),
            note: element.note,
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};


exports.transferJob = async (req, res, next) => {
    try {
        const element = req.body;
        let id = element.id;

        await TranferJob.findOneAndUpdate({ id }, {
            _id: element.id,
            ep_id: element.ep_id,
            com_id: element.com_id,
            dep_id: element.dep_id,
            position_id: element.position_id,
            decision_id: element.decision_id,
            created_at: new Date(element.created_at * 1000),
            decision_id: element.decision_id,
            note: element.note,
            mission: element.mission,
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolResign = async (req, res, next) => {
    try {
        const element = req.body;
        let id = element.id;

        await Resign.findOneAndUpdate({ id }, {
            id: element.id,
            ep_id: element.ep_id,
            com_id: element.com_id,
            decision_id: element.decision_id,
            created_at: new Date(element.created_at * 1000),
            decision_id: element.decision_id,
            note: element.note,
            shift_id: element.shift_id,
            type: element.type,
        }, { upsert: true, new: true });

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

// failJob
exports.perUser = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        let userId = req.body.user_id;
        let perId = req.body.per_id;
        let barId = req.body.bar_id;
        
        await permisionuser.findOneAndUpdate({ id },{
            id,
            userId,
            perId,
            barId,
        }, { upsert: true, new: true });
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};