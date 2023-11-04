const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PriceListSchema = new mongoose.Schema({
    _id: {
        //id bảng giá
        type: Number,
        required: true
    },
    time: {
        //thời gian bảng giá hiệu lực
        type: String,
        default: null
    },
    unitPrice: {
        //đơn giá
        type: String,
        default: null
    },
    discount: {
        //chiết khấu
        type: Number,
        default: 0
    },
    intoMoney: {
        //thành tiền
        type: String,
        default: null
    },
    vat: {
        //thuế vat
        type: Number,
        default: 0
    },
    intoMoneyVat: {
        //thành tiền sau khi + vat
        type: String,
        default: null
    },
    type: {
        //loại ghim tin, 1:Ghim tin nổi bật, 2: đẩy tin, 3:Ghimtin hấp dẫn, 4:Ghim tin thương hiệu, 5:Ghim tin danh muc
        type: Number,
        default: 0
    },
    cardGift: {
        //quà tặng thẻ cào
        type: String,
        default: null
    },
    newNumber: {
        //số tin 
        type: Number,
        default: 0
    }

}, {
    collection: 'RN365_PriceList',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_PriceList", PriceListSchema);