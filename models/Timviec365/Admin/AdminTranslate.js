const mongoose = require('mongoose');
const AdminTranslateSchema = new mongoose.Schema({
    tra_keyword: {
        type: String,
    },
    tra_text: {
        type: String,
    },
    lang_id: {
        type: Number,
    },
    tra_source: {
        type: String,
    },
}, {
    collection: 'Tv365AdminTranslate',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminTranslate", AdminTranslateSchema);