//chiến dịch
const mongoose = require("mongoose");
const PointListSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    user_type: {
        type: Number,
        default: 0,
    },
    cd_diem: {
        type: Number,
        default: 0,
    },
}, {
    collection: "PointList",
    versionKey: false,
    timestamp: true,
});

module.exports = mongoose.model("PointList", PointListSchema);