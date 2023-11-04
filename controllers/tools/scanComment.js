const functions = require("../../services/functions");
const serviceCandi = require("../../services/timviec365/candidate");
const SaveCvCandi = require("../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi");
const CommentPost = require("../../models/Timviec365/UserOnSite/CommentPost");
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');

const Users = require("../../models/Users");

const fs = require("fs");
const axios = require("axios");

var mongoose = require('mongoose')



//chạy tool
// const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

// console.log('Tool started');

const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));


const commentPost = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_comment.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    await CommentPost.deleteOne({ cm_id: element.cm_id });
                    const item = new CommentPost({
                        cm_id: element.cm_id,
                        cm_url: element.cm_url,
                        cm_parent_id: element.cm_parent_id,
                        cm_comment: element.cm_comment,
                        cm_new_id: element.new_id,
                        cm_sender_idchat: element.cm_sender_idchat,
                        cm_img: element.cm_img,
                        cm_tag: element.cm_tag,
                        cm_ip: element.cm_ip,
                        cm_time: element.cm_time,
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
    } catch (error) {
        console.log(error);
    }
};
commentPost();