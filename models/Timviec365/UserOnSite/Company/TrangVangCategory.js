const mongoose = require('mongoose');
const TrangVangCategorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name_cate: {
        type: String
    },
    parent_id: {
        type: Number
    },
    img_cate: {
        type: String
    }
}, {
    collection: 'TrangVangCategory',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("TrangVangCategory", TrangVangCategorySchema);