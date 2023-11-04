const mongoose = require('mongoose');
const TV365SaveShareSocialUserSchema = new mongoose.Schema(
    {
        id:  {
            type: Number,
            default: 0,
        },
        userId:  {
            type: Number,
            default: 0,
        },
        userType:  {
            type: Number,
            default: 0,
        },
        //'id user đc share',
        userIdBeShare:  {
            type: Number,
            default: 0,
        },
        //'type user đc share',
        typeIdBeShare:  {
            type: Number,
            default: 0,
        },
        //'tên  MXH(chat365, facebook, twitter, vkontakte, linkedin)',
        socialName:{
            type: String,
            default: null,
        },
        time:  {
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveShareSocialUser"
    })
module.exports = mongoose.model("TV365SaveShareSocialUser", TV365SaveShareSocialUserSchema);