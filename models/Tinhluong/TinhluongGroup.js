const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongGroupSchema = new Schema({
    gm_id: {
        type: Number,
        default: 0
    },
    gm_id_group: {
        type: Number,
        default: 0
    },
    gm_id_user: {
        type: Number,
        default: 0
    },
    gm_id_com: {
        type: Number,
        default: 0
    },
    gm_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    }
}, {
    collection: 'TinhluongGroup',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongGroupSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongGroupSchemaId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("TinhluongGroup", TinhluongGroupSchema);