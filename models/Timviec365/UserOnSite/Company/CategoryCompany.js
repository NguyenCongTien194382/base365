const mongoose = require('mongoose');
const CategoryCompanySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name_tag: {
        type: String
    },
    city_tag: {
        type: Number
    },
    cate_id: {
        type: Number
    },
    parent_id: {
        type: Number
    },
    level_id: {
        type: Number
    },
    keyword_tag: {
        type: String
    },
    tag_content: {
        type: String
    },
    link_301: {
        type: String
    },
    tag_vlgy: {
        type: String
    },
    tag_ndgy: {
        type: String
    },
    tag_index: {
        type: Number
    }
}, {
    collection: 'CategoryCompany',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryCompany", CategoryCompanySchema);