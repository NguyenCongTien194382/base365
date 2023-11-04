const mongoose = require('mongoose');
const TV365SaveExchangePointBuySchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
        type: {
            type: Number,
            default: 0,
        },
        point: {
            type: Number,
            default: 0,
        },
        //'ngày hết hạn điểm',
        expiry_date: {
            type: Number,
            default: 0,
        },
        time: {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveExchangePointBuy"
    })
module.exports = mongoose.model("TV365SaveExchangePointBuy", TV365SaveExchangePointBuySchema);