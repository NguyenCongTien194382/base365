const functions = require("../../../services/functions");
const {saveHistory, userExists} = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const NewTV365 = require("../../../models/Timviec365/UserOnSite/Company/New");

// Điểm đánh giá nội dung tin tuyển dụng
const handleEvaluateContentNew = async (userId) =>{
    try{
        let checkUser = await userExists(userId, 1);
        if (checkUser) {
            let listNew = await NewTV365.find({
                new_user_id: userId
            })
            if (listNew.length >= 2) {
                let number = 0;
                for(let i = 0; i < listNew.length; i++){
                    let mota = listNew[i].new_mota.length;
                    let quyenloi = listNew[i].new_quyenloi.length;
                    let yeucau = listNew[i].new_yeucau.length;
                    if ((mota + quyenloi + yeucau) > 1000) {
                        number += 1;
                    }
                };
                let check = number / listNew.length;
                let point_content = 0;
                if (check >= 0.6) {
                    point_content = 5;
                }
                let percent_content_new = check * 100;
                let history = await ManagePointHistory.findOne({userId: userId, type: 1});
                if (history) {
                    history.point_content_new = point_content;
                    history.percent_content_new = percent_content_new;
                } else {
                    history = new ManagePointHistory({
                        userId: userId,
                        type: 1,
                        point_to_change: point_content,
                        point_content_new: point_content,
                        sum: point_content,
                        percent_content_new: percent_content_new
                    });
                }
                await saveHistory(history);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
       }
    } catch(e){
        console.log(e);
        return false;
    }
}
module.exports = async (req,res,next) =>{
    try{
        let {
            userId
        } = req.body;
        if(userId){
            await handleEvaluateContentNew(userId);
            return functions.success(res, "Thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch(error){
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}
