const mongoose = require('mongoose');
const pointSchema = new mongoose.Schema({
    point_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: false,
        default: 0,
    },
}, {
    collection: 'Tv365Point',
});

module.exports = mongoose.model('Tv365Point', pointSchema);