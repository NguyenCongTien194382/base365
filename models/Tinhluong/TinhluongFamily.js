const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongFamilySchema = new Schema({
    fa_id: {
        type: Number,
        default: 0
    },
    fa_id_user: {
        type: Number,
        default: 0
    },
    fa_name: {
        type: String,
        default: ""
    },
    fa_birthday: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    fa_phone: {
        type: String,
        default: ""
    },
    fa_relation: {
        type: String,
        default: ""
    },
    fa_job: {
        type: String,
        default: ""
    },
    fa_address: {
        type: String,
        default: ""
    },
    fa_status: {
        type: String,
        default: ""
    },
    fa_active: {
        type: String,
        default: ""
    },
    fa_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    }
}, {
    collection: 'TinhluongFamily',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongFamilySchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongFamilySchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongFamily", TinhluongFamilySchema);