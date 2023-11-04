const mongoose = require('mongoose');
const userSavePostSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    use_id: {
        type: Number,
        required: true
    },
    new_id: {
        type: Number,
        default: 0
    },
    save_time: {
        type: Number,
        default: 0
    }
}, {
    collection: 'UserSavePost',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("UserSavePost", userSavePostSchema);