const mongoose = require("mongoose");
const Cv365LikeSchema = new mongoose.Schema({
    uid: {
        //id người like
        type: Number,
    },
    id: {
        //id của mẫu
        type: Number,
    },
    status: {
        // trạng thái
        type: Number,
    },
    type: {
        // 1:cv, 2: đơn, 3:thư, 4:syll
        type: Number,
    },
}, {
    collection: "Cv365Like",
    versionKey: false,
});

module.exports = mongoose.model("Cv365Like", Cv365LikeSchema);