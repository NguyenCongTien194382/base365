const mongoose = require('mongoose');
const SalaryLevelSchema = new mongoose.Schema({
    salarylevelid: {
        type: Number,
        required: true,
    },
    Tile: String,
    Order: Number,
    CreateDate: Date,

}, {
    collection: 'Tv365SalaryLevel',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365SalaryLevel", SalaryLevelSchema);