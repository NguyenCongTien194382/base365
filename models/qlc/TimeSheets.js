const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const CC365_TimeSheetSchema = new Schema({
    sheet_id: {
        type: Number,
        require: true
    },
    ep_id: {
        type: Number,
        require: true
    },
    ts_image: {
        type: String,
        default: ""
    },
    at_time: {
        type: Date,
        default: new Date('1970-01-01T00:00:00.000+00:00')
    },
    device: {
        type: String,
        default: ""
    },
    ts_lat: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    ts_long: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    ts_location_name: {
        type: String,
        default: ""
    },
    wifi_name: {
        type: String,
        default: ""
    },
    wifi_ip: {
        type: String,
        default: ""
    },
    wifi_mac: {
        type: String,
        default: ""
    },
    shift_id: {
        type: Number,
        require: true
    },
    ts_com_id: {
        type: Number,
        require: true
    },
    note: {
        type: String,
        default: ""
    },
    bluetooth_address: {
        type: String,
        default: ""
    },
    status: {
        type: Number,
        default: 1
    },
    ts_error: {
        type: String,
        default: ""
    },
    is_success: {
        type: Number,
        default: 0
    }
}, {
    collection: 'CC365_TimeSheet',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
CC365_TimeSheetSchema.pre('save', async function(next) {
    try {
        let maxId = await connection.model("CC365_TimeSheet", CC365_TimeSheetSchema).find({}, { sheet_id: 1 }).sort({ sheet_id: -1 }).limit(1);
        console.log(maxId);
        if (maxId && maxId.length) {
            maxId = maxId[0].sheet_id + 1;
            await Counter.findOneAndUpdate({ TableId: 'CC365_TimeSheetId' }, { $set: { Count: maxId } });
            next();
        } else {
            return false;
        }
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("CC365_TimeSheet", CC365_TimeSheetSchema);