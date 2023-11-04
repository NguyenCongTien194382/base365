const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    namePer: { type: String, required: true }
}, {
    collection: 'HR_Permisions',
    versionKey: false,
    timestamp: true
});

const PermissionModel = mongoose.model('HR_Permisions', PermissionSchema);

module.exports = PermissionModel;