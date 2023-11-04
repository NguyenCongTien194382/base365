const fnc = require('../services/functions');
const functions = require('../services/functions');
const City = require('../models/City');
const District = require('../models/District');
const CategoryTv365 = require('../models/Timviec365/CategoryJob');
const TagTv365 = require('../models/Timviec365/UserOnSite/Company/Keywords');
const NewTV365 = require('../models/Timviec365/UserOnSite/Company/New');
const LangCv = require('../models/Timviec365/CV/CVLang');
const CVDesign = require('../models/Timviec365/CV/CVDesign');
const TblModules = require('../models/Timviec365/TblModules');
const Users = require('../models/Users');
const tags = require('../models/Timviec365/TblTags');
const axios = require('axios')
    // lấy danh sach thành phố
exports.getDataCity = async(req, res, next) => {
    try {
        const cit_id = req.body.cit_id;
        let condition = {};
        if (cit_id) {
            condition = { _id: cit_id };
        }
        let city = await fnc.getDatafind(City, condition),
            data = [];

        for (let index = 0; index < city.length; index++) {
            const element = city[index];
            data.push({
                "cit_id": element._id,
                "cit_name": element.name,
                "cit_order": element.order,
                "cit_type": element.type,
                "cit_count": element.count,
                "cit_count_vl": element.countVl,
                "cit_count_vlch": element.countVlch,
                "postcode": element.postCode
            });
        }
        return fnc.success(res, "Lấy dữ liệu thành công", { data })

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách quận huyện theo id thành phố
exports.getDataDistrict = async(req, res, next) => {
    try {
        let idCity = req.body.cit_id;
        let condition = {};
        if (idCity) {
            condition.parent = idCity;
        } else {
            condition.parent = { $ne: 0 };
        }
        const lists = await fnc.getDatafind(District, condition);
        let district = [];
        for (let i = 0; i < lists.length; i++) {
            let item = lists[i];
            district.push({
                'cit_id': item._id,
                'cit_name': item.name,
                'cit_order': item.order,
                'cit_type': item.type,
                'cit_count': item.count,
                'cit_parent': item.parent
            });

        }
        return fnc.success(res, "Lấy dữ liệu thành công", { data: district })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách ngành nghề timviec365
exports.getDataCategoryTv365 = async(req, res, next) => {
    try {
        const active = req.body.active;
        const cat_only = req.body.cat_only;
        const cat_id = req.body.cat_id;

        let condition = {};
        if (active) {
            condition.cat_active = active;
        }
        if (cat_only) {
            condition.cat_only = cat_only;
        }
        if (cat_id) {
            condition.cat_id = cat_id;
        }
        const category = await CategoryTv365.find(condition).sort({ cat_name: 1 });
        return fnc.success(res, "Lấy dữ liệu thành công", { data: category })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy danh sách tag timviec365
exports.getDataTagTv365 = async(req, res, next) => {
    try {
        let type = req.body.type || "tagKey",
            cate_id = req.body.cate_id || null;
        let condition = {},
            data = [];

        if (type == 'tagKey') {
            condition.key_name = { $ne: "" };
            condition.key_cb_id = 0;
            condition.key_city_id = 0;
            condition.key_301 = "";
            condition.key_time = { $ne: 1604509200 };
        }
        if (cate_id != null) {
            condition.key_name = { $ne: "" };
            condition.key_cate_lq = cate_id;
            condition.key_cb_id = 0;
            condition.key_city_id = 0;
            condition.key_cate_id = 0;
            condition.key_err = 0;
            condition.key_301 = "";
        }

        const lists = await TagTv365.aggregate([
            { $match: condition },
            { $sort: { _id: -1 } },
            {
                $project: {
                    key_id: "$_id",
                    key_name: 1,
                    key_cate_lq: 1
                }
            }
        ]);

        return fnc.success(res, "Lấy dữ liệu thành công", { data: lists })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// lấy danh sách ngôn ngữ cv
let list_langcv_backup = [];
exports.getDataLangCV = async(req, res, next) => {
    try {
        let lists = [];
        if (list_langcv_backup.length) {
            lists = list_langcv_backup;
        } else {
            lists = await LangCv.find({}, {
                id: 1,
                name: 1,
                alias: 1
            }).lean();
        }
        for (let i = 0; i < lists.length; i++) {
            const element = lists[i];
            let nn;
            switch (element.id) {
                case 1:
                    nn = 0;
                    break;
                case 3:
                    nn = 1;
                    break;
                case 5:
                    nn = 2;
                    break;
                case 7:
                    nn = 3;
                    break;
                case 9:
                    nn = 4;
                    break;
                default:
                    break;
            }
            element.img = `https://timviec365.vn/images/nnn${nn}.png`;
        }

        return fnc.success(res, "Lấy dữ liệu thành công", { data: lists })
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy danh sách thiết kế cv
exports.getDataDesignCV = async(req, res, next) => {
    try {

        let list_design = await CVDesign.find({}, {
            name: 1,
            alias: 1
        }).lean();
        return fnc.success(res, "Lấy dữ liệu thành công", { data: list_design });
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// Lấy nội dung bảng modules để seo
exports.modules = async(req, res) => {
    try {
        const { moduleRequets } = req.body;
        if (moduleRequets) {
            const seo = await TblModules.findOne({
                module: moduleRequets
            }).lean();
            seo.sapo = await fnc.renderCDNImage(seo.sapo)
            return fnc.success(res, "Thông tin module", {
                data: seo
            });
        }
        return fnc.setError(res, "Không có tham số tìm kiếm");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }

}

exports.getDistrictTag = async(req, res) => {
    const city = req.body.city;
    const list = await TagTv365.aggregate([{
            $match: {
                key_city_id: Number(city),
                key_index: 1,
                key_name: ''
            }
        }, {
            $lookup: {
                from: 'District',
                localField: 'key_qh_id',
                foreignField: '_id',
                as: 'city'
            }
        },

        {
            $project: {
                cit_id: '$city._id',
                cit_name: '$city.name',
                cit_parent: '$city.parent'
            }
        }
    ]);
    return fnc.success(res, "Thông tin quận huyện tag", {
        list
    });

}

exports.getUserOnline = async(req, res) => {
    try {
        const { list_id, city_id, type } = req.body;
        console.log("getUserOnline", req.body)
        if (list_id) {

            let project, match, list;
            if (type == 1) {
                project = {
                    usc_logo: "$avatarUser",
                    usc_company: "$userName",
                    usc_id: "$idTimViec365",
                    usc_city: "$city",
                    usc_alias: "$alias",
                    chat365_id: "$_id",
                    usc_create_time: "$createdAt",
                    lastActivedAt: 1
                };
                match = {
                    _id: { $in: list_id.split(',').map(Number) },
                    usc_redirect: "",
                    type: type
                };
                list = await Users.aggregate([{
                        $match: match
                    },
                    { $sort: { _id: -1 } },
                    { $project: project }
                ]);

                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    const New = await NewTV365.findOne({
                        new_user_id: element.usc_id
                    }).sort({ new_id: -1 }).limit(1).lean();
                    element.new_title = New.new_title;
                }

                return fnc.success(res, 'Danh sách online', { data: list, total: list.length });
            } else if (type == 0) {
                project = {
                    use_logo: "$avatarUser",
                    use_first_name: "$userName",
                    use_id: "$idTimViec365",
                    cv_title: "$inForPerson.candidate.cv_title",
                    cv_city_id: "$alias",
                    chat365_id: "$_id",
                };
                match = {
                    _id: { $in: list_id.split(',') },
                    "inForPerson.candidate.use_show": 1
                };
                list = await Users.aggregate([{
                        $match: match
                    },
                    { $sort: { _id: -1 } },
                    { $project: project }
                ]);
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    const New = await NewTV365.findOne({
                        new_user_id: element.usc_id
                    }).sort({ new_id: -1 }).limit(1).lean();
                    element.new_title = New.new_title;
                }
                return fnc.success(res, 'Danh sách online', { data: list, total: list.length });
            }
            return functions.setError(res, "Data không hợp lệ")
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

let listUserBackup = [];
let listNewBackup = [];
exports.getDataUserOnline = async(req, res) => {
    try {
        listUserBackup = [];
        listNewBackup = [];
        // console.log("getDataUserOnline", req.body)
        const { list_id } = req.body;
        if (list_id) {
            let listUserId = list_id.split(",");
            let listUserIdFinal = [];
            for (let i = 0; i < listUserId.length; i++) {
                if (listUserId[i] && (!isNaN(listUserId[i]))) {
                    if (listUserId[i] == 3024090) {
                        console.log(new Date(), req.body)
                    }
                    listUserIdFinal.push(Number(listUserId[i]))
                }
            };
            listUserIdFinal = [...new Set(listUserIdFinal)];
            let listNtd = [];
            let listUv = [];

            let listUser = [];
            if (listUserIdFinal.length > 1) {
                listUser = await Users.find({ _id: { $in: listUserIdFinal }, idTimViec365: { $ne: 0 } }, {
                    password: 0,
                    configChat: 0,
                    "inForPerson.employee.ep_featured_recognition": 0
                }).lean();
            } else if (listUserIdFinal.length == 1) {
                let obj = listUserBackup.find((e) => e._id == listUserIdFinal[0]);
                if (!obj) {

                    listUser = await Users.find({ _id: listUserIdFinal[0], idTimViec365: { $ne: 0 } }, {
                        password: 0,
                        configChat: 0,
                        "inForPerson.employee.ep_featured_recognition": 0
                    });
                    if (listUser.length) {
                        listUserBackup.push(listUser[0]);
                    }
                } else {
                    listUser = [obj];

                }

            }

            listUv = listUser.filter((e => e.type != 1));
            listNtd = listUser.filter((e => e.type == 1));

            let listIdNtd = [];
            for (let i = 0; i < listNtd.length; i++) {
                listIdNtd.push(listNtd[i].idTimViec365);
            };

            let listNew = [];
            if (listIdNtd.length > 0) {
                if (listIdNtd.length == 1) {
                    let obj = listNewBackup.find((e) => e.new_user_id == listIdNtd[0]);
                    if (obj) {
                        listNew = [obj];
                        // console.log("Tái sử dụng tin thành công")
                    } else {
                        listNew = await NewTV365.find({
                            new_user_id: listIdNtd[0]
                        }, { new_title: 1, new_id: 1, new_user_id: 1 }).limit(1).lean();
                        if (listNew.length) {
                            listNewBackup.push(listNew[0]);
                        }
                    }
                } else {
                    listNew = await NewTV365.find({
                        new_user_id: { $in: listIdNtd }
                    }, { new_title: 1, new_id: 1, new_user_id: 1 }).lean();
                }
            }

            // listNewBackup
            let dataNtdFinal = [];
            let dataUvFinal = [];
            for (let i = 0; i < listNtd.length; i++) {

                let obj = listNtd[i];
                let flag = true;
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
                if (news) {
                    new_title = news.new_title;
                };
                if (req.body.ntd_city) {
                    if (obj.city != req.body.ntd_city) {
                        flag = false;
                    }
                }
                if (flag) {
                    dataNtdFinal.push({
                        chat365_id: obj._id,
                        usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        usc_company: obj.userName,
                        usc_alias: obj.alias,
                        new_title: new_title,
                        name: obj.userName,
                        usc_id: obj.idTimViec365,
                        usc_city: obj.city,
                        lastActivedAt: obj.lastActivedAt
                    });
                }
            }
            for (let i = 0; i < listUv.length; i++) {
                let obj = listUv[i];
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == listUv[i]);
                if (news) {
                    new_title = news.new_title;
                };
                let cv_city_id = [];
                let cv_title = "";
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                    cv_title = obj.inForPerson.candidate.cv_title;
                }
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                    cv_city_id = obj.inForPerson.candidate.cv_city_id;
                }
                let cv_cate_id = [];
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                    cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
                }
                let cv_exp = 0;
                if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                    cv_exp = obj.inForPerson.account.experience;
                };
                let flag = true;
                if (req.body.keyword) {
                    const keyword = String(req.body.keyword);
                    if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                        flag = false;
                    }
                };
                if (req.body.city_id && (req.body.city_id != '0')) {
                    if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                        flag = false;
                    }
                };
                if (req.body.cat_id && (req.body.cat_id != '0')) {
                    if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                        flag = false;
                    }
                };
                if (flag) {
                    dataUvFinal.push({
                        chat365_id: obj._id,
                        use_id: obj.idTimViec365,
                        use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        cv_city_id: cv_city_id,
                        cv_title: cv_title,
                        name: obj.userName,
                        cv_cate_id: cv_cate_id,
                        cv_exp: cv_exp,
                        use_create_time: obj.createdAt,
                        use_city: obj.city,
                        use_quanhuyen: obj.district,
                        use_update_time: obj.updatedAt,
                        lastActivedAt: obj.lastActivedAt,
                        link: `https://timviec365.vn/ung-vien/${functions.renderAlias(obj.userName)}-uv${obj.idTimViec365}.html`
                    });
                }
            }
            return fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal });
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

let listNtd_backup = [];
let listUv_backup = [];
let listNew_backup = [];
let count = 0;
exports.getDataUserOnline2 = async(req, res) => {
    try {
        // console.log("getDataUserOnline2", req.body);
        let keys = Object.keys(req.body);
        for (let i = 0; i < keys.length; i++) {
            if (!isNaN(keys[i])) {
                return false;
            }
        }
        let t = new Date();
        let t2 = new Date();
        let listNtd = [];
        let listUv = [];
        let listUserOnlineId = req.body.list_id;
        listUserOnlineId = listUserOnlineId ? listUserOnlineId.split(',').map(Number) : [];
        // console.log("Danh sách id online man ứng viên", req.body);
        listUv = listUv_backup;
        listNtd = listNtd_backup;

        // let temp_listNtd = [];
        // let temp_listUv = [];
        // for (let i = 0; i < 50; i++) {
        //     if (listUv[i]) {
        //         temp_listUv.push(listUv[i]);
        //     }
        //     if (listNtd[i]) {
        //         temp_listNtd.push(listNtd[i]);
        //     }
        // };
        // listNtd = temp_listNtd;
        // listUv = temp_listUv;

        let listNew = listNew_backup;
        let dataNtdFinal = [];
        let dataUvFinal = [];
        for (let i = 0; i < listNtd.length; i++) {
            let flag = true;
            let obj = listNtd[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
            if (news) {
                new_title = news.new_title;
            };
            if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                if (obj.city != req.body.ntd_city) {
                    flag = false;
                }
            }
            if (flag) {
                dataNtdFinal.push({
                    chat365_id: obj._id,
                    usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    usc_company: obj.userName,
                    usc_alias: obj.alias,
                    new_title: new_title,
                    name: obj.userName,
                    usc_id: obj.idTimViec365,
                    usc_city: obj.city,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }
        let flagNtd = true;
        for (let i = 0; i < listUv.length; i++) {
            let obj = listUv[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == listUv[i]);
            if (news) {
                new_title = news.new_title;
            };
            let cv_city_id = [];
            let cv_title = "";
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                cv_title = obj.inForPerson.candidate.cv_title;
            }
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                cv_city_id = obj.inForPerson.candidate.cv_city_id;
            }
            let cv_cate_id = [];
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
            }
            let cv_exp = 0;
            if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                cv_exp = obj.inForPerson.account.experience;
            }
            let flag = true;
            if (req.body.keyword) {
                const keyword = String(req.body.keyword);
                flagNtd = false;
                if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                    flag = false;
                }
            };
            if (req.body.city_id) {
                flagNtd = false;
                if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                    flag = false;
                }
            };
            if (req.body.cat_id) {
                flagNtd = false;
                if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                    flag = false;
                }
            };
            if (listUserOnlineId.length > 0) {
                if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                    flag = false;
                }
            }
            if (flag) {
                dataUvFinal.push({
                    chat365_id: obj._id,
                    use_id: obj.idTimViec365,
                    use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    cv_city_id: cv_city_id,
                    cv_title: cv_title,
                    name: obj.userName,
                    cv_cate_id: cv_cate_id,
                    cv_exp: cv_exp,
                    use_create_time: obj.createdAt,
                    use_city: obj.city,
                    use_quanhuyen: obj.district,
                    use_update_time: obj.updatedAt,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }

        let flagSendResponseAgain = false;
        if (listNew_backup.length == 0) {
            flagSendResponseAgain = true;
        };
        if (!flagSendResponseAgain) {
            if (flagNtd) {
                fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal, time: t2 - t });
            } else {
                fnc.success(res, 'Danh sách online', { dataUvFinal, time: t2 - t });
            }
        }

        // ---- 
        //let list_id = await axios.get('http://43.239.223.142:9020/takelistuseronline');
        //let listUserId = list_id.data.listOnline;
        let flagChange = true;
        if (count % 20 != 0) {
            flagChange = false;
        };
        if (flagSendResponseAgain) {
            flagChange = true;
        };
        if (flagChange) {
            let list_id = await Users.find({ isOnline: 1 }, { _id: 1 }).lean();
            let listUserIdFinal = [];
            for (let i = 0; i < list_id.length; i++) {
                if (list_id[i] && (!isNaN(list_id[i]._id))) {
                    listUserIdFinal.push(Number(list_id[i]._id))
                }
            };
            listUserIdFinal = [...new Set(listUserIdFinal)];
            let condition = { _id: { $in: listUserIdFinal }, idTimViec365: { $ne: 0 }, type: 1 };
            if (req.body.type) {
                condition.type = { $ne: 1 };
            }
            let listUser = await Users.find(condition, {
                password: 0,
                configChat: 0,
                fromDevice: 0,
                time_login: 0,
                role: 0,
                latitude: 0,
                longtitude: 0,
                idQLC: 0,
                chat365_secret: 0,
                scan_base365: 0,
                sharePermissionId: 0,
                inforRN365: 0,
                scan: 0,
                "inForPerson.employee": 0
            }).sort({ _id: -1 }).lean();

            let listUv_backup_pre = listUser.filter((e => e.type != 1));
            let listNtd_backup_pre = listUser.filter((e => e.type == 1));
            if (listNtd_backup_pre.length > 0) {
                listNtd_backup = listNtd_backup_pre;
            }
            if (listUv_backup_pre.length > 0) {
                listUv_backup = listUv_backup_pre;
            }
            let listIdNtd = [];
            for (let i = 0; i < listNtd_backup.length; i++) {
                listIdNtd.push(listNtd_backup[i].idTimViec365);
            }
            listNew_backup = await NewTV365.find({
                new_user_id: { $in: listIdNtd }
            }, { new_title: 1 }).lean();
        }



        // cập nhật lại mảng để phục vụ gọi lại 
        if (flagSendResponseAgain) {
            listUv = listUv_backup;
            listNtd = listNtd_backup;
            listNew = listNew_backup;

            // giới hạn số kết quả trả về 
            // for (let i = 0; i < 50; i++) {
            //     if (listUv[i]) {
            //         temp_listUv.push(listUv[i]);
            //     }
            //     if (listNtd[i]) {
            //         temp_listNtd.push(listNtd[i]);
            //     }
            // };
            // listNtd = temp_listNtd;
            // listUv = temp_listUv;

            listNew = listNew_backup;
            dataNtdFinal = [];
            dataUvFinal = [];
            for (let i = 0; i < listNtd.length; i++) {
                let flag = true;
                let obj = listNtd[i];
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
                if (news) {
                    new_title = news.new_title;
                };
                if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                    if (obj.city != req.body.ntd_city) {
                        flag = false;
                    }
                }
                if (flag) {
                    dataNtdFinal.push({
                        chat365_id: obj._id,
                        usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        usc_company: obj.userName,
                        usc_alias: obj.alias,
                        new_title: new_title,
                        name: obj.userName,
                        usc_id: obj.idTimViec365,
                        usc_city: obj.city,
                        lastActivedAt: obj.lastActivedAt
                    });
                }
            }
            let flagNtd = true;

            for (let i = 0; i < listUv.length; i++) {
                let obj = listUv[i];
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == listUv[i]);
                if (news) {
                    new_title = news.new_title;
                };
                let cv_city_id = [];
                let cv_title = "";
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                    cv_title = obj.inForPerson.candidate.cv_title;
                }
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                    cv_city_id = obj.inForPerson.candidate.cv_city_id;
                }
                let cv_cate_id = [];
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                    cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
                }
                let cv_exp = 0;
                if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                    cv_exp = obj.inForPerson.account.experience;
                }
                let flag = true;
                if (req.body.keyword) {
                    const keyword = String(req.body.keyword);
                    flagNtd = false;
                    if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                        flag = false;
                    }
                };
                if (req.body.city_id) {
                    flagNtd = false;
                    if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                        flag = false;
                    }
                };
                if (req.body.cat_id) {
                    flagNtd = false;
                    if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                        flag = false;
                    }
                };
                if (listUserOnlineId.length > 0) {

                    if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                        flag = false;
                    }
                }
                if (flag) {
                    dataUvFinal.push({
                        chat365_id: obj._id,
                        use_id: obj.idTimViec365,
                        use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        cv_city_id: cv_city_id,
                        cv_title: cv_title,
                        name: obj.userName,
                        cv_cate_id: cv_cate_id,
                        cv_exp: cv_exp,
                        use_create_time: obj.createdAt,
                        use_city: obj.city,
                        use_quanhuyen: obj.district,
                        use_update_time: obj.updatedAt,
                        lastActivedAt: obj.lastActivedAt
                    });
                }
            }

            // console.log("send again", new Date());
            if (flagNtd) {
                fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal, time: t2 - t });
            } else {
                fnc.success(res, 'Danh sách online', { dataUvFinal, time: t2 - t });
            }
        }

        count = count + 1;
        return true;
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getDataUserOnline3 = async(req, res) => {
    try {
        let t = new Date();
        let t2 = new Date();
        let listNtd = [];
        let listUv = [];
        // console.log(req.body);
        let listUserOnlineId = req.body.list_id;
        listUserOnlineId = listUserOnlineId ? listUserOnlineId.split(',').map(Number) : [];
        // console.log("Danh sách id online man ứng viên", req.body);
        listUv = listUv_backup;
        listNtd = listNtd_backup;

        // let temp_listNtd = [];
        // let temp_listUv = [];
        // for (let i = 0; i < 50; i++) {
        //     if (listUv[i]) {
        //         temp_listUv.push(listUv[i]);
        //     }
        //     if (listNtd[i]) {
        //         temp_listNtd.push(listNtd[i]);
        //     }
        // };
        // listNtd = temp_listNtd;
        // listUv = temp_listUv;

        let listNew = listNew_backup;
        let dataNtdFinal = [];
        let dataUvFinal = [];
        for (let i = 0; i < listNtd.length; i++) {
            let flag = true;
            let obj = listNtd[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
            if (news) {
                new_title = news.new_title;
            };
            if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                if (obj.city != req.body.ntd_city) {
                    flag = false;
                }
            }
            if (flag) {
                dataNtdFinal.push({
                    chat365_id: obj._id,
                    usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    usc_company: obj.userName,
                    usc_alias: obj.alias,
                    new_title: new_title,
                    name: obj.userName,
                    usc_id: obj.idTimViec365,
                    usc_city: obj.city,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }
        let flagNtd = true;
        for (let i = 0; i < listUv.length; i++) {
            let obj = listUv[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == listUv[i]);
            if (news) {
                new_title = news.new_title;
            };
            let cv_city_id = [];
            let cv_title = "";
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                cv_title = obj.inForPerson.candidate.cv_title;
            }
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                cv_city_id = obj.inForPerson.candidate.cv_city_id;
            }
            let cv_cate_id = [];
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
            }
            let cv_exp = 0;
            if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                cv_exp = obj.inForPerson.account.experience;
            }
            let flag = true;
            if (req.body.keyword) {
                const keyword = String(req.body.keyword);
                flagNtd = false;
                if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                    flag = false;
                }
            };
            if (req.body.city_id) {
                flagNtd = false;
                if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                    flag = false;
                }
            };
            if (req.body.cat_id) {
                flagNtd = false;
                if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                    flag = false;
                }
            };
            if (listUserOnlineId.length > 0) {
                if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                    flag = false;
                }
            }
            if (flag) {
                dataUvFinal.push({
                    chat365_id: obj._id,
                    use_id: obj.idTimViec365,
                    use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    cv_city_id: cv_city_id,
                    cv_title: cv_title,
                    name: obj.userName,
                    cv_cate_id: cv_cate_id,
                    cv_exp: cv_exp,
                    use_create_time: obj.createdAt,
                    use_city: obj.city,
                    use_quanhuyen: obj.district,
                    use_update_time: obj.updatedAt,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }

        let flagSendResponseAgain = false;
        if (listNew_backup.length == 0) {
            flagSendResponseAgain = true;
        };
        if (!flagSendResponseAgain) {
            if (flagNtd) {
                fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal, time: t2 - t });
            } else {
                fnc.success(res, 'Danh sách online', { dataUvFinal, time: t2 - t });
            }
        }

        // ---- 
        //let list_id = await axios.get('http://43.239.223.142:9020/takelistuseronline');
        //let listUserId = list_id.data.listOnline;
        let list_id = await Users.find({ isOnline: 1 }, { _id: 1 }).lean();
        let listUserIdFinal = [];
        for (let i = 0; i < list_id.length; i++) {
            if (list_id[i] && (!isNaN(list_id[i]._id))) {
                listUserIdFinal.push(Number(list_id[i]._id))
            }
        };
        listUserIdFinal = [...new Set(listUserIdFinal)];
        let condition = { _id: { $in: listUserIdFinal }, idTimViec365: { $ne: 0 }, type: 1 };
        if (req.body.type) {
            condition.type = { $ne: 1 };
        }
        let listUser = await Users.find(condition, {
            password: 0,
            configChat: 0,
            fromDevice: 0,
            time_login: 0,
            role: 0,
            latitude: 0,
            longtitude: 0,
            idQLC: 0,
            chat365_secret: 0,
            scan_base365: 0,
            sharePermissionId: 0,
            inforRN365: 0,
            scan: 0,
            "inForPerson.employee": 0
        }).sort({ _id: -1 }).lean();

        let listUv_backup_pre = listUser.filter((e => e.type != 1));
        let listNtd_backup_pre = listUser.filter((e => e.type == 1));
        if (listNtd_backup_pre.length > 0) {
            listNtd_backup = listNtd_backup_pre;
        }
        if (listUv_backup_pre.length > 0) {
            listUv_backup = listUv_backup_pre;
        }
        let listIdNtd = [];
        for (let i = 0; i < listNtd_backup.length; i++) {
            listIdNtd.push(listNtd_backup[i].idTimViec365);
        }
        listNew_backup = await NewTV365.find({
            new_user_id: { $in: listIdNtd }
        }, { new_title: 1 }).lean();


        // cập nhật lại mảng để phục vụ gọi lại 
        if (flagSendResponseAgain) {
            listUv = listUv_backup;
            listNtd = listNtd_backup;
            listNew = listNew_backup;

            // giới hạn số kết quả trả về 
            // for (let i = 0; i < 50; i++) {
            //     if (listUv[i]) {
            //         temp_listUv.push(listUv[i]);
            //     }
            //     if (listNtd[i]) {
            //         temp_listNtd.push(listNtd[i]);
            //     }
            // };
            // listNtd = temp_listNtd;
            // listUv = temp_listUv;

            listNew = listNew_backup;
            dataNtdFinal = [];
            dataUvFinal = [];
            for (let i = 0; i < listNtd.length; i++) {
                let flag = true;
                let obj = listNtd[i];
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
                if (news) {
                    new_title = news.new_title;
                };
                if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                    if (obj.city != req.body.ntd_city) {
                        flag = false;
                    }
                }
                if (flag) {
                    dataNtdFinal.push({
                        chat365_id: obj._id,
                        usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        usc_company: obj.userName,
                        usc_alias: obj.alias,
                        new_title: new_title,
                        name: obj.userName,
                        usc_id: obj.idTimViec365,
                        usc_city: obj.city,
                        lastActivedAt: obj.lastActivedAt
                    });
                }
            }
            let flagNtd = true;

            for (let i = 0; i < listUv.length; i++) {
                let obj = listUv[i];
                let new_title = "";
                let news = listNew.find((e) => e.new_user_id == listUv[i]);
                if (news) {
                    new_title = news.new_title;
                };
                let cv_city_id = [];
                let cv_title = "";
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                    cv_title = obj.inForPerson.candidate.cv_title;
                }
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                    cv_city_id = obj.inForPerson.candidate.cv_city_id;
                }
                let cv_cate_id = [];
                if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                    cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
                }
                let cv_exp = 0;
                if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                    cv_exp = obj.inForPerson.account.experience;
                }
                let flag = true;
                if (req.body.keyword) {
                    const keyword = String(req.body.keyword);
                    flagNtd = false;
                    if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                        flag = false;
                    }
                };
                if (req.body.city_id) {
                    flagNtd = false;
                    if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                        flag = false;
                    }
                };
                if (req.body.cat_id) {
                    flagNtd = false;
                    if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                        flag = false;
                    }
                };
                if (listUserOnlineId.length > 0) {

                    if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                        flag = false;
                    }
                }
                if (flag) {
                    dataUvFinal.push({
                        chat365_id: obj._id,
                        use_id: obj.idTimViec365,
                        use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                        cv_city_id: cv_city_id,
                        cv_title: cv_title,
                        name: obj.userName,
                        cv_cate_id: cv_cate_id,
                        cv_exp: cv_exp,
                        use_create_time: obj.createdAt,
                        use_city: obj.city,
                        use_quanhuyen: obj.district,
                        use_update_time: obj.updatedAt,
                        lastActivedAt: obj.lastActivedAt
                    });
                }
            }

            // console.log("send again", new Date());
            if (flagNtd) {
                fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal, time: t2 - t });
            } else {
                fnc.success(res, 'Danh sách online', { dataUvFinal, time: t2 - t });
            }
        }

        return true;
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

