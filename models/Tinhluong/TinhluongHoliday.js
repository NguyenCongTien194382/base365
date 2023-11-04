const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongHolidaySchema = new Schema({
    ho_id: {
        type: Number,
        require: true
    },
    ho_id_lho: {
        type: Number,
        require: true
    },
    ho_id_user: {
        type: String,
        default: ""
    },
    ho_id_group: {
        type: String,
        default: ""
    },
    ho_id_com: {
        type: String,
        default: ""
    },
    ho_id_thuong_phat: {
        type: String,
        default: ""
    },
    ho_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'TinhluongHoliday',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongHolidaySchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongHolidayId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});

module.exports = connection.model("TinhluongHoliday", TinhluongHolidaySchema);