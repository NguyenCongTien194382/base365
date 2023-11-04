const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveShareSocialUser = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialUser");

const handleCalculatePointShareUser = async(userId, userType, userIdBeShare, typeIdBeShare, socialName) => {
    try {
        let checkUser = await userExists(userId, userType);
        let checkUserToShare = await userExists(userIdBeShare, typeIdBeShare);
        if (checkUser && checkUserToShare) {
            let time = new Date().getTime() / 1000;
            await (new SaveShareSocialUser({
                userId: userId,
                userType: userType,
                userIdBeShare: userIdBeShare,
                typeIdBeShare: typeIdBeShare,
                socialName: socialName,
                time: time,
            })).save();
            const POINT_LIMIT = 20;
            const point = 1 / 10;
            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: userType
            })
            if (history) {
                let oldPoints = history.point_share_social_user;
                history.point_share_social_user = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                history = new ManagePointHistory({
                    userId: userId,
                    type: userType,
                    point_to_change: point,
                    point_share_social_user: point,
                    sum: point
                });
            }
            await saveHistory(history);
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
let AntiSpamShareUser = [];
const handleAntiSpamUser = (ip) => {
    try {
        let obj = AntiSpamShareUser.find((e) => e.ip == ip) || null;
        if (obj) {
            if ((new Date().getTime() / 1000 - obj.time) < 16) {
                AntiSpamShareUser = AntiSpamShareUser.filter((e) => e.ip != ip);
                AntiSpamShareUser.push({
                    ip: ip,
                    time: new Date().getTime() / 1000
                })
                return false;
            } else {
                AntiSpamShareUser = AntiSpamShareUser.filter((e) => e.ip != ip);
                AntiSpamShareUser.push({
                    ip: ip,
                    time: new Date().getTime() / 1000
                })
                return true;
            }
        } else {
            AntiSpamShareUser.push({
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
            userIdBeShare,
            typeIdBeShare,
            socialName,
        } = req.body;
        if (userId && userIdBeShare && socialName) {

            let check = handleAntiSpamUser(userId);
            if (!check) {
                return functions.setError(res, "Spam detected!", 400);
            } else {
                await handleCalculatePointShareUser(userId, userType, userIdBeShare, typeIdBeShare, socialName);
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