let listUserBackUpOnlineOne = [];
exports.getDataUserOnlineOne = async(req, res) => {
    try {
        listUserBackUpOnlineOne = [];
        // console.log("getDataUserOnlineOne", req.body)
        let listNtd = [];
        let listUv = [];
        let listNew = [];
        let listUserOnlineId = req.body.list_id;
        listUserOnlineId = listUserOnlineId ? listUserOnlineId.split(',').map(Number) : [];
        listUserOnlineId = [...new Set(listUserOnlineId)];
        let condition = { _id: { $in: listUserOnlineId }, idTimViec365: { $ne: 0 }, type: 1 };
        if (req.body.city_id) {
            condition = {...condition, "inForPerson.candidate.cv_city_id": Number(req.body.city_id) }
        };
        if (req.body.cat_id) {
            condition = {...condition, "inForPerson.candidate.cv_cate_id": Number(req.body.cat_id) }
        }
        if (req.body.type) {
            condition.type = { $ne: 1 };
            condition = {...condition, "inForPerson.candidate.percents": { $gte: 45 }, "inForPerson.candidate.use_show": 1 }
        };
        let listUser = [];
        if (listUserOnlineId.length == 1) {
            let obj_check = listUserBackUpOnlineOne.find((e) => e._id == listUserOnlineId[0]);
            if (obj_check) {
                listUser = [obj_check];
                //console.log("Tái sử dụng thành công getUserOnlineOne", new Date())
            } else {
                listUser = await Users.find(condition, {
                    password: 0,
                    configChat: 0,
                    fromDevice: 0,
                    time_login: 0,
                    role: 0,
                    latitude: 0,
                    longtitude: 0,
                    idQLC: 0,
                    chat365_secret: 0,
                    scan_base365: 0,
                    sharePermissionId: 0,
                    inforRN365: 0,
                    scan: 0,
                    "inForPerson.employee": 0
                }).limit(1).lean();
                for (let i = 0; i < listUser.length; i++) {
                    listUserBackUpOnlineOne.push(listUser[i]);
                }
            }
        } else if (listUserOnlineId.length > 0) {
            listUser = await Users.find(condition, {
                password: 0,
                configChat: 0,
                fromDevice: 0,
                time_login: 0,
                role: 0,
                latitude: 0,
                longtitude: 0,
                idQLC: 0,
                chat365_secret: 0,
                scan_base365: 0,
                sharePermissionId: 0,
                inforRN365: 0,
                scan: 0,
                "inForPerson.employee": 0
            }).lean();
            for (let i = 0; i < listUser.length; i++) {
                listUserBackUpOnlineOne.push(listUser[i]);
            }
        }

        listUv = listUser.filter((e => e.type != 1));
        listNtd = listUser.filter((e => e.type == 1));

        let listIdNtd = [];
        for (let i = 0; i < listNtd.length; i++) {
            listIdNtd.push(listNtd[i].idTimViec365);
        };
        if (listIdNtd.length) {
            listNew = await NewTV365.find({
                new_user_id: { $in: listIdNtd }
            }, { new_title: 1 }).lean();
        }
        let dataNtdFinal = [];
        let dataUvFinal = [];
        for (let i = 0; i < listNtd.length; i++) {
            let flag = true;
            let obj = listNtd[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
            if (news) {
                new_title = news.new_title;
            };
            if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                if (obj.city != req.body.ntd_city) {
                    flag = false;
                }
            }
            if (flag) {
                dataNtdFinal.push({
                    chat365_id: obj._id,
                    usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    usc_company: obj.userName,
                    usc_alias: obj.alias,
                    new_title: new_title,
                    name: obj.userName,
                    usc_id: obj.idTimViec365,
                    usc_city: obj.city,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }
        let flagNtd = true;
        for (let i = 0; i < listUv.length; i++) {
            let obj = listUv[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == listUv[i]);
            if (news) {
                new_title = news.new_title;
            };
            let cv_city_id = [];
            let cv_title = "";
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                cv_title = obj.inForPerson.candidate.cv_title;
            }
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                cv_city_id = obj.inForPerson.candidate.cv_city_id;
            }
            let cv_cate_id = [];
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
            }
            let cv_exp = 0;
            if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                cv_exp = obj.inForPerson.account.experience;
            }
            let flag = true;
            if (req.body.keyword) {
                const keyword = String(req.body.keyword);
                flagNtd = false;
                if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                    flag = false;
                }
            };
            if (req.body.city_id) {
                flagNtd = false;
                if (!cv_city_id.find((e) => e == Number(req.body.city_id))) {
                    flag = false;
                }
            };
            if (req.body.cat_id) {
                flagNtd = false;
                if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                    flag = false;
                }
            };
            if (listUserOnlineId.length > 0) {
                if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                    flag = false;
                }
            }
            if (flag) {
                dataUvFinal.push({
                    chat365_id: obj._id,
                    use_id: obj.idTimViec365,
                    use_logo: functions.getImageUv(obj.createdAt, obj.avatarUser),
                    cv_city_id: cv_city_id,
                    cv_title: cv_title,
                    name: obj.userName,
                    cv_cate_id: cv_cate_id,
                    cv_exp: cv_exp,
                    use_create_time: obj.createdAt,
                    use_city: obj.city,
                    use_quanhuyen: obj.district,
                    use_update_time: obj.updatedAt,
                    lastActivedAt: obj.lastActivedAt,
                    link: `https://timviec365.vn/ung-vien/${functions.renderAlias(obj.userName)}-uv${obj.idTimViec365}.html`
                });
            }
        }

        // console.log(dataUvFinal);
        if (flagNtd) {
            return fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal, listUser });
        } else {
            return fnc.success(res, 'Danh sách online', { dataUvFinal, listUser });
        }
    } catch (error) {
        console.log("getDataUserOnlineOne", error)
        return functions.setError(res, error)
    }
}

