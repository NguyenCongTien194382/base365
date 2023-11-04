const mongoose = require('mongoose');
const TV365SaveSeeRequestSchema = new mongoose.Schema(
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
        newId: {
            type: Number,
            default: 0, 
        },
        userIdBeSeen: {
            type: Number,
            default: 0,
        },
        typeIdBeSeen: {
            type: Number,
            default: 0,
        },
        //'tgian xem UV'
        time: {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveSeeRequest"
    })
module.exports = mongoose.model("TV365SaveSeeRequest", TV365SaveSeeRequestSchema);