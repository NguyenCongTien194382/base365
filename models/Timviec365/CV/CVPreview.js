const mongoose = require('mongoose');
const CVPreviewSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    lang: {
        type: String
    },
    html: {
        type: String
    },
    name_img: {
        type: String
    },
    time_update: {
        type: Number
    }
}, {
    collection: 'CVPreview',
    versionKey: false
});
module.exports = mongoose.model("CVPreview", CVPreviewSchema);