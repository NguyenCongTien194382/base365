const functions = require("../../../services/functions");
const { saveHistory, userExists, getMaxID } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveNextPage = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveNextPage");
const User = require("../../../models/Users");

const handleCalculatePointNextPage = async(userId, userType, link) => {
    try {
        let checkUser = await userExists(userId, userType);
        if (checkUser) {
            let lastestHistory = await SaveNextPage.findOne({ userId, userType }).sort({ id: -1 });
            if (lastestHistory && lastestHistory.link === link) {
                return false;
            }
            let time = new Date().getTime() / 1000;
            await (new SaveNextPage({
                id: await getMaxID(SaveNextPage),
                userId: userId,
                userType: userType,
                link: link,
                startTime: time,
                endTime: time + 1,
            })).save();
            const POINT_LIMIT = 10;
            let point = 1 / 500;

            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: userType
            })
            if (history) {
                let oldPoints = history.point_next_page;
                history.point_next_page = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                history = new ManagePointHistory({
                    userId: userId,
                    type: userType,
                    point_to_change: point,
                    point_next_page: point,
                    sum: point
                });
            }
            await saveHistory(history);
        } else {
            return false;
        };
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
exports.calculatePointNextPage = async(req, res, next) => {
    try {
        let {
            userId,
            userType,
            link,
        } = req.body;
        if (userId && link) {
            functions.success(res, "Thành công", {
                result: true
            })
            await handleCalculatePointNextPage(userId, userType, link);
            return true;

        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}

// 0 : ứng viên, 1 là nhà tuyển dụng 
const handleUpdateEndTimeNextPage = async(idChat) => {
        let user = await User.findOne({ _id: idChat });
        // console.log("handleUpdateEndTimeNextPage", idChat)
        if (user) {
            let userType = user.type;
            let userId = user.idTimViec365;
            let nextPage = await SaveNextPage.findOne({ userId, userType }).sort({ startTime: -1 });
            if (nextPage) {
                let time = new Date().getTime() / 1000;
                await SaveNextPage.updateOne({ id: nextPage.id }, {
                    $set: {
                        endTime: time - 1
                    }
                })
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // api cập nhật tgian thoát page theo id chat
exports.updateEndTimeNextPage = async(req, res, next) => {
    try {
        let {
            idChat
        } = req.body;

        if (idChat) {
            handleUpdateEndTimeNextPage(idChat);
            return functions.success(res, "Thành công", {
                result: true
            })
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}