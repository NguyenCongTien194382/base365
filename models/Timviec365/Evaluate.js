const mongoose = require('mongoose');
const Tv365EvaluaSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        unique: true,
        autoIncrement: true
    },
    usc_id: {
        type: Number,
        default: 0
    },
    use_id: {
        type: Number,
        default: 0
    },
    bx_uv: {
        type: String,
        default: null
    },
    bx_ntd: {
        type: String,
        default: null
    },
    time_create: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365Evalua',
    versionKey: false
});

module.exports = mongoose.model("Tv365Evalua", Tv365EvaluaSchema);