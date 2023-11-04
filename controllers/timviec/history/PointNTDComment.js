const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const CommentPost = require("../../../models/Timviec365/UserOnSite/CommentPost")
const User = require("../../../models/Users");

// tính điểm khi NTD bình luận
exports.handleCalculatePointNTDComment = async(userId, userType, chat365_id) => {
    try {
        let user = await User.findOne({ idTimViec365: userId });
        if (user && chat365_id) {
            let commentsCount = await CommentPost.find({ cm_sender_idchat: chat365_id }).count();
            const POINT_LIMIT = 10;
            let point = commentsCount / 2;

            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: 1
            })
            if (history) {
                history.point_ntd_comment = point < POINT_LIMIT ? point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                history = new ManagePointHistory({
                    userId: userId,
                    type: userType,
                    point_to_change: point,
                    point_ntd_comment: point,
                    sum: point
                });
            }
            await saveHistory(history)
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

exports.calculatePointNTDComment = async(req, res, next) => {
    try {
        let {
            userId,
            userType
        } = req.body;
        let user = await User.findOne({ idTimViec365: userId });
        if (user && userId) {
            const chat365_id = user._id
            await this.handleCalculatePointNTDComment(userId, userType, chat365_id);
            return functions.success(res, "Thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}