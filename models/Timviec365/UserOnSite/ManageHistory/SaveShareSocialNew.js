const mongoose = require('mongoose');
const TV365SaveShareSocialNewSchema = new mongoose.Schema(
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
        //'id tin(0: các url khác)',
        newId: {
            type: Number,
            default: 0,
        },
        //'link đc chia sẻ',
        linkPage:{
            type: String,
            default: null,
        },
        //'tên  MXH(chat365, facebook, twitter, vkontakte, linkedin)',
        socialName:{
            type: String,
            default: null,
        },
        time: {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveShareSocialNew"
    })
module.exports = mongoose.model("TV365SaveShareSocialNew", TV365SaveShareSocialNewSchema);