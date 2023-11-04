const functions = require("../../../services/functions");
const User = require("../../../models/Users");

module.exports = async (req,res,next) =>{
    try{
        let {
            IdTimviec,
            IdChat,
        } = req.body;
        if(IdTimviec && IdChat){
            await User.updateOne(
            {
                idTimViec365: IdTimviec
            },
            {
                $set: {
                    chat365_id: IdChat
                }
            })
            return functions.success(res, "Thành công", {
                result: true
            });
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}