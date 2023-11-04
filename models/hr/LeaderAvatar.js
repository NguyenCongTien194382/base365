const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaderAvatarSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // Id nhân viên
    ep_id: {
        type: Number,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
}, {
    collection: 'HR_LeaderAvatars',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_LeaderAvatars", LeaderAvatarSchema);