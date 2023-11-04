const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongThietLapSchema = new Schema({
    tl_id: {
        type: Number,
        require: true
    },
    tl_id_com: {
        type: Number,
        require: true
    },
    tl_id_rose: {
        type: Number,
        default: 0
    },
    tl_name: {
        type: String,
        default: ""
    },
    tl_money_min: {
        type: Number,
        default: 0
    },
    tl_money_max: {
        type: Number,
        default: 0
    },
    tl_phan_tram: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    tl_chiphi: {
        type: Number,
        default: 0
    },
    tl_hoahong: {
        type: Number,
        default: 0
    },
    tl_kpi_yes: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    tl_kpi_no: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    tl_time_created: {
        type: String,
        default: new Date()
    },
}, {
    collection: 'TinhluongThietLap',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongThietLapSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongThietLapId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});

module.exports = connection.model("TinhluongThietLap", TinhluongThietLapSchema);