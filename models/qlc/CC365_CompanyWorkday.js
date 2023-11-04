const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const CC365_CompanyWorkdaySchema = new Schema({
    cw_id: {
        type: Number,
        default:0
    },
    num_days: {
        type: Number,
        default:0
    },
    apply_month: {
        type: String,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    com_id:{
        type: Number,
        require:true
    }
}, {
    collection: 'CC365_CompanyWorkday',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
CC365_CompanyWorkdaySchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'CC365_CompanyWorkdaySchemaId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});
module.exports = connection.model("CC365_CompanyWorkday", CC365_CompanyWorkdaySchema);