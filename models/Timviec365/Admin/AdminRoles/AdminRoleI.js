const mongoose = require('mongoose');

const roleISchema = new mongoose.Schema({
    _id: {
        type: Number,
        // required: true,
        // unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    order: {
        type: Number,
        // unique: true,
        default: 0,
    },
}, {
    collection: 'TV365AdminRoleI',
    versionKey: false,
    timestamps: true,
    // autoCreate: false,
});


module.exports = mongoose.model('TV365AdminRoleI', roleISchema);