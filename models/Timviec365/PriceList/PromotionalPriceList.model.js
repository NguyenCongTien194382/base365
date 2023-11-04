const mongoose = require("mongoose");
const PromotionalPriceListSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: String,
    avatar: String,
    thoiHan: Date,
    content: String,
    hot: Number
}, {
    collection: 'PromotionalPriceList',
    versionKey: false,

})

module.exports = mongoose.model('PromotionalPriceList', PromotionalPriceListSchema)