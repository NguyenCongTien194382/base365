const mongoose = require('mongoose');
const Tv365NotificationSchema = new mongoose.Schema({
    not_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    usc_id: {
        type: Number,
        default: 0
    },
    use_id: {
        type: Number,
        default: 0
    },
    new_id: {
        type: Number,
        default: 0
    },
    not_time: {
        type: Number,
        default: 0
    },
    not_active: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365Notification',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365Notification", Tv365NotificationSchema);