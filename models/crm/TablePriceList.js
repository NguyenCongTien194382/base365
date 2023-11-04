//Model này dùng để 
const mongoose = require('mongoose')


const TablePriceList = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    company_id: {
        //
        type: Number,
        required: true
    },
    emp_id: {
        //
        type: Number,
        required: true
    },
    id_customer: {
        //
        type: Number,
        required: true
    },
    image_logo: {
        //
        type: String,
    },
    name: {
        //
        type: String,
        required: true
    },
    website: {
        //
        type: String,
    },
    user_bank: {
        //
        type: String,
        required: true
    },
    name_bank: {
        //
        type: String,
        required: true
    },
    number_bank: {
        //
        type: Number,
        required: true
    },
    branch_bank: {
        //
        type: String,
        required: true
    },
    count: {
        //
        type: Number,
        required: true
    },
    discount: {
        //
        type: Number,
        required: true
    },
    type_discount: {
        //
        type: Number,
        required: true
    },
    content: {
        //
        type: String,
        required: true
    },
    is_delete: {
        //
        type: Number,
        required: true
    },
    status_save: {
        //
        type: Number,
        required: true
    },
    created_at: {
        //
        type: Number,
        required: true
    },
    updated_at: {
        //
        type: Number,
        required: true,
    },
}, {
    collation: "TablePriceList",
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('TablePriceList', TablePriceList);

// //Model này dùng để 
// const mongoose = require('mongoose')


// const TablePriceList = new mongoose.Schema({
//     _id: {
//         //id 
//         type: Number,
//         required: true
//     },
    

// });

// module.exports = mongoose.model('TablePriceList', TablePriceList);

