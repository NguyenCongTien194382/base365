const mongoose = require('mongoose');
const View = new mongoose.Schema({
    _id: {
        type: Number,
    },
    id_user: {
        type: Number,
    },
    id_vb: {
        type: Number,
    },
    time: {
        type: Number,
    }
});
module.exports = mongoose.model("Vanthu_view", View);