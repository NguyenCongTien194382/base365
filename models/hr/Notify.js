const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    // id
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // id ứng viên
    canId: { type: Number, required: true },
    // loại
    type: { type: Number },
    //
    comNotify: { type: Number},
    // id company
    comId: { type: Number },
    // id user
    userId: { type: Number   },
    // ngày tạo
    createdAt: { type: Date, default: Date.now() }
}, {
    collection: 'HR_Notifys',
    versionKey: false,
    timestamp: true
});

const NotificationModel = mongoose.model('HR_Notifys', NotificationSchema);

module.exports = NotificationModel;