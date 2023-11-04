const mongoose = require('mongoose');
const TV365SaveNextPageSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
        userType: {
            type: Number,
            default: 0,
        },
        link: {
            type: String,
            default: null,
        },
        startTime: {
            type: Number,
            default: 0,
        },
        endTime: {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveNextPage"
    })
module.exports = mongoose.model("TV365SaveNextPage", TV365SaveNextPageSchema);