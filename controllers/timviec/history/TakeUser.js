const functions = require("../../../services/functions");
const User = require("../../../models/Users");

module.exports = async (req,res,next)=>{
    try{
        if(req.params.userId){
            return functions.success(res, "Thành công", {
                data: await User.findOne({idTimViec365: req.params.userId}).select("phoneTK email")
            });
        }
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
    catch(error){
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}