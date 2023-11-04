var mongoose = require('mongoose')
const Users = require('./models/Users');
const serviceDataAI = require('./services/timviec365/dataAI');
const FormData = require('form-data');
const axios = require('axios')
    //chạy tool
    // const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

console.log('Tool started');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function removeVietnameseTones(str) {
    if (str && (str.trim()) && (str.trim() != "")) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();

        str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|{|}|\||\\/g, " ");
        return str;
    } else {
        return ""
    }
}


// bắn lên tìm kiếm trên site ( cập nhật phần trăm hoàn thiện hồ sơ ) 
const ToolUpdateTime = async() => {
    try {
        let skip = 0;
        let limit = 1000;
        let flag = true;
        while (flag) {
            let listUser = await Users.find({
                type: 0,
                idTimViec365: { $ne: 0 },
                "inForPerson.candidate": { $ne: null }
                // $and: [{
                //             idTimViec365: { $ne: 0 }
                //         },
                //         {
                //             idTimViec365: { $lte: 1388813 }
                //         }
                //     ]
                // "inForPerson.candidate.percents": { $gte: 45 }
            }).sort({ idTimViec365: -1 }).skip(skip).limit(limit).lean();
            if (listUser.length) {
                for (let i = 0; i < listUser.length; i++) {
                    let findUser = listUser[i];
                    let cv_city_id = "";
                    let cv_city_id_database = (findUser.inForPerson && findUser.inForPerson.candidate && findUser.inForPerson.candidate.cv_city_id) ? findUser.inForPerson.candidate.cv_city_id : [];
                    let cv_cate_id = "";
                    let cv_cate_id_database = (findUser.inForPerson && findUser.inForPerson.candidate && findUser.inForPerson.candidate.cv_cate_id) ? findUser.inForPerson.candidate.cv_cate_id : [];
                    if (cv_city_id_database.length) {
                        for (let i = 0; i < cv_city_id_database.length; i++) {
                            if (cv_city_id) {
                                cv_city_id = `${cv_city_id},${cv_city_id_database[i]}`;
                            } else {
                                cv_city_id = String(cv_city_id_database[i]);
                            }
                        }
                    }
                    if (cv_cate_id_database.length) {
                        for (let i = 0; i < cv_cate_id_database.length; i++) {
                            if (cv_cate_id) {
                                cv_cate_id = `${cv_cate_id},${cv_cate_id_database[i]}`;
                            } else {
                                cv_cate_id = String(cv_cate_id_database[i]);
                            }
                        }
                    }
                    console.log(findUser.idTimViec365, findUser.updatedAt, cv_cate_id, cv_city_id);
                    let dataSearchAI = {
                        use_id: findUser.idTimViec365,
                        use_update_time: findUser.updatedAt,
                        cv_city_id: cv_city_id,
                        cv_cate_id: cv_cate_id,
                        use_update_time_new: findUser.updatedAt,
                        um_max_value_new: findUser.inForPerson.candidate.um_max_value || 0,
                        um_min_value_new: findUser.inForPerson.candidate.um_min_value || 0,
                        use_birth_day_new: findUser.inForPerson.birthday
                    };
                    await serviceDataAI.updateDataSearchCandi2(dataSearchAI);
                };
                skip = skip + 1000;
            } else {
                flag = false;
            }
        }

    } catch (e) {
        console.log("ToolPushDataUvToElasticToSearchPer1Hour", e);
        await ToolUpdateTime();
    }
}




// bắn lên tìm kiếm trên site ( cập nhật phần trăm hoàn thiện hồ sơ ) hàng giờ 
ToolUpdateTime();




const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));