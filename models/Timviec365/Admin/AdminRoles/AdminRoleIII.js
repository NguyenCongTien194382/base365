const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const roleIIISchema = new mongoose.Schema({
    _id: {
        type: Number,
        // required: true,
        // unique: true,
    },
    name: {
        type: String,
        required: true,
        // unique: true,
    },
    order: {
        type: Number,
        // unique: true,
        default: 0,
    },
    path: { type: String, required: true, default: '' },
    parent_id: {
        type: Number,
        ref: 'RoleII',
        required: true,
    }
}, {
    collection: 'TV365AdminRoleIII',
    versionKey: false,
    timestamps: true,
    // autoCreate: false,
});

module.exports = mongoose.model('TV365AdminRoleIII', roleIIISchema);