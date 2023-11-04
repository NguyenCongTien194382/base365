// Load Model
const Users = require('../../../models/Users');
const Profile = require('../../../models/Timviec365/UserOnSite/Candicate/Profile');

// Service
const functions = require('../../../services/functions');
const serviceCrm = require('../../../services/timviec365/crm');
const serviceDataAI = require('../../../services/timviec365/dataAI');

// Load library
const md5 = require('md5');
const fs = require('fs');
const axios = require('axios');

const removeHtmlTag = (string) => {
    return string ? string.replace(/\s{2,9999}/g, ' ').replace(/(<([^>]+)>)/ig, ' ').replaceAll('<br>', '') : string;
}
const update_avatar = async(avatar, time, idTimViec365) => {
    try {
        if (avatar) {
            console.log(`ảnh đại diện ${idTimViec365}: ${avatar}`)
            avatar = avatar.replaceAll(' ', '%20');
            let typeOfAvatar = avatar.split('.').slice(-1);
            let dirAvatar = functions.folderUploadImageAvatar(time);
            if (!fs.existsSync(dirAvatar)) {
                fs.mkdirSync(dirAvatar, { recursive: true });
            }
            const nameAva = 'ava_' + time + '_' + idTimViec365 + '.' + typeOfAvatar;
            // dataUser.avatarUser = nameAva;
            const outputPath = `${dirAvatar}${nameAva}`;
            await functions.downloadFile(avatar, outputPath);
            return nameAva;
        }
        return '';
    } catch (error) {
        console.log(error);
        return '';
    }
}

