const mongoose = require('mongoose');
const UvBadContentSchema = new mongoose.Schema({
    cv_id: {
        type: Number,
        default: 0
    },
    hoso_id: {
        type: Number,
        default: 0
    },
    bad_use_id: {
        type: Number,
        default: 0
    },
    bad_use_link: {
        type: String,
        default: ""
    },
    bad_use_text: {
        type: String,
        default: ""
    },
    createAt: {
        type: Number,
        default: new Date().getTime() / 1000
    }
}, {
    collection: 'UvBadContent',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("UvBadContent", UvBadContentSchema);