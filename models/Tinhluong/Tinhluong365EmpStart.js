const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const Tinhluong365EmpStartSchema = new Schema({
    st_id: {
        type: Number,
        default: 0
    },
    st_ep_id: {
        type: Number,
        default: 0
    },
    st_time: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    st_create: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    st_bank: {
        type: String,
        default: ""
    },
    st_stk: {
        type: String,
        default: ""
    }
}, {
    collection: 'Tinhluong365EmpStart',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
Tinhluong365EmpStartSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'Tinhluong365EmpStartSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("Tinhluong365EmpStartday", Tinhluong365EmpStartSchema);