const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongListGroupSchema = new Schema({
    lgr_id: {
        type: Number,
        require: true
    },
    lgr_id_com: {
        type: Number,
        require: true
    },
    lgr_name: {
        type: String,
        default: ""
    },
    lgr_note: {
        type: String,
        default: ""
    },
    lgr_time_created: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
}, {
    collection: 'TinhluongListGroup',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongListGroupSchema.pre('save', async function(next) {
    try {
        await Counter.findOneAndUpdate({ TableId: 'TinhluongListGroupId' }, { $inc: { Count: 1 } });
        next();
    } catch (e) {
        return next(e);
    }
});

module.exports = connection.model("TinhluongListGroup", TinhluongListGroupSchema);