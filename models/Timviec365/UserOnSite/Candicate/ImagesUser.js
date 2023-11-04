// hồ sơ
const mongoose = require('mongoose');
const TV365ImagesUserSchema = new mongoose.Schema({
    img_id: {
        type: Number,
        require: true,
        unique: true,
        autoIncrement: true
    },
    img_user_id: {
        type: Number,
        require: true,
    },
    img: {
        // Tên của file được lưu lại
        type: String,
        default: null
    }
}, {
    collection: 'TV365ImagesUser',
    versionKey: false
});

module.exports = mongoose.model("TV365ImagesUser", TV365ImagesUserSchema);