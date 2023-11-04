const functions = require("../../../services/functions");
const { saveHistory, userExists, getMaxID } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveShareSocialNew = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialNew");
const NewTV365 = require("../../../models/Timviec365/UserOnSite/Company/New");

const handleCalculatePointShareNew = async(userId, userType, newId, socialName, linkPage) => {
    try {
        let checkUser = await userExists(userId, userType),
            checkNew = await NewTV365.findOne({ new_id: newId });

        if (checkUser && ((newId > 0 && checkNew) || newId == 0)) {
            let time = functions.getTimeNow();
            await (new SaveShareSocialNew({
                id: await getMaxID(SaveShareSocialNew),
                userId: userId,
                userType: userType,
                newId: newId,
                linkPage: linkPage,
                socialName: socialName,
                time: time,
            })).save();

            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: userType
            })
            const POINT_LIMIT = 20;
            const point = 1 / 10;
            if (history) {
                if (newId == 0) {
                    let oldPoints = history.point_share_social_url;
                    history.point_share_social_url = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                } else {
                    let oldPoints = history.point_share_social_new;
                    history.point_share_social_new = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                }
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                if (newId == 0) {
                    history = new ManagePointHistory({
                        userId: userId,
                        type: userType,
                        point_to_change: point,
                        point_share_social_url: point,
                        sum: point
                    });
                } else {
                    history = new ManagePointHistory({
                        userId: userId,
                        type: userType,
                        point_to_change: point,
                        point_share_social_new: point,
                        sum: point
                    });
                }
            }
            await saveHistory(history);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
let AntiSpamShareNew = [];
const handleAntiSpamNew = (ip) => {
    try {
        let obj = AntiSpamShareNew.find((e) => e.ip == ip) || null;
        if (obj) {
            if ((new Date().getTime() / 1000 - obj.time) < 16) {
                AntiSpamShareNew = AntiSpamShareNew.filter((e) => e.ip != ip);
                AntiSpamShareNew.push({
                    ip: ip,
                    time: new Date().getTime() / 1000
                })
                return false;
            } else {
                AntiSpamShareNew = AntiSpamShareNew.filter((e) => e.ip != ip);
                AntiSpamShareNew.push({
                    ip: ip,
                    time: new Date().getTime() / 1000
                })
                return true;
            }
        } else {
            AntiSpamShareNew.push({
                ip: ip,
                time: new Date()
            })
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
module.exports = async(req, res, next) => {
    try {
        let {
            userId,
            userType,
            newId,
            socialName,
            linkPage,
        } = req.body;
        if (userId && socialName && linkPage) {
            let check = handleAntiSpamNew(userId);
            if (!check) {
                return functions.setError(res, "Spam detected!", 400);
            } else {
                handleCalculatePointShareNew(userId, userType, newId, socialName, linkPage);
                return functions.success(res, "Thành công", {
                    result: true
                })
            }
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}