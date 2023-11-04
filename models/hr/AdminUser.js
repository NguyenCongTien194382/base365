const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminUserSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // ten
    userName: {
        type: String,
        require: true
    },
    //mat khau
    password: {
        type: String,
        require: true 
    },
    // loai admin
    type: {
        type: Number,
        default: 0 
    },
    //thoi gian tao tk
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //quyen
    role: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.Schema("HR_AdminUsers",AdminUserSchema);
