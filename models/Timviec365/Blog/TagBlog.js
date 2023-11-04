const mongoose = require('mongoose');
const TagBlogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tag_key: {
        // ID của admin đăng bài
        type: String,
        default: null
    },
    tag_url: {
        type: String,
        default: null
    },
    tag_count: {
        type: String,
        default: 0
    }
}, {
    collection: 'TagBlog',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("TagBlog", TagBlogSchema);