exports.getDataUserOnlineOneCity = async(req, res) => {
    try {
        console.log("getDataUserOnlineOneCity", req.body);
        let listNtd = [];
        let listUv = [];
        let listNew = [];
        let listUserOnlineId = req.body.list_id;
        listUserOnlineId = listUserOnlineId ? listUserOnlineId.split(',').map(Number) : [];
        listUserOnlineId = [...new Set(listUserOnlineId)];
        let condition = { _id: { $in: listUserOnlineId }, idTimViec365: { $ne: 0 }, type: 1 };
        if (req.body.type) {
            condition.type = { $ne: 1 };
            condition = {...condition, "inForPerson.candidate.percents": { $gte: 45 }, "inForPerson.candidate.use_show": 1 }
        };
        let listUser = await Users.find(condition, {
            password: 0,
            configChat: 0,
            fromDevice: 0,
            time_login: 0,
            role: 0,
            latitude: 0,
            longtitude: 0,
            idQLC: 0,
            chat365_secret: 0,
            scan_base365: 0,
            sharePermissionId: 0,
            inforRN365: 0,
            scan: 0,
            "inForPerson.employee": 0
        }).sort({ _id: -1 }).lean();

        listUv = listUser.filter((e => e.type != 1));
        listNtd = listUser.filter((e => e.type == 1));

        let listIdNtd = [];
        for (let i = 0; i < listNtd.length; i++) {
            listIdNtd.push(listNtd[i].idTimViec365);
        }
        listNew = await NewTV365.find({
            new_user_id: { $in: listIdNtd }
        }, { new_title: 1 }).lean();

        let dataNtdFinal = [];
        let dataUvFinal = [];
        for (let i = 0; i < listNtd.length; i++) {
            let flag = true;
            let obj = listNtd[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == obj.idTimViec365);
            if (news) {
                new_title = news.new_title;
            };
            if (req.body.ntd_city && (!isNaN(Number(req.body.ntd_city)))) {
                if (obj.city != req.body.ntd_city) {
                    flag = false;
                }
            }
            if (flag) {
                dataNtdFinal.push({
                    chat365_id: obj._id,
                    usc_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    usc_company: obj.userName,
                    usc_alias: obj.alias,
                    new_title: new_title,
                    name: obj.userName,
                    usc_id: obj.idTimViec365,
                    usc_city: obj.city,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }
        let flagNtd = true;
        for (let i = 0; i < listUv.length; i++) {
            let obj = listUv[i];
            let new_title = "";
            let news = listNew.find((e) => e.new_user_id == listUv[i]);
            if (news) {
                new_title = news.new_title;
            };
            let cv_city_id = [];
            let cv_title = "";
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) {
                cv_title = obj.inForPerson.candidate.cv_title;
            }
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) {
                cv_city_id = obj.inForPerson.candidate.cv_city_id;
            }
            let cv_cate_id = [];
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) {
                cv_cate_id = obj.inForPerson.candidate.cv_cate_id;
            }
            let cv_exp = 0;
            if (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) {
                cv_exp = obj.inForPerson.account.experience;
            }
            let flag = true;
            if (req.body.keyword) {
                const keyword = String(req.body.keyword);
                flagNtd = false;
                if (!cv_title.includes(keyword) && (!obj.userName.includes(keyword))) {
                    flag = false;
                }
            };
            let city_id = Number(req.body.city_id);
            if (!req.body.city_id) {
                city_id = 1;
            };
            if (city_id == 0) {
                city_id = 1;
            }
            if (req.body.city_id) {
                flagNtd = false;
                if (!cv_city_id.find((e) => e == city_id)) {
                    flag = false;
                }
            };
            if (req.body.cat_id) {
                flagNtd = false;
                if (!cv_cate_id.find((e) => e == Number(req.body.cat_id))) {
                    flag = false;
                }
            };
            if (listUserOnlineId.length > 0) {
                if (listUserOnlineId.indexOf(Number(obj._id)) == -1) {
                    flag = false;
                }
            }
            if (flag) {
                dataUvFinal.push({
                    chat365_id: obj._id,
                    use_id: obj.idTimViec365,
                    use_logo: functions.getUrlLogoCompany(obj.createdAt, obj.avatarUser),
                    cv_city_id: cv_city_id,
                    cv_title: cv_title,
                    name: obj.userName,
                    cv_cate_id: cv_cate_id,
                    cv_exp: cv_exp,
                    use_create_time: obj.createdAt,
                    use_city: obj.city,
                    use_quanhuyen: obj.district,
                    use_update_time: obj.updatedAt,
                    lastActivedAt: obj.lastActivedAt
                });
            }
        }

        console.log(dataUvFinal);
        if (flagNtd) {
            return fnc.success(res, 'Danh sách online', { dataNtdFinal, dataUvFinal });
        } else {
            return fnc.success(res, 'Danh sách online', { dataUvFinal });
        }
    } catch (error) {
        console.log("getDataUserOnlineOne", error)
        return functions.setError(res, error)
    }
}

exports.getTblTag = async(req, res) => {
    const list = await tags.find();
    return fnc.success(res, "danh sách tbl tag", {
        data: list
    });
}