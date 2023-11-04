const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongPhatMuonSchema = new Schema({
    pm_id: {
        type: Number,
        require: true
    },
    pm_id_com: {
        type: Number,
        require: true
    },
    pm_shift: {
        type: Number,
        require: true
    },
    pm_type: {
        type: Number,
        require: true
    },
    pm_minute: {
        type: Number,
        require: true
    },
    pm_type_phat: {
        type: Number,
        require: true
    },
    pm_time_begin: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    pm_time_end: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    pm_monney: {
        type: Number,
        require: true
    },
    pm_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    }
}, {
    collection: 'TinhluongPhatMuon',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongPhatMuonSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongPhatMuonId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongPhatMuon", TinhluongPhatMuonSchema);