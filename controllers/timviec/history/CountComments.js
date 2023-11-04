const functions = require("../../../services/functions");
const NewTV365 = require("../../../models/Timviec365/UserOnSite/Company/New");
const CommentPost = require("../../../models/Timviec365/UserOnSite/CommentPost")
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const {saveHistory} = require("./utils");

const handleCountComment = async (IdNew) =>{
    try {
        let newTV365 = await NewTV365.findOne({new_id: IdNew});
        if(newTV365){
            let new_ids = (await NewTV365.find({new_user_id: newTV365.new_user_id}).select("new_id")).map(d => d.new_id);
            let commentsCount = await CommentPost.find({cm_new_id: {$in: new_ids}}).count();
            const POINT_LIMIT = 10;
            let point = commentsCount / 2;

            let history = await ManagePointHistory.findOne({
                userId: newTV365.new_user_id,
                type: 1
            })
            if (history) {
                history.point_comment =  point < POINT_LIMIT ? point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT? POINT_LIMIT: point;
                history = new ManagePointHistory({
                    userId: newTV365.new_user_id,
                    type: 1,
                    point_to_change: point,
                    point_comment: point,
                    sum: point
                });
            }
            await saveHistory(history);
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
module.exports = async (req,res,next) => {
    try{
        let {
            IdNewComment
        } = req.body;
        if(IdNewComment && !isNaN(IdNewComment)) {
             const idNewComment = Number(IdNewComment);
             if (idNewComment) {
                await handleCountComment(idNewComment);
                return functions.success(res, "Thành công");
             } else {
                return functions.success(res, "Thành công");
             }
        }
        else{
            return functions.setError(res, "Đã có lỗi xảy ra", 500);
        }
    }
    catch(error){
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}