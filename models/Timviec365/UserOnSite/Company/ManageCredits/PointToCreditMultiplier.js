const mongoose = require('mongoose');
const PointToCreditMultiplierSchema = new mongoose.Schema(
    {
        multiplier:{
            type: Number,
            required: true,
        },
        updatedAt: {
            type: Number,
            required: true,
        },
        history: {
            type: [Number],
            required: true
        }
    },
    {
        collection: "Tv365PointToCreditMultiplier"
    })
module.exports = mongoose.model("Tv365PointToCreditMultiplier", PointToCreditMultiplierSchema);