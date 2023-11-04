var mongoose = require('mongoose')
const Users = require('./models/Users');
const serviceDataAI = require('./services/timviec365/dataAI');
const FormData = require('form-data');
const axios = require('axios');
const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));
//chạy tool
// const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

console.log('Tool started');