// danh mục mail365
const mongoose = require('mongoose');
const Mail365CategorySchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    alias: {
        type: String
    },
    // gồm 1.thư mời ứng viên || 2. thư mời hợp tác || 3. thư mời hội họp 
    parent: {
        type: Number
    },
    sort: {
        type: Number
    },
    meta_title: {
        type: String
    },
    meta_key: {
        type: String
    },
    meta_des: {
        type: String
    },
    content: {
        type: String
    },
    status: {
        type: Number
    }

}, {
    collection: 'Mail365Category',
    versionKey: false
});

module.exports = mongoose.model("Mail365Category", Mail365CategorySchema)