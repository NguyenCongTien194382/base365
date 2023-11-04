const functions = require("../../services/functions");
const Notification = require('../../models/Timviec365/Notification');

exports.list = async(req, res) => {
    try {
        const user = req.user.data;
        const idTimViec365 = Number(user.idTimViec365);
        if (user.type == 1) {
            // const Notification.aggregate([{
            //     $match: {
            //         usc_id: idTimViec365,
            //         not_active: { $in: [0, 1, 9] }
            //     }
            // }]);
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}


exports.deleteNoti = async(req, res) => {
    try {
        res.json({
            data: {
                message: "Xóa thành công",
                result: true
            }
        })
        console.log("deleteNoti", req.body);
        await Notification.deleteOne({
            usc_id: Number(req.user.data.idTimViec365),
            not_id: Number(req.body.not_id)
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}