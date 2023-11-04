const User = require("../../../models/Users");
const {getTotalUsedHistoryPoint} = require("../credits")
const ManagerPointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory")

exports.userExists = async (usc_id, type)=>{
    try {
        let user = await User.findOne({idTimViec365: usc_id, type});
        if (!user) return false;
        return true;
    }
    catch (error) {
       return false;
    }
}

function num(value) {
    if (!value) return 0;
    return Number(value);
}

const maxHistoryID = async () => {
    let id = 0;
    let pointHistory = await ManagerPointHistory.findOne().sort({id: -1});
    if (pointHistory) id = num(pointHistory.id) + 1;
    return id;
}

exports.saveHistory = async (history) => {
    try {
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
            "point_content_new",
            "point_vote_candidate",
            "point_see_new_uv",
            "point_evaluate_cv",
            "point_chat_uv",
            "point_ntd_evaluate",
            "point_ntd_seen",
            "point_seen_new_ntd",
        ]
        let pointToChange = 0;
        fields.forEach(field => {
            pointToChange += history[field]?history[field]:0;
        })
        history.point_to_change = pointToChange;
        let usedPoints = await getTotalUsedHistoryPoint(history.userId);
        //Trường sum là tổng cả điểm đã dùng và chưa dùng
        history.sum = history.point_to_change + usedPoints;
        if (!history.id) history.id = await maxHistoryID();
        return await history.save()
    } catch (error) {
        return false;
    }
}

exports.getMaxID = async (model) => {
    let id = 0;
    let data = await model.findOne().sort({id: -1});
    if (data) id = num(data.id) + 1;
    return id;
}