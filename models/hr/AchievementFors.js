const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementForSchema = new Schema({
    //Id khen thưởng
    id: {
        type: Number,
        unique: true,
        autoIncrement: true
    },
    // Số quyết định khen thưởng
    achievementId: {
        type: String,
        require: true
    },
    // Danh sách được khen thưởng
    listUser: [{
        // Id nhân viên
        userId: {
            type: Number
        },
        // Tên nhân viên
        name: {
            type: String
        }
    }],
    //Nội dung khen thưởng
    content: {
        type: String,
    },
    // Người tạo khen thưởng
    createdBy: {
        type: String,
    },
    // Ngày khen thưởng
    achievementAt: {
        type: Date,
    },
    // Loại thành tích
    achievementType: {
        type: Number,
        default: null
    },
    type: {
        type: Number
    },
    // Tên gọi thành tích
    appellation: {
        type: String
    },
    // Cấp khen thưởng
    achievementLevel: {
        type: String
    },
    // Id công ty có quyết định khen thưởng
    comId: {
        type: Number,
        require: true
    },
    // Id phòng của nhân viên được khen thưởng
    depId: {
        type: Number,
        default:0
    },
    depName: {
        type: String,
        require: true
    },
    // Ngày tạo quyết định
    createdAt: {
        type: Date,
        default: null
    },
    // Ngày xoá quyết định
    updatedAt: {
        type: Date,
        default: null
    }
}, {
    collection: 'HR_AchievementFors',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_AchievementFors", AchievementForSchema);