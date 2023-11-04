const UvBadContent = require('../../models/Timviec365/UvBadContent');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi');
const axios = require('axios');
const mongoose = require('mongoose');
const functions = require("../../services/functions");
const Users = require('../../models/Users');

const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));
// kiểm tra những cv trong vòng 6 tháng 
const ToolCheckCV = async() => {
    let time = new Date().getTime() / 1000 - 6 * 30 * 24 * 3600;
    let flag = true;
    let count = 0;
    let skip = 0;
    while (true) {
        let listCV = await SaveCvCandi.find({ cv: 1, time_edit: { $gte: time } }).sort({ time_edit: -1 }).skip(skip).limit(100).lean()
        if (listCV.length) {
            skip = skip + 100;
            for (let i = 0; i < listCV.length; i++) {
                let cv = listCV[i];
                let response = await axios({
                    method: "post",
                    url: "http://43.239.223.5:5551/bad",
                    data: {
                        text: cv.html
                    },
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.data && response.data.list_key && response.data.list_key.length) {
                    let listKey = response.data.list_key;
                    let word = "";
                    for (let j = 0; j < listKey.length; j++) {
                        if (j == 0) {
                            word = listKey[j];
                        } else {
                            word = `${word},${listKey[j]}`
                        }
                    }
                    let user = await Users.findOne({ type: { $ne: 1 }, idTimViec365: Number(cv.uid) }).lean();
                    await UvBadContent.deleteMany({ bad_use_id: cv.uid });
                    let obj = new UvBadContent({
                        cv_id: cv.id,
                        hoso_id: 0,
                        bad_use_id: cv.uid,
                        //https://timviec365.vn/uvtv/dau-thi-quynh-chi-uv1111143208
                        bad_use_link: `https://timviec365.vn/uvtv/${functions.renderAlias(user.userName)}-uv${user.idTimViec365}`,
                        bad_use_text: word
                    });
                    await obj.save();

                    console.log(obj);
                }
            }
        } else {
            console.log("Kết thúc", new Date());
            flag = false;
        }
    }
}
ToolCheckCV();