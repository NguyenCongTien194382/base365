const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongListClassSchema = new Schema({
    cl_id: {
        type: Number,
        default: 0
    },
    cl_name: {
        type: String,
        default: ""
    },
    cl_salary: {
        type: Number,
        default: 0
    },
    cl_day: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    cl_day_end: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    cl_active: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    cl_note: {
        type: String,
        default: ""
    },
    cl_type: {
        type: Number,
        default: 0
    },
    cl_type_tax: {
        type: Number,
        default: 0
    },
    cl_id_form: {
        type: Number,
        default: 0
    },
    cl_com: {
        type: Number,
        default: 0
    },
    cl_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'TinhluongListClass',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongListClassSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongListClassSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongListClass", TinhluongListClassSchema);