const addData = async(account, userName, password, phone, email_contact, city, district, use_address, birthday, cv_city_id, cv_cate_id, cv_title, hs_active, avatar = '', file = '', cv_infor) => {
    try {
        const now = functions.getTimeNow();
        const getMaxUserID = await functions.getMaxUserID();
        const idTimViec365 = getMaxUserID._idTV365;
        //Lưu thông tin vào database
        let dataUser = {
            _id: getMaxUserID._id,
            password: password,
            userName: userName,
            phone: phone,
            emailContact: email_contact,
            type: 0,
            city: city,
            district: district,
            address: use_address,
            fromWeb: 'timviec365',
            fromDevice: 3,
            idTimViec365: getMaxUserID._idTV365,
            idRaoNhanh365: getMaxUserID._idRN365,
            idQLC: getMaxUserID._idQLC,
            chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
            authentic: 1,
            createdAt: now,
            updatedAt: now,
            inForPerson: {
                account: {
                    birthday: birthday,
                },
                employee: { com_id: 0 },
                candidate: {
                    cv_city_id: String(cv_city_id).split(',').map(Number),
                    cv_cate_id: String(cv_cate_id).split(',').map(Number),
                    cv_title: cv_title,
                    percents: 45,
                },
            },
        };
        if (account.includes('@')) {
            dataUser.email = account;
        } else {
            dataUser.phoneTK = account;
        }

        //Xử lý avatar
        if (avatar) {
            dataUser.avatarUser = await update_avatar(avatar, now, idTimViec365);
        }

        let nameFile = '',
            nameFileFull = '';
        if (file != '') {
            console.log(`file tải lên ${idTimViec365}: ${file}`);
            file = file.replaceAll(' ', '%20');
            let typeOfFile = file.split('.').slice(-1);
            let dirFile = functions.folderImageCV(now);
            if (!fs.existsSync(dirFile)) {
                fs.mkdirSync(dirFile, { recursive: true });
            }
            nameFile = 'cv_' + now + '_' + idTimViec365;
            nameFileFull = nameFile + '.' + typeOfFile;
            const outputPath = `${dirFile}/${nameFileFull}`;
            const linkFileHide = '';
            await functions.downloadFile(file, outputPath);
            const getMaxIdProfile = (await Profile.findOne({}, { hs_id: 1 })
                .sort({ hs_id: -1 })
                .limit(1)
                .lean()) || { hs_id: 0 };
            let dataProfile = {
                hs_id: Number(getMaxIdProfile.hs_id) + 1,
                hs_use_id: idTimViec365,
                hs_name: nameFile,
                hs_link: nameFileFull,
                hs_link_hide: linkFileHide,
                hs_create_time: now,
                hs_active: hs_active,
            };
            await new Profile(dataProfile).save();
        }

        await new Users(dataUser).save();

        //Bắn sang CRM
        const link_multi = `${functions.siteName()}/ung-vien/${functions.renderAlias(dataUser.userName)}-uv${dataUser.idTimViec365}.html`;
        await serviceCrm.sendataHr(dataUser.userName, dataUser.email, dataUser.phone, dataUser.idTimViec365, link_multi, dataUser._id);

        // Bắn sang tìm kiếm AI
        let dataSearchAI = {
            use_id: dataUser.idTimViec365,
            use_first_name: dataUser.userName,
            use_create_time: dataUser.createdAt,
            use_update_time: dataUser.updatedAt,
            use_gioi_tinh: 0,
            use_city: dataUser.city ? dataUser.city : 0,
            use_quanhuyen: dataUser.district ? dataUser.district : 0,
            use_address: dataUser.address,
            cv_title: dataUser.inForPerson.candidate.cv_title,
            cv_hocvan: 0,
            cv_exp: dataUser.inForPerson.candidate.cv_exp ? dataUser.inForPerson.candidate.cv_exp : 0,
            cv_muctieu: dataUser.inForPerson.candidate.cv_muctieu,
            cv_cate_id: dataUser.inForPerson.candidate.cv_cate_id ?
                dataUser.inForPerson.candidate.cv_cate_id.join(',') : '',
            cv_city_id: dataUser.inForPerson.candidate.cv_city_id ?
                dataUser.inForPerson.candidate.cv_city_id.join(',') : '',
            cv_address: '',
            cv_capbac_id: dataUser.inForPerson.candidate.cv_capbac_id ?
                dataUser.inForPerson.candidate.cv_capbac_id : 0,
            cv_money_id: dataUser.inForPerson.candidate.cv_money_id ?
                dataUser.inForPerson.candidate.cv_money_id : 0,
            cv_loaihinh_id: dataUser.inForPerson.candidate.cv_loaihinh_id ?
                dataUser.inForPerson.candidate.cv_loaihinh_id : '',
            cv_kynang: dataUser.inForPerson.candidate.cv_kynang,
            use_show: 1,
            dk: 3,
            use_birth_day: dataUser.inForPerson.account.birthday ? dataUser.inForPerson.account.birthday : 0,
            um_max_value: 0,
            um_min_value: 0,
            um_unit: 0,
            um_type: 0,
            percents: 45,
        };
        await serviceDataAI.createDataSearchCandi(dataSearchAI);

        // Cập nhật thông tin cv nếu có
        if (cv_infor) {
            try {
                let dataCV = JSON.parse(cv_infor);
                let contact = dataCV.menu.find(e => e.id == 'box01'),
                    career = dataCV.menu.find(e => e.id == 'box02'),
                    skill = dataCV.menu.find(e => e.id == 'box03'),
                    certificate = dataCV.menu.find(e => e.id == 'box05'),
                    award = dataCV.menu.find(e => e.id == 'box04'),
                    interest = dataCV.menu.find(e => e.id == 'box06'),
                    reference = dataCV.menu.find(e => e.id == 'box07'),
                    exp = dataCV.experiences.find(e => e.id == 'block01'),
                    education = dataCV.experiences.find(e => e.id == 'block02'),
                    activity = dataCV.experiences.find(e => e.id == 'block03'),
                    project = dataCV.experiences.find(e => e.id == 'block04'),
                    other = dataCV.experiences.find(e => e.id == 'block05');

                let cv_title_php = dataCV.cv_title,
                    use_name_php = dataCV.name,
                    cv_brithday_php = contact.content.content.content.birthday,
                    cv_address_php = contact.content.content.content.address,
                    use_mail_php = contact.content.content.content.email,
                    cv_phone_php = contact.content.content.content.phone,
                    cv_gioitinh_php = contact.content.content.content.sex;

                let cv_muctieu_php = career && career.status != 'hide' ? career.content.content : '',
                    cv_chungchi_php = certificate && certificate.status != 'hide' ? certificate.content.content : '',
                    cv_giaithuong_php = award && award.status != 'hide' ? award.content.content : '',
                    cv_sothich_php = interest && interest.status != 'hide' ? interest.content.content : '',
                    cv_nthchieu_php = reference && reference.status != 'hide' ? reference.content.content : '';
                let list_name_skill = [];
                if (skill.status != 'hide') {
                    if (skill.content && skill.content.content && skill.content.content.skills) {
                        skill.content.content.skills.forEach(element => {
                            list_name_skill.push(element.name);
                        });
                    }
                }

                let cv_kynang_php = list_name_skill.join('\n');

                let edu_list = [],
                    exp_list = [],
                    act_list = [],
                    proj_list = [],
                    other_list = [];
                if (education && education.status != 'hide' && education.content.content) {
                    education.content.content.forEach((e) => {
                        let arr_text = [];
                        if (e.title) arr_text.push(e.title);
                        if (e.date) arr_text.push(e.date)
                        if (e.subtitle) arr_text.push(e.subtitle)
                        if (e.content) arr_text.push(e.content)
                        edu_list.push(arr_text.join('\n'));
                    })
                }
                if (exp && exp.status != 'hide' && exp.content.content) {
                    exp.content.content.forEach((e) => {
                        let arr_text = [];
                        if (e.title) arr_text.push(e.title);
                        if (e.date) arr_text.push(e.date)
                        if (e.subtitle) arr_text.push(e.subtitle)
                        if (e.content) arr_text.push(e.content)
                        exp_list.push(arr_text.join('\n'));
                    })
                }
                if (activity && activity.status != 'hide' && activity.content.content) {
                    activity.content.content.forEach((e) => {
                        let arr_text = [];
                        if (e.title) arr_text.push(e.title);
                        if (e.date) arr_text.push(e.date)
                        if (e.subtitle) arr_text.push(e.subtitle)
                        if (e.content) arr_text.push(e.content)
                        act_list.push(arr_text.join('\n'));
                    })
                }
                if (project && project.status != 'hide' && project.content.content) {
                    project.content.content.forEach((e) => {
                        let arr_text = [];
                        if (e.title) arr_text.push(e.title);
                        if (e.date) arr_text.push(e.date)
                        if (e.subtitle) arr_text.push(e.subtitle)
                        if (e.content) arr_text.push(e.content)
                        proj_list.push(arr_text.join('\n'));
                    })
                }
                if (other && other.status != 'hide' && other.content.content) {
                    other.content.content.forEach((e) => {
                        let arr_text = [];
                        if (e.title) arr_text.push(e.title);
                        if (e.date) arr_text.push(e.date)
                        if (e.subtitle) arr_text.push(e.subtitle)
                        if (e.content) arr_text.push(e.content)
                        other_list.push(arr_text.join('\n'));
                    })
                }

                let dataAI = {
                    use_id: dataUser.idTimViec365,
                    use_name_php: use_name_php,
                    cv_title_php: cv_title_php,
                    cv_brithday_php: cv_brithday_php,
                    cv_address_php: cv_address_php,
                    use_mail_php: use_mail_php,
                    cv_phone_php: cv_phone_php,
                    cv_gioitinh_php: cv_gioitinh_php,
                    cv_muctieu_php: removeHtmlTag(cv_muctieu_php),
                    cv_kynang_php: removeHtmlTag(cv_kynang_php),
                    cv_chungchi_php: removeHtmlTag(cv_chungchi_php),
                    cv_sothich_php: removeHtmlTag(cv_sothich_php),
                    cv_nthchieu_php: removeHtmlTag(cv_nthchieu_php),
                    cv_giaithuong_php: removeHtmlTag(cv_giaithuong_php),

                    cv_hocvan_php: removeHtmlTag(edu_list.join(';')),
                    cv_exp_php: removeHtmlTag(exp_list.join(';')),
                    cv_hoatdong_php: removeHtmlTag(act_list.join(';')),
                    cv_duan_php: removeHtmlTag(proj_list.join(';')),
                    cv_ttthem_php: removeHtmlTag(other_list.join(';'))
                }
                let res = await serviceDataAI.updateDataSearchCandiCV(dataAI);
            } catch (e) {
                console.log(e);
            }
        }
        console.log("Tạo mới thành công ứng viên: " + idTimViec365 + " - Thời gian: " + functions.convertDate(now));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.register = async(req, res) => {
    try {
        // Lấy thông tin ứng viên
        let {
            account,
            password,
            userName,
            cv_title,
            cv_cate_id,
            cv_city_id,
            cv_address,
            email_contact,
            avatar,
            file,
            phone,
            city,
            district,
            use_address,
            birthday,
            hs_active,
            fromDevice,
            cv_infor
        } = req.body;
        const now = functions.getTimeNow();
        if (userName && account && password && cv_title && cv_cate_id && cv_city_id) {
            let matchUser = { type: { $ne: 1 } };

            if (await functions.checkEmail(account)) {
                matchUser.email = account;
            } else {
                matchUser.phoneTK = account;

                if (!phone) {
                    phone = account;
                }
            }
            let checkUser = await Users.findOne(matchUser, { _id: 1, idTimViec365: 1 }).lean();
            if (!checkUser) {
                const result = await addData(account, userName, password, phone, email_contact, city, district, use_address, birthday, cv_city_id, cv_cate_id, cv_title, hs_active, avatar, file, cv_infor);
                return functions.success(res, 'Thành công');
            } else {
                // Nếu có tài khoản rồi thì cập nhật thời gian để tìm kiếm
                await Users.updateOne({ _id: checkUser._id }, { $set: { updatedAt: now, lastActivedAt: new Date() } });
                // Bắn sang tìm kiếm AI
                let dataSearchAI = {
                    use_id: checkUser.idTimViec365,
                    use_update_time: now,
                };
                await serviceDataAI.createDataSearchCandi(dataSearchAI);
                return functions.success(res, 'Thành công');
            }
        }
        return functions.setError(res, 'Chưa truyền đầy đủ thông tin');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.update = async(req, res) => {
    try {
        // Lấy thông tin ứng viên khi đăng nhập
        let { account, updatedAt } = req.body;

        if (account) {
            let matchUser = { type: { $ne: 1 } };
            if (!updatedAt) {
                updatedAt = functions.getTimeNow();
            }
            if (await functions.checkEmail(account)) {
                matchUser.email = account;
            } else {
                matchUser.phoneTK = account;
            }
            let checkUser = await Users.findOne(matchUser, { _id: 1, idTimViec365: 1, createdAt: 1 }).lean();
            if (checkUser) {
                //Lưu thông tin vào database khi đăng nhập
                let dataUpdate = {
                    updatedAt,
                    lastActivedAt: new Date(),
                };
                // Bắn sang tìm kiếm AI
                let dataSearchAI = {
                    use_id: checkUser.idTimViec365,
                    use_update_time: updatedAt,
                };
                // Lấy thông tin ứng viên khi cập nhật thông tin liên hệ
                let { name, phone, email_contact, birthday, gender, married, city, district, address } = req.body;
                if (name && phone && email_contact && birthday && gender && married && city && district && address) {
                    dataUpdate.userName = name;
                    dataUpdate.phone = phone;
                    dataUpdate.emailContact = email_contact;
                    dataUpdate['inForPerson.account.birthday'] = birthday;
                    dataUpdate['inForPerson.account.gender'] = gender;
                    dataUpdate['inForPerson.account.married'] = married;
                    dataUpdate.city = city;
                    dataUpdate.district = district;
                    dataUpdate.address = address;
                }

                // Cập nhật ảnh đại diện
                let { avatar } = req.body;
                if (avatar) {
                    dataUpdate.avatarUser = await update_avatar(avatar, checkUser.createdAt, checkUser.idTimViec365);
                }
                // Lấy thông tin công việc mong muốn
                let { cv_title, cv_loaihinh_id, cv_capbac_id, experience, cv_cate_id, cv_city_id, cv_money_id } = req.body;
                if (cv_title && cv_loaihinh_id && cv_capbac_id && experience && cv_cate_id && cv_city_id && cv_money_id) {
                    dataUpdate['inForPerson.candidate.cv_title'] = cv_title;
                    dataUpdate['inForPerson.candidate.cv_loaihinh_id'] = cv_loaihinh_id;
                    dataUpdate['inForPerson.candidate.cv_capbac_id'] = cv_capbac_id;
                    dataUpdate['inForPerson.account.experience'] = experience;
                    dataUpdate['inForPerson.candidate.cv_cate_id'] = cv_cate_id.split(',').map(Number);
                    dataUpdate['inForPerson.candidate.cv_city_id'] = cv_city_id.split(',').map(Number);
                    dataUpdate['inForPerson.candidate.cv_money_id'] = cv_money_id;
                }

                // Lấy thông tin mục tiêu nghề nghiệp, kỹ năng bản thân
                let { cv_muctieu, cv_kynang } = req.body;
                if (cv_muctieu) {
                    dataUpdate['inForPerson.candidate.cv_muctieu'] = cv_muctieu;
                }
                if (cv_kynang) {
                    dataUpdate['inForPerson.candidate.cv_kynang'] = cv_kynang;
                }

                // Lấy thông tin người tham chiếu
                let { cv_tc_name, cv_tc_cv, cv_tc_phone, cv_tc_email, cv_tc_company } = req.body;
                if (cv_tc_name && cv_tc_cv && cv_tc_phone && cv_tc_email && cv_tc_company) {
                    dataUpdate['inForPerson.candidate.cv_tc_name'] = cv_tc_name;
                    dataUpdate['inForPerson.candidate.cv_tc_cv'] = cv_tc_cv;
                    dataUpdate['inForPerson.candidate.cv_tc_phone'] = cv_tc_phone;
                    dataUpdate['inForPerson.candidate.cv_tc_email'] = cv_tc_email;
                    dataUpdate['inForPerson.candidate.cv_tc_company'] = cv_tc_company;
                }
                await Users.updateOne({ _id: checkUser._id }, { $set: dataUpdate });


                let resAPI = await serviceDataAI.updateDataSearchCandi(dataSearchAI);
                return functions.success(res, 'Thành công');
            } else {
                let { account, password, userName, cv_title, cv_cate_id, cv_city_id, cv_address, email_contact, avatar, file, phone, city, district, use_address, birthday, hs_active, cv_infor } = req.body;
                const result = await addData(account, userName, password, phone, email_contact, city, district, use_address, birthday, cv_city_id, cv_cate_id, cv_title, hs_active, avatar, file, cv_infor);
                if (result) {
                    console.log('Thành công khi người dùng chưa có thông tin')
                }
                return functions.success(res, 'Thành công');
            }
            return functions.setError(res, 'Tài khoản chưa được đăng ký');
        }
        return functions.setError(res, 'Chưa truyền đầy đủ thông tin');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.update_list = async(req, res) => {
    try {
        // Lấy thông tin ứng viên khi đăng nhập
        let { account, updatedAt, list, type } = req.body;

        if (account) {
            let matchUser = { type: { $ne: 1 } };
            updatedAt = functions.getTimeNow();

            if (await functions.checkEmail(account)) {
                matchUser.email = account;
            } else {
                matchUser.phoneTK = account;
            }
            let checkUser = await Users.findOne(matchUser, { _id: 1, idTimViec365: 1 }).lean();
            if (checkUser) {
                //Lưu thông tin vào database khi đăng nhập
                let dataUpdate = {
                    updatedAt,
                    lastActivedAt: new Date(),
                };
                if (type == 'update_bc') {
                    dataUpdate['inForPerson.candidate.profileDegree'] = list;
                }
                if (type == 'update_language') {
                    dataUpdate['inForPerson.candidate.profileNgoaiNgu'] = list;
                }
                if (type == 'update_experience') {
                    dataUpdate['inForPerson.candidate.profileExperience'] = list;
                }

                await Users.updateOne({ _id: checkUser._id }, { $set: dataUpdate });

                // Bắn sang tìm kiếm AI
                let dataSearchAI = {
                    use_id: checkUser.idTimViec365,
                    use_update_time: updatedAt,
                };
                let resAPI = await serviceDataAI.updateDataSearchCandi(dataSearchAI);
                return functions.success(res, 'Thành công');
            }
            return functions.setError(res, 'Tài khoản chưa được đăng ký');
        }
        return functions.setError(res, 'Chưa truyền đầy đủ thông tin');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.update_cv = async(req, res) => {
    try {
        let { file } = req.body;
        const now = functions.getTimeNow();
        if (file != '') {
            file = file.replaceAll(' ', '%20');
            let typeOfFile = file.split('.').slice(-1);
            let dirFile = functions.folderImageCV(now);
            if (!fs.existsSync(dirFile)) {
                fs.mkdirSync(dirFile, { recursive: true });
            }
            nameFile = 'cv_' + now + '_' + idTimViec365;
            nameFileFull = nameFile + '.' + typeOfFile;
            const outputPath = `${dirFile}/${nameFileFull}`;
            // const linkFileHide = `${process.env.PORT_QLC}/pictures/cv/${functions.convertDate(now,true)}/${nameFileFull}`;
            const linkFileHide = '';
            functions.downloadFile(file, outputPath);
            const getMaxIdProfile = (await Profile.findOne({}, { hs_id: 1 }).sort({ hs_id: -1 }).limit(1).lean()) || {
                hs_id: 0,
            };
            let dataProfile = {
                hs_id: Number(getMaxIdProfile.hs_id) + 1,
                hs_use_id: idTimViec365,
                hs_name: nameFile,
                hs_link: nameFileFull,
                hs_link_hide: linkFileHide,
                hs_create_time: now,
                hs_active: hs_active,
            };
            await new Profile(dataProfile).save();
        }
    } catch (error) {}
};