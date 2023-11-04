var mongoose = require('mongoose')



//chạy tool
const CronCalPointSee = require('./controllers/timviec/history/Cron/CronCalPointSee');
const CronTiaSet = require('./controllers/timviec/history/Cron/CronTiaSet');
const CronAnhSaoUv = require('./controllers/timviec/history/Cron/CronAnhSaoUv');

const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));