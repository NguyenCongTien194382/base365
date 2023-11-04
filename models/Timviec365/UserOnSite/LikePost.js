const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const LikePostSchema = new mongoose.Schema({
    lk_id: {
        type: Number,
        required: true,
        unique: true
    },
    lk_for_url: {
        type: String,
        default: null
    },
    lk_new_id: {
        // ID tin tuyển dụng
        type: Number,
        default: 0
    },
    lk_type: {
        // 1 là like, 2 là tim, 3 là ngạc nhiên, 4 là cười trái tim, 5 là phẫn nộ, 6 là khóc, 7 là haha, 8 là chia sẻ
        type: Number,
        default: 0
    },
    lk_for_comment: {
        // ID của comment mà được thả cảm xúc
        type: Number,
        default: 0
    },
    lk_user_idchat: {
        type: Number,
        default: 0
    },
    lk_ip: {
        type: String,
        default: null
    },
    lk_time: {
        type: Number,
        default: 0
    },
}, {
    collection: 'LikePost',
    versionKey: false,
    timestamp: true
})

module.exports = connection.model("LikePost", LikePostSchema);