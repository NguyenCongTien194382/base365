const mongoose = require('mongoose');
const Schema = mongoose.Schema
const BiddingSchema = new mongoose.Schema({
    _id: {
        //id đấu thầu
        type: Number,
        required: true,
    },
    newId: {
        //id tim mua
        type: Number,
        default: 0
    },
    userID:{
        type:Number,
        require:true
    },
    userName: {
        //tên người dự thầu
        type: String,
        default: null
    },
    userIntro: {
        //giới thiệu người tham gia đấu thầu
        type: String,
        default: null
    },
    userFile: {
        //tệp giới thiệu người tham gia đấu thầu
        type: String,
        default: null
    },
    userProfile: {
        //hồ sơ năng lực của công ty
        type: String,
        default: null
    },
    userProfileFile: {
        //tệp hồ sơ năng lực của công ty
        type: String,
        default: null
    },
    productName: {
        //tên sản phẩm
        type: String,
        default: null
    },
    productDesc: {
        //mô tả sản phẩm
        type: String,
        default: null
    },
    productLink: {
        //link sản phẩm
        type: String,
        default: null
    },
    price: {
        //giá dự thầu
        type: Number,
        default: 0
    },
    priceUnit: {
        //đơn vị giá dự thầu
        type: String,
        default: 0
    },
    promotion: {
        //khuyến mãi kèm theo
        type: String,
        default: null
    },
    promotionFile: {
        //tệp khuyến mãi kèm theo
        type: String,
        default: null
    },
    status: {
        //0: đang dự thầu, 1: trúng thầu, 2: trượt thầu
        type: Number,
        default: 0
    },
    createTime: {
        //thời gian tạo
        type: Date,
        default: new Date()
    },
    note: {
        //các nội dung cần sửa đổi và các nội dung liên quan
        type: String,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    }
}, {
    collection: 'RN365_Bidding',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Bidding", BiddingSchema);