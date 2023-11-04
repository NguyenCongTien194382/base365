const mongoose = require('mongoose');
const TV365SaveSeeUserNewByEmSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: 0,
        },
        //'id người xem',
        userId: {
            type: Number,
            default: 0,
        },
        type: {
            type: Number,
            default: 0,
        } ,
        //'id tin '
        newId: {
            type: Number,
            default: 0,
        },
        //'id người đăng tin',
        hostId: {
            type: Number,
            default: 0,
        },
        // id người đc xem
        id_be_seen: {
            type: Number,
            default: 0,
        },
        type_be_seen: {
            type: Number,
            default: 0,
        },
        start: {
            type: Number,
            default: 0,
        },
        end: {
            type: Number,
            default: 0,
        },
        // thời gian xem
        duration: {
            type: Number,
            default: 0,
        } 
    },
    {
        collection: "TV365SaveSeeUserNewByEm"
    })
module.exports = mongoose.model("TV365SaveSeeUserNewByEm", TV365SaveSeeUserNewByEmSchema);