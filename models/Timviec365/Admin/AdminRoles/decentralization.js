const mongoose = require('mongoose');

const decentralizationSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true, unique: true },
        roleI: {
            type: Array,
            // unique: true,
        },
        roleII: {
            type: Array,
            // unique: true,
        },
        roleIII: {
            type: Array,
            // unique: true,
        },
    },
    {
        collection: 'TV365Decentralization',
        versionKey: false,
        timestamps: true,
        // autoCreate: false,
    }
);


module.exports = mongoose.model('TV365Decentralization', decentralizationSchema);
