const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveExchangePointOrder = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointOrder");

const handleCalculatePointOrder = async(userId, type, point, expiry_date) => {
        try {
            let exists = await userExists(userId, type);
            if (!exists) return false;
            let time = functions.getTimeNow();
            await (new SaveExchangePointOrder({
                userId: userId,
                type: type,
                point: point,
                expiry_date: expiry_date,
                time: time,
            })).save();
            // let checkUserExist = await HandleQuery(`SELECT id,point_use_point,sum FROM  manage_point_history WHERE userId = ${userId} AND type = ${type}`);
            // if(checkUserExist && checkUserExist.length){
            //     let id = checkUserExist[0].id
            //     let poinOrigin = Number(checkUserExist[0].point_use_point);
            //     let pointSumOrigin = Number(checkUserExist[0].sum);
            //     let newPoint = poinOrigin + point/50;
            //     if(newPoint > 20){
            //         newPoint = 20;
            //     }
            //     let newSum;
            //     newSum = pointSumOrigin + point/50;
            //     await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_use_point = ${newPoint}  WHERE id = ${id}`);
            // }
            // else{
            //     let pointInsert = point/50;
            //     let sum = pointInsert;
            //     await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_use_point,sum)
            //     VALUES (${userId}, ${type},${pointInsert},${sum})`);
            // }
        } catch (error) {
            return false;
        }
    }
    // api 
module.exports = async(req, res, next) => {
    try {
        let {
            userId,
            type,
            point,
            expiry_date,
        } = req.body;
        if (!userId || !point) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        await handleCalculatePointOrder(userId, type, point, expiry_date);
        return functions(res, "Thành công", {
            result: true
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}