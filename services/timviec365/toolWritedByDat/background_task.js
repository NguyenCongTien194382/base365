const functions = require('../../functions');
const axios = require('axios');


const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const Users = require('../../../models/Users');
const Category = require('../../../models/Timviec365/CategoryJob.js');
const ImageSpam = require('../../../models/Timviec365/UserOnSite/Company/ImageSpam');
const District = require('../../../models/District');
const City = require('../../../models/City');
const PostsTV365 = require('../../../models/Timviec365/Blog/Posts');


// Service
const service = require('../new');
const serviceBlog = require('../blog');
const serviceCompany = require('../company');
const serviceCandidate = require('../candidate');


//tool run always
//tool run always


//tin bi trung
exports.checkSpamNew = async() => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const newCheck = await NewTV365.find({
                    $or: [{ new_check_spam: 0 }, { new_check_spam: null }],
                }, {
                    _id: 0,
                    new_id: 1,
                    new_update_time: 1,
                    new_user_id: 1,
                })
                .sort({ new_update_time: -1 })
                .limit(1);


            if (newCheck.length < 1) continue;
            const user_id = newCheck[0].new_user_id;
            const new_id = newCheck[0].new_id;
            console.log('Checking spam new is ' + new_id);
            const newDuplicate = [];
            const listNew = await NewTV365.find({
                new_user_id: user_id,
                new_id: { $ne: new_id },
            }, {
                new_id: 1,
            });
            if (!listNew || listNew.length == 0) {
                await NewTV365.updateOne({
                    new_id: new_id,
                }, {
                    new_check_spam: 2,
                    new_id_duplicate: '',
                });
                continue;
            }
            const listNewId = listNew.map((item) => item.new_id).join(',');
            if (listNewId != '') {
                const data = await axios({
                    method: 'post',
                    url: 'http://43.239.223.4:7027/view_mdtd_tin',
                    data: {
                        site_tin: 'timviec365',
                        new_id_1: new_id,
                        list_new_id: listNewId,
                    },
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (!data) {
                    // console.log('Falure to compare new');
                    continue;
                }
                if (!data.data) continue;
                if (!data.data.data) continue;
                if (!data.data.data.item) continue;
                const listFitNew = data.data.data.item;
                let isDuplicate = false;
                for (const element of listFitNew) {
                    if (element.muc_do_tuong_dong >= 90) {
                        new_check_spam = 1;
                        newDuplicate.push(element.new_tin);
                        isDuplicate = true;
                    }
                }
                if (isDuplicate) {
                    await NewTV365.updateOne({
                        new_id: new_id,
                    }, {
                        new_check_spam: 1,
                        new_id_duplicate: newDuplicate,
                    });
                } else {
                    await NewTV365.updateOne({
                        new_id: new_id,
                    }, {
                        new_check_spam: 2,
                        new_id_duplicate: '',
                    });
                }
                console.log('Check spam new is successfully ' + new_id);
            } else continue;
        } catch (e) {
            console.log(e.message);
        }
    }
};
//anh bi trung
exports.checkSpamImage = async() => {
    let i = -1;
    while (true) {
        i++;
        if (i == 4) {
            i = -1;
            await new Promise((resolve) => setTimeout(resolve, 6000));
        }
        try {
            const timeNow = Math.round(Date.now() / 1000);
            let imageNoSpam = '';
            const newData = (
                await NewTV365.find({
                    new_images: { $ne: null, $ne: '' },
                    $or: [{ new_check_spam_img: 0 }, { new_check_spam_img: null }],
                    // new_update_time: {
                    //  $gte: timeNow,
                    // },
                }, {
                    _id: 0,
                    new_id: 1,
                    new_images: 1,
                    new_user_id: 1,
                    new_update_time: 1,
                })
                .sort({
                    new_update_time: -1,
                })
                .limit(1)
            )[0];


            if (!newData) {
                // if (!newData['new_images'])
                // console.log("You don't have any photo to compare");
                continue;
            }


            const userId = newData['new_user_id'];


            const user = await Users.findOne({
                type: 1,
                idTimViec365: userId,
                $and: [
                    { 'inForCompany.timviec365.usc_images': { $ne: null } },
                    { 'inForCompany.timviec365.usc_images': { $ne: '' } },
                ],
            }, {
                _id: 0,
                _id: 1,
                createdAt: 1,
                'inForCompany.timviec365.usc_images': 1,
            });
            const newId = newData['new_id'];
            console.log('Checking spam image for new: ' + newId);


            if (!user) {
                await NewTV365.updateOne({
                    new_id: newId,
                }, {
                    new_check_spam_img: 1,
                });
                continue;
            }


            const listImage = user.inForCompany.timviec365.usc_images.split(',');


            const arrNewImageName = newData['new_images'].split(',');


            const linkBase =
                'https://cdn.timviec365.vn/pictures/' +
                functions.convertDate(user['createdAt'], true) +
                '/';
            const arrImageName = listImage.map((value) => value);


            let listNewImageName = linkBase + arrNewImageName[0];


            let listImageName = linkBase + arrImageName[0];


            for (let i = 1; i < arrImageName.length; i++) {
                listImageName += ',' + linkBase + arrImageName[i];
            }


            for (let i = 1; i < arrNewImageName.length; i++) {
                listNewImageName += ',' + linkBase + arrNewImageName[i];
            }


            const params = {
                list_image: listImageName,
                list_new_image: listNewImageName,
            };


            const url = 'http://43.239.223.137:8027/image_spam';
            const paramString = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${paramString}`;


            const result = await axios({
                method: 'post',
                url: fullUrl,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (!result) continue;
            if (result) {
                if (!result.data) continue;
                if (!result.data.data) continue;
                if (!result.data.data.item) continue;


                const listItem = result.data.data.item;
                listItem.forEach(async(item) => {
                    const idNewImage = item['id_new_image'];
                    const idImage = item['id_image'];
                    if (idNewImage && idImage) {
                        const imgSp = idNewImage.substring(idNewImage.lastIndexOf('/') + 1);
                        const img = idImage.substring(idImage.lastIndexOf('/') + 1);
                        if (item['similarity_image'] >= 90) {
                            await new ImageSpam({
                                img_user_id: userId,
                                img: imgSp,
                                img_duplicate: img,
                                active: 1,
                                usc_createAt: user['createdAt'],
                                createAt: timeNow,
                                img_new_id: newId,
                            }).save();
                        } else {
                            imageNoSpam += ',' + img;
                        }
                    }
                });
                if (imageNoSpam == '') {
                    await NewTV365.updateOne({
                        new_id: newId,
                    }, {
                        new_check_spam_img: 1,
                    });
                } else {
                    const listName = user.listImage + imageNoSpam;
                    await Users.updateOne({
                        idTimViec365: userId,
                        type: 1,
                    }, {
                        'inForCompany.inForCompany.timviec365.usc_images': listName,
                        updatedAt: timeNow,
                    });
                    await NewTV365.updateOne({
                        new_id: newId,
                    }, {
                        new_check_spam_img: 1,
                    });
                }
            } else continue;


            console.log('Check spam image is successfully ' + newId);
        } catch (e) {
            console.log(e);
            continue;
        }
    }
};
//ngu phap cho tin
exports.checkGrammarNew = async() => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 3) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const newCheck = await NewTV365.find({
                    // new_id: 863777,
                    $or: [{ new_check_grammar: 0 }, { new_check_grammar: null }],
                }, {
                    _id: 0,
                    new_id: 1,
                    new_update_time: 1,
                    new_user_id: 1,
                    new_mota: 1,
                    new_yeucau: 1,
                    new_quyenloi: 1,
                    new_ho_so: 1,
                })
                .sort({ new_update_time: -1 })
                .limit(1);
            if (newCheck.length < 1) {
                console.log("You don't have any new to check grammar");
                continue;
            }
            const user_id = newCheck[0].new_user_id;
            const new_id = newCheck[0].new_id;
            let mota = newCheck[0].new_mota;
            let yeucau = newCheck[0].new_yeucau;
            let quyenloi = newCheck[0].new_quyenloi;
            let hoso = newCheck[0].new_ho_so;


            const textSend = [];


            textSend.push(mota ? mota.replace(/<[^>]*>/g, '') : '');
            textSend.push(yeucau ? yeucau.replace(/<[^>]*>/g, '') : '');
            textSend.push(quyenloi ? quyenloi.replace(/<[^>]*>/g, '') : '');
            textSend.push(hoso ? hoso.replace(/<[^>]*>/g, '') : '');
            for (let i = 0; i < 4; i++) {
                const jsonData = {
                    text: functions.formatText(textSend[i].replace('"', "'")),
                };
                const textChange = await axios({
                    method: 'post',
                    url: 'http://43.239.223.5:5005/process_text',
                    data: jsonData,
                    headers: {
                        'Content-Type': 'multipart/form-data', // Đặt Content-Type thành application/json
                    },
                });
                if (!textChange) continue;
                if (!textChange.data) continue;
                if (!textChange.data.processed_text) continue;
                textSend[i] = textChange.data.processed_text.replace(/<[^>]*>/g, '');
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }


            await NewTV365.updateOne({
                new_id: new_id,
            }, {
                new_check_grammar: 1,
                new_mota: textSend[0],
                new_yeucau: textSend[1],
                new_quyenloi: textSend[2],
                new_ho_so: textSend[3],
            });


            console.log('Check grammar for new is successfully ' + new_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};
//ngu phap cho blog
exports.checkGrammarBlog = async() => {
    const timeNow = Date.now() / 1000;
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const newCheck = await PostsTV365.find({
                    $or: [{ new_check_grammar: 0 }, { new_check_grammar: null }],
                }, {
                    _id: 0,
                    new_id: 1,
                    new_update_time: 1,
                    new_description: 1,
                    new_teaser: 1,
                    new_des: 1,
                    new_keyword: 1,
                    new_ndgy: 1,
                })
                .sort({ new_date_last_edit: -1 })
                .limit(1);
            if (newCheck.length < 1) {
                console.log("You don't have any blog to check grammar");
                continue;
            }
            const new_id = newCheck[0].new_id;
            let mota = newCheck[0].new_description;
            let tieude = newCheck[0].new_teaser;
            let title = newCheck[0].new_title;


            const textSend = [];


            textSend.push(mota ? mota : '');
            textSend.push(tieude ? tieude : '');
            textSend.push(title ? title : '');


            for (let i = 0; i < 3; i++) {
                const jsonData = {
                    text: functions.formatText(textSend[i].replace('"', "'")),
                };
                const textChange = await axios({
                    method: 'post',
                    url: 'http://43.239.223.5:5005/process_text',
                    data: jsonData,
                    headers: {
                        'Content-Type': 'multipart/form-data', // Đặt Content-Type thành application/json
                    },
                });
                if (!textChange) continue;
                if (!textChange.data) continue;
                if (!textChange.data.processed_text) continue;
                textSend[i] = textChange.data.processed_text;
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }


            await PostsTV365.updateOne({
                new_id: new_id,
            }, {
                new_check_grammar: 1,
                new_update_time: timeNow,
                new_description: textSend[0],
                new_teaser: textSend[1],
                new_title: textSend[3],
            });


            console.log('Check grammar for blog is successfully ' + new_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};


//chuyển đổi giọng nói cho bản tin
exports.translateTextToAudio = async() => {
    let i = -1;
    while (true) {
        try {
            const timeNow = Date.now() / 1000;
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const newCheck = await NewTV365.find({
                    new_check_grammar: 1,
                    $or: [{
                            new_trans_audio: {
                                $lt: 4,
                            },
                        },
                        {
                            new_trans_audio: null,
                        },
                    ],
                }, {
                    _id: 0,
                    new_id: 1,
                    new_title: 1,
                    new_update_time: 1,
                    new_audio: 1,
                    new_trans_audio: 1,
                    new_trans_audio: 1,
                    nm_id: 1,
                    nm_type: 1,
                    nm_unit: 1,
                    nm_min_value: 1,
                    nm_max_value: 1,
                    new_money: 1,
                    new_view_count: 1,
                    new_update_time: 1,
                    new_create_time: 1,
                    new_user_id: 1,
                    new_cat_id: 1,
                    new_cap_bac: 1,
                    new_hinh_thuc: 1,
                    new_so_luong: 1,
                    new_tgtv: 1,
                    new_han_nop: 1,
                    new_city: 1,
                    new_qh_id: 1,
                    new_addr: 1,
                    new_mota: 1,
                    new_exp: 1,
                    new_bang_cap: 1,
                    new_gioi_tinh: 1,
                    new_yeucau: 1,
                    new_quyenloi: 1,
                    new_ho_so: 1,
                    new_lv: 1,
                    new_hoahong: 1,
                })
                .sort({ new_update_time: -1 })
                .limit(1);
            if (newCheck.length < 1) {
                // console.log("You don't have any new to trans audio");
                continue;
            }
            const news = newCheck[0];
            const new_id = news.new_id;
            console.log('Translating text of new to audio: ' + new_id);
            const count = news.new_trans_audio ? news.new_trans_audio : 0;
            if (count == 4) continue;
            let linkAudio = news.new_audio;
            let job = 'Ngành nghề: ';
            let field = news.new_lv ? 'Lĩnh vực: ' + news.new_lv : '';
            let salary =
                'Mức lương: ' +
                (await functions.new_money_tv(
                    news.nm_id,
                    news.nm_type,
                    news.nm_unit,
                    news.nm_min_value,
                    news.nm_max_value,
                    news.new_money
                ));
            let viewer =
                'Lượt xem: ' + (news['new_view_count'] ? news['new_view_count'] : 0);
            let infoGeneral = 'Thông tin chung: ';
            let update = 'Cập nhật: ';
            if (news.new_update_time > news.new_create_time) {
                const updateDate = new Date(news.new_update_time * 1000); // Chuyển đổi từ timestamp sang mili giây
                update += `${updateDate.getDate()}/${
          updateDate.getMonth() + 1
        }/${updateDate.getFullYear()}`;
            } else {
                const createDate = new Date(news.new_create_time * 1000); // Chuyển đổi từ timestamp sang mili giây
                update += `${createDate.getDate()}/${
          createDate.getMonth() + 1
        }/${createDate.getFullYear()}`;
            }
            const jobGet = await Category.find({}, { cat_id: 1, cat_name: 1 }).sort({
                cat_id: 1,
            });


            const dataJob = jobGet.map((item) => item.cat_name);


            const cityGet = await City.find({}, { _id: 1, name: 1 }).sort({ _id: 1 });


            const dataCity = cityGet.map((item) => item.name);


            const user = await Users.findOne({ type: 1, idTimViec365: news.new_user_id }, { userName: 1 });
            if (!user) continue;


            for (let i = 0; i < news.new_cat_id.length; i++) {
                if (i == 0) job += dataJob[news.new_cat_id[i]];
                else job += ',' + dataJob[news.new_cat_id[i]];
            }
            infoGeneral +=
                'Chức vụ: ' +
                (news.new_cap_bac != 0 ?
                    service.getPosition(news.new_cap_bac) :
                    'Nhân viên') +
                '. ';


            if (news['new_hinh_thuc'] != 7) {
                infoGeneral +=
                    'Hình thức làm việc: ' +
                    (news.new_hinh_thuc > 0 ?
                        service.getForm(news.new_hinh_thuc) :
                        'Toàn thời gian cố định') +
                    '. ';
            } else {
                infoGeneral += 'Hình thức làm việc: Việc làm từ xa. ';
            }


            if (news['new_hoahong'] != '') {
                infoGeneral += 'Hoa hồng: ' + news['new_hoahong'] + '. ';
            }


            infoGeneral +=
                'Số lượng cần tuyển: ' +
                (news.new_so_luong != '' ? news.new_so_luong : 'không hạn mức') +
                ' người. ';


            if (news.new_tgtv != '')
                infoGeneral += 'Thời gian thử việc: ' + news.new_tgtv + '. ';
            const due = new Date(news.new_han_nop * 1000);


            infoGeneral +=
                'Hạn nộp hồ sơ: ' +
                (news.new_han_nop > timeNow ?
                    `${due.getDate()}/${due.getMonth() + 1}/${due.getFullYear()}` +
                    service.timeElapsedString2(news['new_han_nop']) :
                    'Đã hết hạn nộp hồ sơ') +
                '. ';


            infoGeneral += 'Địa điểm làm việc: Tỉnh thành: ';
            for (let i = 0; i < news.new_city.length; i++) {
                if (i == 0) infoGeneral += dataCity[news.new_city[i]];
                else infoGeneral += ',' + dataCity[news.new_city[i]];
            }


            infoGeneral += '. Quận huyện: ';


            for (let i = 0; i < news.new_qh_id.length; i++) {
                const district = await District.findOne({ _id: news.new_qh_id[i], parent: { $ne: 0 } }, { name: 1 });
                if (i == 0) infoGeneral += district ? district.name : '';
                else infoGeneral += ',' + district ? district.name : '';
            }


            if (news['new_addr'])
                infoGeneral += '. ' + 'Địa chỉ chi tiết: ' + news['new_addr'] + '. ';


            infoGeneral +=
                'Mô tả công việc: ' + news['new_mota'].replace(/<[^>]*>/g, '');
            infoGeneral +=
                '. Yêu cầu: Kinh Nghiệm: ' +
                (news['new_exp'] > 0 ?
                    service.getExperience(news['new_exp']) :
                    'Không yêu cầu') +
                '. ';
            infoGeneral +=
                'Bằng cấp: ' +
                (news['new_bang_cap'] != 0 ?
                    service.getExperience(news['new_bang_cap']) :
                    'Không yêu cầu') +
                '. ';
            infoGeneral +=
                'Giới tính: ' +
                (news['new_gioi_tinh'] != '' ?
                    news['new_gioi_tinh'] :
                    'Không yêu cầu') +
                '. ';
            infoGeneral +=
                news['new_yeucau'].replace(/<[^>]*>/g, '') +
                '. Quyền lợi: ' +
                news['new_quyenloi'].replace(/<[^>]*>/g, '');
            if (news['new_ho_so'] != '')
                infoGeneral +=
                '. Hồ sơ: ' + news['new_ho_so'].replace(/<[^>]*>/g, '') + '. ';
            let text = '';
            text += news['new_title'] + ', ';
            text += user.userName + ', ';
            text += job + ',';
            if (field != '') text += field + ', ';
            text += salary + ', ';
            text += viewer + ', ';
            text += update + ', ';
            text += infoGeneral;
            text = text.replace('"', "'");


            text = functions.formatText(text);
            const data = await axios({
                method: 'post',
                url: 'http://43.239.223.5:5113/tts',
                data: {
                    text: text,
                    voice_id: count + 1,
                    volume: 0,
                },
                headers: {
                    'Content-Type': 'application/json', // Đặt Content-Type thành application/json
                },
            });
            if (!data) {
                continue;
            }
            if (!data.data) continue;
            if (!data.data.data) continue;
            const base64 = data.data.data;
            const result = service.uploadAudio(new_id, base64);
            if (count == 0) linkAudio = result;
            else {
                linkAudio += ',' + result;
            }
            if (!result) {
                // console.log('error uploading audio');
                continue;
            }
            await NewTV365.updateOne({
                new_id: new_id,
            }, {
                new_audio: linkAudio,
                new_trans_audio: count + 1,
            });
            console.log('Trans text new to audio is successfully ' + new_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};


//chuyển đổi giọng nói cho blog
exports.translateTextToAudio1 = async(res, req, next) => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const blogCheck = await PostsTV365.find({
                    $and: [{
                            $or: [{
                                    new_trans_audio: {
                                        $lt: 4,
                                    },
                                },
                                {
                                    new_trans_audio: null,
                                },
                            ],
                        },
                        { new_301: '' },
                    ],
                }, {
                    _id: 0,
                    new_id: 1,
                    new_trans_audio: 1,
                    new_audio: 1,
                    new_title: 1,
                    new_teaser: 1,
                    new_description: 1,
                })
                .sort({ new_date_last_edit: -1 })
                .limit(1);
            if (blogCheck.length < 1) {
                // console.log("You don't have any blog to trans audio");
                continue;
            }
            const blog = blogCheck[0];
            let text =
                blog.new_title.replace(/<[^>]*>/g, '') +
                blog.new_teaser.replace(/<[^>]*>/g, '') +
                blog.new_description.replace(/<[^>]*>/g, '');
            const count = blog.new_trans_audio ? blog.new_trans_audio : 0;
            if (count == 4) continue;
            const new_id = blog.new_id;
            console.log('Translated text of blog to audio : ' + new_id);
            let linkAudio = blog.new_audio;
            text = functions.formatText(text);
            const data = await axios({
                method: 'post',
                url: 'http://43.239.223.5:5113/tts2',
                data: {
                    text: text.replace('"', "'"),
                    voice_id: count + 1,
                    volume: 0,
                },
                headers: {
                    'Content-Type': 'application/json', // Đặt Content-Type thành application/json
                },
            });
            if (!data) {
                continue;
            }
            if (!data.data) continue;
            const base64 = data.data.data;
            const result = serviceBlog.uploadAudio(new_id, base64);
            if (count == 0) linkAudio = result;
            else {
                linkAudio += ',' + result;
            }
            if (!result) {
                // console.log('error uploading audio');
                continue;
            }
            await PostsTV365.updateOne({
                new_id: new_id,
            }, {
                new_audio: linkAudio,
                new_trans_audio: count + 1,
            });
            console.log('Trans text blog to audio is successfully ' + new_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};


//chuyển đổi giọng nói cho ứng viên
exports.translateTextToAudio2 = async() => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 6000));
            }
            const userCheck = await Users.find({
                    type: 0,
                    $or: [{
                            'inForPerson.candidate.scan_audio': {
                                $lt: 4,
                            },
                        },
                        {
                            'inForPerson.candidate.scan_audio': null,
                        },
                    ],
                    $and: [
                        { inForPerson: { $ne: null } },
                        { 'inForPerson.candidate': { $ne: null } },
                    ],
                })
                .sort({ createdAt: -1 })
                .limit(1);
            if (userCheck.length < 1) {
                // console.log("You don't have any candidate to trans audio");
                continue;
            }
            const user = userCheck[0];
            let text = '';
            const count = user.inForPerson.candidate.scan_audio ?
                user.inForPerson.candidate.scan_audio :
                0;
            if (count == 4) continue;
            const user_id = user.idTimViec365;
            console.log('Translating text of candidate to audio :' + user_id);
            let linkAudio = user.inForPerson.candidate.audio;
            text += user['userName'] + '. ';
            if (!user['inForPerson']) continue;
            const cv = user['inForPerson']['candidate'];
            if (cv['cv_title']) text += cv['cv_title'] + '. ';
            text += 'Mã ứng viên: ' + user['idTimViec365'] + '. ';
            text += 'Lượt xem: ' + cv['use_view'] + '. ';
            let job = '';


            if (cv['cv_cate_id'] != null && cv['cv_cate_id'].length > 0) {
                const jobGet = await Category.find({}, { cat_id: 1, cat_name: 1 }).sort({
                    cat_id: 1,
                });


                const dataJob = jobGet.map((item) => item.cat_name);
                text += 'Ngành nghề: ';
                cv['cv_cate_id'].forEach((item) => {
                    if (i == 0) job += item != 0 ? dataJob[item] : 'Xem trong CV';
                    else job += ', ' + (item != 0 ? dataJob[item] : 'Xem trong CV');
                });


                text += job;
            }


            if (cv['cv_city_id'] != null && cv['cv_city_id'].length > 0) {
                const cityGet = await City.find({}, { _id: 1, name: 1 }).sort({
                    _id: 1,
                });
                let city = '';
                const dataCity = cityGet.map((item) => item.name);
                text += 'Nơi mong muốn làm việc: ';
                cv['cv_city_id'].forEach((item) => {
                    if (i == 0) city += item != 0 ? dataCity[item] : 'Toàn Quốc';
                    else city += ', ' + (item != 0 ? dataCity[item] : 'Toàn Quốc');
                });
            }


            let salary =
                'Mức lương: ' +
                (await functions.new_money_tv(
                    user.idTimViec365,
                    cv.um_type,
                    cv.um_unit,
                    cv.um_min_value,
                    cv.um_max_value,
                    cv.cv_money_id
                ));
            text += 'Mức lương mong muốn: ' + salary + '. ';
            text +=
                'Kinh nghiệm làm việc: ' +
                (cv['cv_exp'] != '' ?
                    service.getExperience(cv['cv_exp']) :
                    'Xem trong CV') +
                '. ';


            const account = user['inForPerson']['account'];
            if (account['gender'] != 0) {
                text += 'Giới tinh: ';
                if (account['gender'] == 1) {
                    text += 'Name' + '. ';
                } else {
                    text += 'Nữ ' + '. ';
                }
            }


            if (account['birthday'] != 0) {
                const updateDate = new Date(account.birthday * 1000); // Chuyển đổi từ timestamp sang mili giây
                text +=
                    'Ngày sinh: ' +
                    `${updateDate.getDate()}/${
            updateDate.getMonth() + 1
          }/${updateDate.getFullYear()}` +
                    '. ';
            } else {
                text += 'Ngày sinh: Xem trong CV . ';
            }


            if (account['married'] != 0) {
                text += 'Hôn nhân: ';
                if (account['married'] == 1) {
                    text += 'Độc thân. ';
                } else {
                    text += 'Đã có gia đình. ';
                }
            }


            if (user['district'] != 0 && user['city'] != 0) {
                const district = await District.findOne({ _id: user['district'], parent: { $ne: 0 } }, { name: 1 });


                const city = await City.findOne({ _id: user['district'], parent: 0 }, { name: 1 });


                text += 'Quận huyện - Tỉnh thành: ';


                text +=
                    ',' +
                    (district ? district.name : '') +
                    ' - ' +
                    (city ? city.name : '') +
                    '. ';
            } else {
                text +=
                    'Chỗ ở hiện tại: ' +
                    (user['address'] != '' ? user['address'] : 'Xem trong Cv') +
                    '. ';
            }


            text = functions.formatText(text);


            const data = await axios({
                method: 'post',
                url: 'http://43.239.223.5:5113/tts1',
                data: {
                    text: text,
                    voice_id: count + 1,
                    volume: 0,
                },
                headers: {
                    'Content-Type': 'application/json', // Đặt Content-Type thành application/json
                },
            });
            if (!data) {
                continue;
            }
            if (!data.data) continue;
            const base64 = data.data.data;
            const result = serviceCandidate.uploadAudio(user_id, base64);
            if (count == 0) linkAudio = result;
            else {
                linkAudio += ',' + result;
            }
            if (!result) {
                // console.log('error uploading audio');
                continue;
            }
            await Users.updateOne({
                idTimViec365: user_id,
            }, {
                'inForPerson.candidate.audio': linkAudio,
                'inForPerson.candidate.scan_audio': count + 1,
            });
            console.log('Trans text candidate to audio is successfully ' + user_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};


this.checkSpamImage();
this.checkSpamNew();
// this.checkGrammarBlog();
// this.checkGrammarNew();
this.translateTextToAudio();
this.translateTextToAudio1();
this.translateTextToAudio2();