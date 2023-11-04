const mongoose = require('mongoose');
const TV365SaveSeeNewByEmSchema = new mongoose.Schema(
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
        //'tên người xem',
        name:{
            type: String,
            default: null,
        },
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
        url:{
            type: String,
            default: null,
        },
        start: {
            type: Number,
            default: 0,
        } ,
        end: {
            type: Number,
            default: 0,
        } ,
        duration: {
            type: Number,
            default: 0,
        } 
    },
    {
        collection: "TV365SaveSeeNewByEm"
    })
module.exports = mongoose.model("TV365SaveSeeNewByEm", TV365SaveSeeNewByEmSchema);