const mongoose = require('mongoose');
const Schema = mongoose.Schema
const TblTagsSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    keyword: {
        
        type: String,
        default: null,
    },
    link: {

        type: String,
        default: null,
    }
}, {
    collection: 'RN365_TblTags',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_TblTags", TblTagsSchema);