const ManageTracking = require("../../models/Users")
const functions = require("../../services/functions")

//tìm list cấu hình chấm công cty sử dụng 
exports.getlistTracking = async (req,res) =>{
    const  companyID = req.body.companyID
    const  type_timekeeping = req.body.type_timekeeping
// 1: là khuôn mặt, 2: là QR, 3: là chấm công công ty, 4: là chấm công web, 5: là PC365, 6: là giới hạn IP nhân viên, 7 là giới hạn IP công ty; 8: chấm công trên app chat365; 9: chấm công qr app chat
    if (!type_timekeeping) {
        functions.setError(res, "type_keeping not found ");
    } else {
        const list = await ManageTracking.find({companyID:companyID, type_timekeeping: type_timekeeping })
        if (!list) {
            functions.setError(res, "list of manage tracking cannot be found or does not exist");
        } else {
            functions.success(res, "Get list of manage tracking successfully", list);
        }
    }
};

