const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


const roleIISchema = new mongoose.Schema({
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
    parent_id: {
        type: Number,
        ref: 'RoleI',
        required: true,
    }
}, {
    collection: 'TV365AdminRoleII',
    versionKey: false,
    timestamps: true,
    // autoCreate: false,
});


module.exports = mongoose.model('TV365AdminRoleII', roleIISchema);