const mongoose = require('mongoose');
const HR_CitySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        //ten
        type: String,
        default: null,
    },
    order: {
        //do uu tien
        type: Number,
        default: 0,
    },
    type: {
        //khu vuc vung(mien bac/trung/nam)
        type: Number,
        default: 0,
    },
    count: {
        //chua ro
        type: Number,
        default: 0,
    },
    parentId: {
        //quan huyen cua city
        type: Number,
        default: 0,
    },

}, {
    collection: 'HR_Citys',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_Citys", HR_CitySchema);