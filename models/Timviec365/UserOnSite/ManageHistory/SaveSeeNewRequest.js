const mongoose = require('mongoose');
const TV365SaveSeeNewRequestSchema = new mongoose.Schema(
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
        //'tgian xem tin'
        time: {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveSeeNewRequest"
    })
module.exports = mongoose.model("TV365SaveSeeNewRequest", TV365SaveSeeNewRequestSchema);  