const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");

const handleExchangePointHistory = async(userId, type) => {
    try {
        let check = await userExists(userId, type);
        if (check) {
            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: type
            })
            if (history) {
                history.point_time_active = 0;
                history.point_vote = 0;
                history.point_see = 0;
                history.point_use_point = 0;
                history.point_share_social_new = 0;
                history.point_share_social_user = 0;
                history.point_next_page = 0;
                await saveHistory(history);
            }
        }
    } catch (e) {}
}
module.exports = async(req, res, next) => {
    try {
        // cập nhật tất cả các thông số điểm về 0 ngoại trừ sum trong bảng manage_point_history
        // xóa hết dữ liệu xem ở bài toán 2 của user đó 
        let {
            userId,
            type,
        } = req.body;
        await handleExchangePointHistory(userId, type);
        return functions.success(res, "Thành công", {
            result: true
        });

    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}