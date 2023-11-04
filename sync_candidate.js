var mongoose = require('mongoose')
const Users = require('./models/Users');
const serviceDataAI = require('./services/timviec365/dataAI');
const FormData = require('form-data');
const axios = require('axios');
const SaveCandidate = require('./models/Timviec365/UserOnSite/Company/SaveCandidate');
//chạy tool
// const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

console.log('Tool started');

const ToolPushDataUvToElasticToSearch = async() => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_tbl_save_uv.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    await SaveCandidate.deleteOne({ id: element.id });
                    const item = new SaveCandidate({
                        id: element.id,
                        usc_id: element.usc_id,
                        use_id: element.use_id,
                        save_time: element.save_time
                    });

                    await item
                        .save()
                        .then()
                        .catch((err) => {
                            console.log(err);
                        });
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

ToolPushDataUvToElasticToSearch();



const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));