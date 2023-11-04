const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongPhatCaSchema = new Schema({
    pc_id: {
        type: Number,
        default: 0
    },
    pc_money: {
        type: Number,
        default: 0
    },
    pc_time: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    pc_shift: {
        type: Number,
        default: 0
    },
    pc_com: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    pc_type: {
        type: Number,
        default: 0
    },
}, {
    collection: 'TinhluongPhatCa',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongPhatCaSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongPhatCaSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongPhatCa", TinhluongPhatCaSchema);