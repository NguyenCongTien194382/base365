const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");

const handleUsePoint = async(userId, type, usedPoints) => {
        try {
            let check = await userExists(userId, type);
            if (check) {
                const POINT_LIMIT = 20;
                let point = usedPoints / 50;

                let history = await ManagePointHistory.findOne({
                    userId: userId,
                    type: type
                })
                if (history) {
                    let oldPoints = history.point_use_point;
                    history.point_use_point = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                } else {
                    point = point > POINT_LIMIT ? POINT_LIMIT : point;
                    history = new ManagePointHistory({
                        userId: userId,
                        type: type,
                        point_to_change: point,
                        point_use_point: point,
                        sum: point
                    });
                }
                await saveHistory(history);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    // api dùng điểm 
module.exports = async(req, res, next) => {
    try {
        let {
            userId,
            type,
            point,
        } = req.body;
        if (userId && point) {
            await handleUsePoint(userId, type, point);
            return functions.success(res, "Thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}