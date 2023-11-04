const mongoose = require('mongoose');
const CreditSchema = new mongoose.Schema(
    {
        usc_id:{
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        collection: "Tv365Credits"
    })
module.exports = mongoose.model("Tv365Credits", CreditSchema);