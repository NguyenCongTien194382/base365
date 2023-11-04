const mongoose = require('mongoose');
const AdminUserLanguageSchema = new mongoose.Schema({
    aul_admin_id: {
        type: Number,
    },
    aul_lang_id: {
        type: Number,
    }
}, {
    collection: 'Tv365AdminUserLanguage',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminUserLanguage", AdminUserLanguageSchema);