const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const Tinhluong365SalaryBasicSchema = new Schema({
    sb_id: {
        type: Number,
        default: 0
    },
    sb_id_user: {
        type: Number,
        default: 0
    },
    sb_id_com: {
        type: Number,
        default: 0
    },
    sb_salary_basic: {
        type: Number,
        default: 0
    },
    sb_salary_bh: {
        type: Number,
        default: 0
    },
    sb_pc_bh: {
        type: Number,
        default: 0
    },
    sb_time_up: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    sb_location: {
        type: Number,
        default: 0
    },
    sb_lydo: {
        type: String,
        default: ""
    },
    sb_quyetdinh: {
        type: String,
        default: ""
    },
    sb_first: {
        type: Number,
        default: 0
    },
    sb_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'Tinhluong365SalaryBasic',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
Tinhluong365SalaryBasicSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'Tinhluong365SalaryBasicSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("Tinhluong365SalaryBasic", Tinhluong365SalaryBasicSchema);