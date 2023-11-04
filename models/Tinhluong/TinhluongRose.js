const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongRoseSchema = new Schema({
    ro_id: {
        type: Number,
        require: true
    },
    ro_id_user: {
        type: Number,
        require: true
    },
    ro_id_group: {
        type: Number,
        default: 0
    },
    ho_id_group: {
        type: Number,
        default: 0
    },
    ro_id_com: {
        type: Number,
        default: 0
    },
    ro_id_lr: {
        type: Number,
        default: 0
    },
    ro_id_tl: {
        type: Number,
        default: 0
    },
    ro_so_luong: {
        type: Number,
        default: 0
    },
    ro_time: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    ro_time_end: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    ro_note: {
        type: String,
        default: ""
    },
    ro_price: {
        type: Number,
        default: 0
    },
    ro_kpi_active: {
        type: Number,
        default: 0
    },
    ro_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'TinhluongRose',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongRoseSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongRoseId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});

module.exports = connection.model("TinhluongRose", TinhluongRoseSchema);