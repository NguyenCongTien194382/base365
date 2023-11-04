const functions = require("../../../services/functions");
const { saveHistory, userExists, getMaxID } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveSeeNewRequest = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewRequest");
const NewTV365 = require("../../../models/Timviec365/UserOnSite/Company/New");

// api bài toán 2 ứng viên 
// hàm phụ trợ
const handleCalculateSeenNew = async(userId) => {
    try {
        let point = 1 / 20;
        let POINT_LIMIT = 10;
        let history = await ManagePointHistory.findOne({ userId: userId, type: 0 });
        if (history) {
            let oldPoints = history.point_see_new_uv;
            history.point_see_new_uv = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
        } else {
            point = point > POINT_LIMIT ? POINT_LIMIT : point;
            history = new ManagePointHistory({
                userId: userId,
                type: 0,
                point_to_change: point,
                point_see_new_uv: point,
                sum: point
            });
        }
        await saveHistory(history);
        return true;
    } catch (error) {
        return false;
    }

}
const insertSeenNewRequest = async(userId, type, newId) => {
    try {
        let userSeen = await userExists(userId, type);
        let newTV365 = await NewTV365.findOne({ new_id: newId });
        if (userSeen && newTV365) {
            let isDuplicated = await SaveSeeNewRequest.findOne({ userId, type, newId });
            if (!isDuplicated) {
                let now = functions.getTimeNow();
                await (new SaveSeeNewRequest({
                    id: await getMaxID(SaveSeeNewRequest),
                    userId: userId,
                    type: type,
                    newId: newId,
                    time: now,
                })).save();
                if (type == 0) await handleCalculateSeenNew(userId)
            }
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

// api 
module.exports = async(req, res, next) => {
    try {
        let {
            userId,
            type,
            newId
        } = req.body;
        if (!userId || !newId) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        await insertSeenNewRequest(userId, type, newId);
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}