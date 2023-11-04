const mongoose = require('mongoose');
const Cv365CustomHtmlSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    html: {
        type: String
    },
    sort: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'Cv365CustomHtml',
    versionKey: false
});

module.exports = mongoose.model("Cv365CustomHtml", Cv365CustomHtmlSchema)