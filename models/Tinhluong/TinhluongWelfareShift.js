const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongWelfareShiftSchema = new Schema({
    wf_id: {
        type: Number,
        require: true
    },
    wf_money: {
        type: Number,
        require: true
    },
    wf_time: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    wf_time_end: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    wf_shift: {
        type: Number,
        default: 0
    },
    wf_com: {
        type: Number,
        default: 0
    }
}, {
    collection: 'TinhluongWelfareShift',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongWelfareShiftSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongWelfareShiftId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});

module.exports = connection.model("TinhluongWelfareShift", TinhluongWelfareShiftSchema);