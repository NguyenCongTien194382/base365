const mongoose = require('mongoose');
const TV365SaveExchangePointOrderSchema = new mongoose.Schema(
    {
        id:{
            type: Number,
            default: 0,
        },
        userId:{
            type: Number,
            default: 0,
        },
        userType:{
            type: Number,
            default: 0,
        },
        // 'id đơn hàng khi cộng điểm',
        order_id:{
            type: Number,
            default: 0,
        },
        // 'điểm cộng khi mua hàng hoặc điểm đã đổi',
        point:{
            type: Number,
            default: 0,
        },
        // '0: điểm cộng, 1: điểm trừ',
        unit_point:{
            type: Number,
            default: 0,
        },
        // '0: chưa dùng tiền mua hàng, 1: đã dùng mua hàng',
        is_used:{
            type: Number,
            default: 0,
        },
        type_point: {
            type: Number,
            default: 0,
        },
        time:{
            type: Number,
            default: 0,
        },
    },
    {
        collection: "TV365SaveExchangePointOrder"
    })
module.exports = mongoose.model("TV365SaveExchangePointOrder", TV365SaveExchangePointOrderSchema);