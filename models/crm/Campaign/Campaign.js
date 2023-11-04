//Bảnh mô tả chiến dịch
const mongoose = require('mongoose')

const Campaign = new mongoose.Schema({
    _id : {
        type : Number,
        require : true
    },
    groupID : {
        type : Number,
    },
    nameCampaign : {
        type : String,
    },
    typeCampaign : {
        type : Number,
    },
    timeStart : {
        type : Number,
    },
    timeEnd : {
        type : Number,
    },
    money : {
        type : Number,
    },
    expectedSales : { // dự kiến bán hàng 
        type : Number,
    },
    chanelCampaign : {// kênh bán 
        type : Number,
    },
    investment : {
        type : Number,
    },
    empID : {
        type : Number,
    },
    description : {
        type : String,
    },
    shareAll : {
        type : Number,
    },
    companyID : {
        type : Number,
    },
    countEmail : {
        type : Number,
    },
    status : {
        type : Number,
    },
    type : {
        type : Number,
    },
    userIdCreate : {
        type : Number,
    },
    userIdUpdate : {
        type : Number,
    },
    site : {
        type : Number,
    },
    isDelete : {
        type : Number,
        default : 0,
    },

    hidden_null : {//chưa rõ
        type : Number,
    },
    createdAt : {
        type : Number,
    },
    updatedAt : {
        type : Number,
    },

})
module.exports = mongoose.model("Campaign" , Campaign)

