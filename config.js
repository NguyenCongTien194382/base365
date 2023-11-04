var mongoose = require('mongoose');

exports.DbConnect = () => {
    const DB_URL = '';
    mongoose.connect(DB_URL)
        .then(() => console.log('DB Connected!'))
        .catch(error => console.log('DB connection error:', error.message));

}