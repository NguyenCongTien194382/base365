const functions = require("../../../services/functions");
const { saveHistory, getMaxID } = require("./utils");
const User = require("../../../models/Users");
const HistoryLogin = require("../../../models/Timviec365/UserOnSite/ManageHistory/HistoryLogin");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
// api bài toán 1 
exports.calculateBaseTimeOnline = async(req, res) => {
    try {
        functions.success(res, "Thành công");
        let { idChat } = req.body;
        if (!idChat) return false
            //functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        const user = await User.findOne({ _id: idChat }).lean();
        if (!user) return false
            //functions.setError(res, "Không tìm thấy tài khoản", 404);
        let type = user.type,
            point = 0,
            startActive = 0;
        const lastActive = new Date().getTime() / 1000, // tgian hiện tại
            lastTimestamp = new Date().getTime() / 1000 - 12 * 3600; // tgian hiện tại trừ đi 12 tiếng
        let loginHistory = await HistoryLogin.findOne({ userId: user.idTimViec365, type: user.type }).sort({ id: -1 });
        // Tồn tại bản ghi vào site và chưa cập nhật tgian thoát site
        if (loginHistory && loginHistory.timeLogout == 0) {
            startActive = loginHistory.timeLogin;
            await HistoryLogin.updateOne({ id: loginHistory.id }, {
                $set: {
                    timeLogout: lastActive
                }
            })
        }
        // Không tồn tại bản ghi vào site hoặc có tồn tại nhưng đã thoát site
        else {
            // Lấy tgian bắt đầu vào site(tgian cập nhật gần nhất hoặc tgian login)
            startActive = user.updatedAt ? user.updatedAt : user.time_login;
            if (startActive !== 0 && startActive > lastTimestamp) {
                await (new HistoryLogin({
                    id: await getMaxID(HistoryLogin),
                    timeLogin: startActive,
                    timeLogout: lastActive,
                    type: type,
                    userId: user.idTimViec365,
                })).save();
            } else {
                // cập nhật lại thời gian hoạt động dưới base tìm việc cho đúng 
                let updatedTime = new Date().getTime() / 1000 - 60; // Lấy tgian hiện tại trừ 1p
                await User.updateOne({ idTimViec365: user.idTimViec365 }, {
                    $set: {
                        updatedAt: updatedTime
                    }
                })
            }
        }
        point = (lastActive - startActive) / 3600;
        let POINT_LIMIT = 10;
        let history = await ManagePointHistory.findOne({ userId: user.idTimViec365, type });
        if (history) {
            let oldPoints = history.point_time_active,
                pointToChange = history.point_to_change,
                pointSum = history.sum,
                pointAdd = 0,
                newPoint = oldPoints + point;
            if (newPoint > POINT_LIMIT) {
                pointAdd = POINT_LIMIT - oldPoints;
                if (pointAdd < 0) {
                    pointAdd = 0;
                }
                newPoint = POINT_LIMIT;
            } else {
                pointAdd = point;
            }
            history.point_time_active = newPoint;
            history.point_to_change = pointToChange + pointAdd;
            history.sum = pointSum + pointAdd;
        } else {
            point = point > POINT_LIMIT ? POINT_LIMIT : point;
            history = new ManagePointHistory({
                userId: user.idTimViec365,
                type: user.type,
                point_to_change: point,
                point_time_active: point,
                sum: point
            });
        }
        await saveHistory(history);
        return true;
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}

exports.handleHistoryLogin = async(req, res) => {
    try {
        let {
            userType,
            userId,
        } = req.body;
        functions.success(res, "Thành công");
        let latestHistoryLogin = await HistoryLogin.findOne({ userId: userId, type: userType }).sort({ id: -1 });
        if (!latestHistoryLogin || (latestHistoryLogin && latestHistoryLogin.timeLogout > 0)) {
            let now = functions.getTimeNow();
            setTimeout(() => {
                getMaxID(HistoryLogin).then(id => {
                    new HistoryLogin({
                        id: id,
                        userId: userId,
                        type: userType,
                        timeLogin: now,
                        timeLogout: 0
                    }).save().then(() => {
                        const doSomething = () => {};
                        doSomething();
                    })
                })
            }, 2000)
        }
        return true
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}