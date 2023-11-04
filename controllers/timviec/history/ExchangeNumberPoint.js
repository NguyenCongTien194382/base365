const functions = require("../../../services/functions");
const { userExists } = require("./utils");
const { getTotalUsedHistoryPoint, recordCreditsHistory } = require("../credits");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveExchangePoint = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePoint");
const PointCompany = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');

// api đổi điểm thành tiền theo số điểm nhất định
// point_to_change : số điểm còn lại 
// số điểm còn lại này bằng tổng số các đầu điểm nhỏ 


function num(value) {
    if (!value) return 0;
    return Number(value);
}

const recordSaveExchangePoint = async(usc_id, point, money, point_later) => {
    let id = 0;
    let creditExchangeHistory = await SaveExchangePoint.findOne({}).sort({ id: -1 })
    if (creditExchangeHistory) {
        id = creditExchangeHistory.id + 1;
    }
    let doc = await (new SaveExchangePoint({
        id,
        userId: usc_id,
        userType: 1,
        point,
        money,
        point_later,
        is_used: 0,
        time: functions.getTimeNow(),
    })).save()
    return doc
}

const handleHistoryPointUpdate = async(history, newPoints, amount) => {
    let percentage = 1 - (newPoints / history.point_to_change);
    let points = history.point_to_change - newPoints;
    let fields = [
            "point_time_active",
            "point_see",
            "point_use_point",
            "point_share_social_new",
            "point_share_social_url",
            "point_share_social_user",
            "point_vote",
            "point_next_page",
            "point_see_em_apply",
            "point_vip",
            "point_TiaSet",
            "point_comment",
            "point_ntd_comment",
            "point_be_seen_by_em",
            "point_content_new"
        ]
        //Trừ đều điểm của tất cả trường điểm theo % thay đổi
    fields.forEach(field => {
        history[field] -= num(history[field]) * percentage;
    })
    history.point_to_change = newPoints;
    await recordSaveExchangePoint(history.userId, points, amount, newPoints);
    let usedPoints = await getTotalUsedHistoryPoint(history.userId);
    //Trường sum là tổng cả điểm đã dùng và chưa dùng
    history.sum = history.point_to_change + usedPoints;
    await history.save();
    // cập nhật tiền trong ví365 và lưu lại lịch sử
    let existsPointCompany = await PointCompany.findOne({ usc_id: history.userId });
    let updateMoney;
    if (!existsPointCompany) {
        updateMoney = await (new PointCompany({
            usc_id: history.userId,
            money_usc: amount,
        })).save();
    } else {
        updateMoney = await PointCompany.findOneAndUpdate({ usc_id: history.userId }, { $inc: { money_usc: amount } }, { new: true });
    }
    await recordCreditsHistory(
        history.userId,
        1,
        amount,
        null,
        '',
        `Đổi ${functions.formatMoney(String(amount/1000))} điểm từ điểm uy tín`,
        updateMoney.money_usc,
        4
    );
}

const handleExchangeNumberPoints = async(userId, userType, point) => {
    try {
        let checkUser = await userExists(userId, userType);
        if (checkUser) {
            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: userType
            })
            if (history) {
                let money = point * 1000,
                    point_later = history.point_to_change - point;
                if (point_later < 0) return false
                await handleHistoryPointUpdate(history, point_later, money)
                return true
            }
        }
        return false;
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
            point
        } = req.body;
        if (userId && point) {
            let result = await handleExchangeNumberPoints(userId, userType, point);
            if (!result) return functions.setError(res, "Bạn không đủ điểm", 400);
            return functions.success(res, "Thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}