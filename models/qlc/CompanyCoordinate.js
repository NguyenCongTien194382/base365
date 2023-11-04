const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');

const CompanyCoordinateSchema = new Schema({
    cor_id: {
        type: Number,
        require: true
    },
    com_id: {
        type: Number,
        require: true
    },
    cor_location_name: {
        type: String,
        default: ""
    },
    cor_lat: {
        type: Number,
        default: 0
    },
    cor_long: {
        type: Number,
        default: 0
    },
    cor_radius: {
        type: Number,
        default: 1
    },
    cor_create_time: {
        type: Number,
        default: 0
    },
    is_default: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
    qr_logo: {
        type: String,
        default: null
    },
    qr_status: {
        type: Number,
        default: 1
    }
}, {
    collection: 'CC365_CompanyCoordinate',
    versionKey: false,
    timestamp: true
});

CompanyCoordinateSchema.pre('save', async function(next) {
    try {
        let maxId = await connection.model("CC365_CompanyCoordinate", CompanyCoordinateSchema).find({}, { cor_id: 1 }).sort({ cor_id: -1 }).limit(1);
        if (maxId && maxId.length) {
            maxId = maxId[0].cor_id + 1;
            await Counter.findOneAndUpdate({ TableId: 'CC365_CompanyCoordinateId' }, { $set: { Count: maxId } });
            next();
        } else {
            return false;
        }
    } catch (e) {
        return next(e);
    }
});
module.exports = connection.model("CC365_CompanyCoordinate", CompanyCoordinateSchema);