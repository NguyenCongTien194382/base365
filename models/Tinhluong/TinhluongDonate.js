const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongDonateSchema = new Schema({
    don_id: {
        type: Number,
        default: 0
    },
    don_id_user: {
        type: Number,
        default: 0
    },
    don_name: {
        type: String,
        default: ""
    },
    don_price: {
        type: Number,
        default: 0
    },
    don_time_end: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    don_time_active: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    don_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'TinhluongDonate',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongDonateSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongDonateSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongDonate", TinhluongDonateSchema);