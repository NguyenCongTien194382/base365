const mongoose = require('mongoose');
const HR_NestDetailSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    type: {
        //0:team 1:group
        type: Number,
        required: true,
    },
    comId: {
        type: Number,
        required: true,
    },
    grId: {
        //id team, group qlc
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
}, {
    collection: 'HR_NestDetails',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_NestDetails", HR_NestDetailSchema);