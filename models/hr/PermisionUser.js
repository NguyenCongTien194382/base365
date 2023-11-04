const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PermisionUserSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // id user
    userId: {
        type: Number,
        require: true
    },
    // id quyen
    perId: {
        type: Number,
        require: true
    },
    // id module
    barId: {
        type: Number,
        default: true 
    }
},{
    collection: 'HR_PermisionUsers',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_PermisionUsers",PermisionUserSchema);
