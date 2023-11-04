const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AdminUserRightchema = new mongoose.Schema({
    _id: {
        //id admin
        type: Number,
        require: true
    },
    adminId: {
        //id cua admin
        type: Number,
        require: true
    },
    moduleId: {
        //id cua module tac dong den
        type: Number,
        require: true
    },
    add: {
        //quyen them moi,(1: co quyen)
        type: Number,
    },
    edit: {
        //quyen edit
        type: Number,
    },
    delete: {
        //quyen xoa
        type: Number,
    }
}, {
    collection: 'RN365_AdminUserRight',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_AdminUserRight", AdminUserRightchema);