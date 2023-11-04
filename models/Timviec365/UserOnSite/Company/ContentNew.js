const mongoose = require("mongoose");
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const ContentNewSchema = new mongoose.Schema({
    new_id: {
        type: Number,
        default: 0
    },
    new_description: {
        type: [String],
        default: []
    }
}, {
    collection: 'ContentNews',
    versionKey: false
});

module.exports = connection.model("ContentNew", ContentNewSchema);