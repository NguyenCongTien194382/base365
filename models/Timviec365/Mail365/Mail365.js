const mongoose = require('mongoose');
const Mail365Schema = new mongoose.Schema({
    id: {
        type: Number
    },
    title: {
        type: String
    },
    alias: {
        type: String
    },
    image: {
        type: String
    },
    colors: {
        type: String
    },
    cid: {
        type: Number
    },
    html: {
        type: String
    },
    view: {
        type: Number
    },
    love: {
        type: Number
    },
    download: {
        type: Number
    },
    status: {
        type: Number
    }
}, {
    collection: 'Mail365',
    versionKey: false
});

module.exports = mongoose.model('Mail365', Mail365Schema);