var mongoose = require('mongoose')
const Users = require('./models/Users');
const serviceDataAI = require('./services/timviec365/dataAI');
const serviceCandidate = require('./services/timviec365/candidate');
const FormData = require('form-data');
const axios = require('axios')
const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));
const Tool = async() => {
    try {
        let flag = true;
        let skip = 0;
        let limit = 50;
        while (flag) {
            let listUser = await Users.aggregate([{
                    $sort: {
                        _id: -1
                    }
                },
                {
                    $match: {
                        //idTimViec365: { $ne: 0 },
                        idTimViec365: 1111130213,
                        type: 0,
                        //fromDevice: 0
                    }
                },
                {
                    $lookup: {
                        from: 'SaveCvCandi',
                        localField: 'idTimViec365',
                        foreignField: 'uid',
                        as: 'SaveCvCandi'
                    }
                },
                {
                    $match: {
                        'SaveCvCandi.0': {
                            $exists: false
                        }
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
            if (listUser.length) {
                for (let i = 0; i < listUser.length; i++) {
                    let obj = listUser[i];
                    if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.percents) {
                        let percent = await serviceCandidate.percentHTHS(obj.idTimViec365);
                        await Users.updateOne({ idTimViec365: obj.idTimViec365, type: 0 }, {
                            $set: {
                                "inForPerson.candidate.percents": percent
                            }
                        });
                        let dataSearchAI = {
                            use_id: obj.idTimViec365,
                            use_update_time: new Date().getTime() % 1000,
                            percents: percent,
                            use_birth_day: Number(obj.inForPerson.account.birthday)
                        };
                        await serviceDataAI.updateDataSearchCandi2(dataSearchAI);
                        console.log("Cập nhật thành công cho ứng viên", obj.idTimViec365, obj.inForPerson.candidate.percents, percent);
                    }
                };
                skip = skip + 50;
            } else {
                flag = false;
            }
        }
    } catch (e) {
        console.log(e)
    }
}
Tool()