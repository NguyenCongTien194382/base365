const Users = require('../../../models/Users');
const functions = require('../../../services/functions');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const GhimHistory = require("../../../models/Timviec365/UserOnSite/Company/GhimHistory");
const applyForJob = require('../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const NewTV365Deleted = require('../../../models/Timviec365/UserOnSite/Company/NewDeleted');

const axios = require('axios')
    // Service
const service = require('../../../services/timviec365/new');
const serviceCompany = require('../../../services/timviec365/company');

const slugify = require('slugify');

const serviceDataAI = require('../../../services/timviec365/dataAI');
// đăng tin
exports.postNewTv365 = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = request.new_user_id,
            company = await Users.findOne({ idTimViec365: idCompany, type: 1 }).lean(); //Thông tin NTD;
        if (company) {

            let new_title = request.new_title,
                new_cat_id = request.new_cat_id,
                new_so_luong = request.new_so_luong,
                new_cap_bac = request.new_cap_bac,
                new_hinh_thuc = request.new_hinh_thuc,
                new_city = request.new_city,
                new_qh = request.new_qh,
                new_addr = request.new_addr,
                new_money_unit = request.new_money_unit,
                new_hoahong = request.new_hoahong,
                new_money = request.new_money,
                new_tgtv = request.new_tgtv,
                new_money_type = request.new_money_type,
                new_money_max = request.new_money_max ? request.new_money_max : 0,
                new_money_min = request.new_money_min ? request.new_money_min : 0,
                new_mota = request.new_mota,
                new_yeucau = request.new_yeucau,
                new_exp = request.new_exp,
                new_bang_cap = request.new_bang_cap,
                new_gioi_tinh = request.new_gioi_tinh,
                new_quyenloi = request.new_quyenloi,
                new_video_type = Number(request.new_video_type),
                new_ho_so = request.new_hoso,
                new_han_nop = request.new_han_nop,
                usc_name = request.usc_name,
                usc_name_add = request.usc_name_add,
                usc_name_phone = request.usc_name_phone,
                usc_name_email = request.usc_name_email,
                linkVideo = request.linkVideo || "",
                now = functions.getTimeNow(),
                video = '',
                link = '',
                // mảng chứa danh sách ảnh của tin
                listImg = [];


            if (new_title && new_cat_id && new_so_luong && new_cap_bac && new_hinh_thuc && new_city && new_money_unit && new_mota && new_yeucau && new_exp && new_bang_cap && new_gioi_tinh && new_quyenloi && new_han_nop && new_money_type) {
                // Check trùng tiêu đề
                if (idCompany != -1 && !await service.checkExistTitle(idCompany, new_title)) {
                    return functions.setError(res, 'Tiêu đề đã tồn tại');
                }

                // Check ký tự đặc biệt trong tiêu đề
                if (await service.checkSpecalCharacter(new_title)) {
                    return functions.setError(res, 'Tiêu đề không cho phép chứa ký tự đặc biệt');
                }

                // Check từ khóa nằm trong tiêu đề
                if (!await service.foundKeywordHot(new_title)) {
                    return functions.setError(res, "Tiêu đề tin không được chứa các từ Hot, tuyển gấp, cần gấp, lương cao");
                }

                // Check thời gian hạn nộp
                if (!await functions.checkTime(new_han_nop)) {
                    return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại')
                }

                // Check định dạng sđt và email
                // if (!await functions.checkEmail(usc_name_email) || !await functions.checkPhoneNumber(usc_name_phone)) {
                //     return functions.setError(res, 'Email hoặc Số điện thoại không đúng định dạng', 500)
                // }

                // Xử lý giá trị của mức lương qua loại lương
                const getMoney = service.getMoney(new_money_type, new_money, new_money_max, new_money_min),
                    money = getMoney.money,
                    maxValue = getMoney.maxValue,
                    minValue = getMoney.minValue;

                // Lấy tag
                const takeData = await service.recognition_tag_tin(new_cat_id, new_title, new_mota, new_yeucau),
                    new_lv = takeData.length > 0 ? takeData[0].name_tag : null;

                // Xử lý data
                const newMax = await NewTV365.findOne({}, { new_id: 1 }).sort({ new_id: -1 }).limit(1).lean();

                // Xử lý alias
                const new_alias = slugify(new_title, {
                    replacement: '-', // Ký tự thay thế khoảng trắng và các ký tự đặc biệt
                    lower: true, // Chuyển thành chữ thường
                    strict: true // Loại bỏ các ký tự không hợp lệ
                });
                const new_id = Number(newMax.new_id) + 1;
                const newTV = new NewTV365({
                    new_id: new_id,
                    new_title: new_title,
                    new_user_id: idCompany,
                    new_alias: new_alias,
                    new_cat_id: new_cat_id.split(',').map(Number),
                    new_city: new_city.split(',').map(Number),
                    new_qh_id: new_qh.split(',').map(Number),
                    new_addr: new_addr,
                    new_money: new_money,
                    new_cap_bac: new_cap_bac,
                    new_exp: new_exp,
                    new_gioi_tinh: new_gioi_tinh,
                    new_bang_cap: new_bang_cap,
                    new_so_luong: new_so_luong,
                    new_hinh_thuc: new_hinh_thuc,
                    new_create_time: now,
                    new_update_time: now,
                    new_active: Number(idCompany) != -1 ? 2 : 0,
                    new_han_nop: new_han_nop,
                    new_mota: new_mota,
                    new_yeucau: new_yeucau,
                    new_quyenloi: new_quyenloi,
                    new_ho_so: new_ho_so,
                    new_hoahong: new_hoahong,
                    new_tgtv: new_tgtv,
                    new_lv: new_lv,
                    nm_type: new_money_type,
                    nm_min_value: new_money_min,
                    nm_max_value: new_money_max,
                    nm_unit: new_money_unit,
                    link_video: linkVideo
                });
                await newTV.save();

                //Đẩy data sang AI
                serviceDataAI.addNew(new_id, new_title, new_addr, new_city, new_cap_bac, new_money, new_hinh_thuc, new_cat_id, new_lv, new_exp, idCompany, new_han_nop, new_mota, new_yeucau, new_quyenloi, new_ho_so, 0, new_qh, new_bang_cap, new_gioi_tinh, new_money_min, new_money_max, new_money_unit, new_money_type, company.userName);
                return functions.success(res, "tạo bài tuyển dụng thành công", { data: { new_id } });
            }
            return functions.setError(res, 'thiếu dữ liệu', 404)
        }
        return functions.setError(res, 'Thiếu thông tin công ty', 404)
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message)
    }
}

// cập nhập tin tuyển dụng
exports.updateNewTv365 = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = request.usc_id,
            new_title = request.new_title,
            new_id = Number(request.new_id),
            new_cat_id = request.new_cat_id,
            new_so_luong = request.new_so_luong,
            new_cap_bac = request.new_cap_bac,
            new_hinh_thuc = request.new_hinh_thuc,
            new_city = request.new_city,
            new_qh = request.new_qh,
            new_addr = request.new_addr,
            new_money_unit = request.new_money_unit,
            new_hoahong = request.new_hoahong,
            new_money = request.new_money,
            new_tgtv = request.new_tgtv,
            new_money_type = request.new_money_type,
            new_money_max = request.new_money_max,
            new_money_min = request.new_money_min,
            new_mota = request.new_mota,
            new_yeucau = request.new_yeucau,
            new_exp = request.new_exp,
            new_bang_cap = request.new_bang_cap,
            new_gioi_tinh = request.new_gioi_tinh,
            new_quyenloi = request.new_quyenloi,
            new_ho_so = request.new_ho_so,
            new_han_nop = request.new_han_nop,
            new_lv;

        if (new_title && new_cat_id && new_so_luong && new_cap_bac && new_hinh_thuc && new_city && new_qh && new_addr &&
            new_money_unit && new_mota && new_exp && new_bang_cap && new_gioi_tinh && new_quyenloi && new_han_nop && new_money_type && new_id) {
            const new365 = await NewTV365.findOne({ new_id: new_id }).lean();
            if (new365) {
                // if (!await service.checkExistTitle(idCompany, new_title, new_id)) {
                //     return functions.setError(res, 'Tiêu đề đã tồn tại', 500);
                // }

                // if (await service.checkSpecalCharacter(new_title)) {
                //     return functions.setError(res, 'Tiêu đề không cho phép chứa ký tự đặc biệt', 500);
                // }

                // if (!await service.foundKeywordHot(new_title)) {
                //     return functions.setError(res, "Tiêu đề tin không dược chứa các từ Hot, tuyển gấp, cần gấp, lương cao", 500);
                // }

                // if (!await functions.checkTime(new_han_nop)) {
                //     return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 500);
                // }

                // Xử lý giá trị của mức lương qua loại lương
                const getMoney = service.getMoney(new_money_type, new_money, new_money_min, new_money_max);
                new_money = getMoney.money;
                new_money_max = Number(getMoney.maxValue) ? Number(getMoney.maxValue) : 0;
                new_money_min = Number(getMoney.minValue) ? Number(getMoney.minValue) : 0;

                // Lấy tag
                let takeData = await service.recognition_tag_tin(new_cat_id, new_title, new_mota, new_yeucau);
                new_lv = takeData.length > 0 ? takeData.id_tag : null;

                await NewTV365.updateOne({ new_id: new_id }, {
                    $set: {
                        new_title: new_title,
                        new_cat_id: new_cat_id.split(',').map(Number),
                        new_city: new_city.split(',').map(Number),
                        new_qh_id: new_qh.split(',').map(Number),
                        new_addr: new_addr,
                        new_money: new_money,
                        new_cap_bac: new_cap_bac,
                        new_exp: new_exp,
                        new_gioi_tinh: new_gioi_tinh,
                        new_bang_cap: new_bang_cap,
                        new_so_luong: new_so_luong,
                        new_hinh_thuc: new_hinh_thuc,
                        new_update_time: functions.getTimeNow(),
                        new_han_nop: new_han_nop,
                        new_mota: new_mota,
                        new_yeucau: new_yeucau,
                        new_quyenloi: new_quyenloi,
                        new_ho_so: new_ho_so,
                        new_hoahong: new_hoahong,
                        new_tgtv: new_tgtv,
                        new_lv: new_lv,
                        nm_type: new_money_type,
                        nm_min_value: new_money_min,
                        nm_max_value: new_money_max,
                        nm_unit: new_money_unit
                    }
                });

                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: {
                        'inForCompany.timviec365.usc_update_new': functions.getTimeNow(),
                    }
                });

                //Đẩy data sang CRM

                //Đẩy data sang AI
                let dataUpdateAI = {
                    new_title,
                    new_id,
                    new_cat_id,
                    new_so_luong,
                    new_cap_bac,
                    new_hinh_thuc,
                    new_city,
                    new_qh_id: new_qh,
                    new_addr,
                    new_money_unit,
                    new_hoahong,
                    new_money,
                    new_tgtv,
                    new_money_type,
                    new_money_max,
                    new_money_min,
                    new_mota,
                    new_yeucau,
                    new_exp,
                    new_bang_cap,
                    new_gioi_tinh,
                    new_quyenloi,
                    new_ho_so,
                    new_han_nop,
                    new_lv
                }
                serviceDataAI.updateNew(new_id, dataUpdateAI);

                return functions.success(res, "cập nhập bài tuyển dụng thành công");
            }
            return functions.setError(res, 'Tin không tồn tại', 404);
        }
        return functions.setError(res, 'thiếu dữ liệu');
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}


// ghim tin tuyển dụng
exports.updateNewTv365Hot = async(req, res, next) => {
    try {
        let request = req.body,
            new_id = Number(request.new_id),
            new_hot = request.new_hot,
            new_do = request.new_do,
            new_gap = request.new_gap,
            new_cao = request.new_cao,
            new_ghim = request.new_ghim,
            new_nganh = request.new_nganh,
            new_thuc = request.new_thuc,
            new_vip_time = request.new_vip_time,
            new_cate_time = request.new_cate_time,
            admin_id = request.admin_id,
            bg_id = request.bg_id,
            bg_title = request.bg_title,
            new_title = request.new_title,
            new_bao_luu = request.new_bao_luu


        if (new_id) {
            const new365 = await NewTV365.findOne({ new_id: new_id }).lean();
            if (new365) {
                let dataNew = {
                    new_hot: new_hot,
                    new_do: new_do,
                    new_gap: new_gap,
                    new_cao: new_cao,
                    new_ghim: new_ghim,
                    new_nganh: new_nganh,
                    new_thuc: new_thuc,
                    new_vip_time: new_vip_time,
                    new_cate_time: new_cate_time
                };
                if (new_bao_luu) {
                    let time_bao_luu = functions.getTimeNow();
                    dataNew.new_bao_luu = new_bao_luu;
                    dataNew.time_bao_luu = time_bao_luu;
                }
                await NewTV365.updateOne({ new_id }, {
                    $set: dataNew
                });
                let now = functions.getTimeNow();
                let dataGhim = {
                    created_time: now,
                    ghim_start: now,
                    ghim_end: new_vip_time,
                    status: 1,
                    bg_id,
                    bg_title,
                    new_id,
                    new_title,
                    adm_id: admin_id
                }
                let histotyGhim = new GhimHistory(dataGhim);
                await histotyGhim.save();
                let dataAI = {
                    new_hot,
                    new_do,
                    new_gap,
                    new_cao,
                    new_ghim,
                    new_nganh,
                    new_thuc
                }
                serviceDataAI.updateNew(new_id, dataAI);
                return functions.success(res, "Ghim tuyển dụng thành công");
            }
            return functions.setError(res, 'Tin không tồn tại', 404);
        }
        return functions.setError(res, 'Thiếu dữ liệu');
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

// ghim tin tuyển dụng
exports.deleteNewTV365 = async(req, res, next) => {
    try {
        let request = req.body,
            new_id = Number(request.new_id);

        if (new_id) {
            let news = await NewTV365.findOne({
                new_id: id,
            }).lean();
            let new_deleted = [];
            for (const [key, value] of Object.entries(news)) {
                if (key != '_id') {
                    new_deleted[key] = news[key];
                }
            }
            await NewTV365.deleteOne({ new_id: new_id });
            const newDeleted = new NewTV365Deleted(new_deleted);
            await newDeleted.save();
            return functions.setError(res, 'Xóa tin thành công', 404);
        }
        return functions.setError(res, 'Thiếu dữ liệu');
    } catch (error) {
        return functions.setError(res, error)
    }
}

// hàm làm mới tin
exports.refreshNew = async(req, res, next) => {
    try {
        let idNew = req.body.new_id;
        if (idNew) {
            await NewTV365.updateOne({ new_id: idNew }, {
                $set: { new_update_time: functions.getTimeNow() }
            });
            return functions.success(res, "làm mới bài tuyển dụng thành công")
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)
    } catch (error) {

        return functions.setError(res, error)
    }
}

//Danh sách tin NTD tự đăng
exports.listNewTV365 = async(req, res, next) => {
    try {
        console.log("listNewTV365", req.body);
        if (String(req.body.usc_company).includes("]")) {
            return true;
        }
        let request = req.body;
        let admBoPhan = Number(request.adm_bophan),
            gt = Number(request.gt),
            startdate = Number(request.startdate),
            enddate = Number(request.enddate),
            city = request.city,
            cn = Number(request.cn),
            new_id = Number(request.new_id),
            new_title = request.new_title,
            new_user_id = Number(request.new_user_id),
            usc_company = request.usc_company,
            usc_phoneTK = request.usc_phoneTK;
        let listCity = city.split(",");
        let listCityFinal = [];
        for (let i = 0; i < listCity.length; i++) {
            listCityFinal.push(listCity[i])
        }
        let page = request.page && request.page > 0 ? request.page : 1,
            perPage = request.perPage && request.perPage > 0 ? request.perPage : 30;

        let match = {};
        let match_company_arr = [{
            "company.type": 1
        }];
        if (admBoPhan) {
            match_company_arr.push({
                "company.inForCompany.usc_kd": admBoPhan,
            })
        }
        if (startdate != 0 || enddate != 0) {
            let match_time = {}
            if (startdate != 0) {
                match_time['$gte'] = startdate;
            }
            if (enddate != 0) {
                match_time['$lte'] = enddate;
            }
            match['new_update_time'] = match_time
        }
        if (gt) {
            switch (Number(gt)) {
                case 1:
                    match.new_nganh = 1;
                    break;
                case 2:
                    match.new_hot = 1;
                    break;
                case 3:
                    match.new_gap = 1;
                    break;
                case 4:
                    match.new_cao = 1;
                    break;
                case 5:
                    match.new_do = 1;
                    break;
                case 6:
                    match.new_ghim = 1;
                    break;
                default:
                    break;
            }
        }
        if (cn) {
            switch (Number(cn)) {
                case 1:
                    match.$where = function() { return this.new_create_time == this.new_update_time }
                    break;
                case 2:
                    match.$where = function() { return this.new_create_time != this.new_update_time }
                    break;
                case 3:
                    match.new_han_nop = { $gte: functions.getTimeNow(), $gte: functions.getTimeNow() + 604800 };
                    break;
            }
        }
        if (new_id != 0 && (!isNaN(new_id))) {
            match.new_id = new_id;
        }

        if (new_user_id != 0) {
            match.new_user_id = new_user_id;
        };

        if (String(city) != '0') {
            if (listCityFinal.length > 0) {
                match['$or'] = [{
                        new_city: 0
                    },
                    {
                        new_city: { $all: listCityFinal }
                    }
                ]
            }
        }

        let form = {};
        if (admBoPhan) {
            form.supportKD = admBoPhan;
        }
        let flagFindByNtd = false;
        if (req.body.usc_company) {
            form.userName = String(req.body.usc_company);
            flagFindByNtd = true;
        };
        if (req.body.usc_phoneTK) {
            form.phoneTK = String(req.body.usc_phoneTK);
            flagFindByNtd = true;
        };
        if (admBoPhan) {
            let response = await axios({
                method: "post",
                url: "http://43.239.223.57:9002/getListNewRegisterAdminBoPhan",
                data: form,
                headers: { "Content-Type": "multipart/form-data" }
            });

            let listNtdId = response.data.data.listuser;
            if (response.data.data.listuser.length > 0 && flagFindByNtd) {
                match['new_user_id'] = { $in: listNtdId };
            };
        }
        //return res.json(match_company_arr)
        let listNew = [];
        let aggregation = [{
                $sort: {
                    new_update_time: -1
                }
            },
            {
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $match: {
                    $and: match_company_arr
                }
            }, {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    _id: 1,
                    new_id: 1,
                    new_title: 1,
                    usc_id: "$company.idTimViec365",
                    usc_phone: "$company.phoneTK",
                    usc_email: "$company.email",
                    usc_address: "$company.address",
                    usc_company: "$company.userName",
                    new_update_time: 1,
                    new_han_nop: 1,
                    new_alias: 1
                }
            }

        ];


        if (new_title) {
            aggregation.unshift({
                // $match: {
                //     $text: { $search: new_title },
                // }
                $match: {
                    new_title: new RegExp(new_title, 'i'),
                }
            });
        }
        // console.log(aggregation);
        listNew = await NewTV365.aggregate(aggregation);

        let totalCount = await NewTV365.aggregate([{
                $match: match
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])

        let listNewId = [];
        for (let i = 0; i < listNew.length; i++) {
            listNewId.push(listNew[i].new_id)
        };

        // let list_hoso = await applyForJob.find({ nhs_new_id: { $in: listNewId }, nhs_kq: { $in: [0, 2, 13] } }, {
        //     nhs_new_id: 1
        // }).lean();

        let list_hoso = await applyForJob.aggregate([
            { $match: { nhs_new_id: { $in: listNewId }, nhs_kq: { $in: [0, 2, 13] } } }, {
                $lookup: {
                    from: "Users",
                    localField: "nhs_use_id",
                    foreignField: "idTimViec365",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    "user.type": 0
                }
            },
            {
                $lookup: {
                    from: "NewTV365",
                    localField: "nhs_new_id",
                    foreignField: "new_id",
                    as: "new"
                }
            },
            {
                $unwind: "$new"
            },
            {
                $project: {
                    nhs_new_id: 1
                }
            }

        ]);

        let listNewFinal = [];
        for (let i = 0; i < listNew.length; i++) {
            let obj = listNew[i];
            let countEach = 0;
            let list_hoso_each = list_hoso.filter((e) => e.nhs_new_id == obj.new_id);
            countEach = list_hoso_each.length;
            listNewFinal.push({...obj, count: countEach })
        }
        let count = totalCount[0] ? totalCount[0].count : 0;
        return functions.success(res, "Thành công", { list: listNewFinal, count, match, match_company_arr, list_hoso, aggregation });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
}

//Danh sách tin duyệt index
exports.listNewTV365Index = async(req, res, next) => {
    try {
        let request = req.body;
        let new_id = request.new_id ? Number(request.new_id) : 0,
            new_title = request.new_title ? request.new_title : '',
            startdate = Number(request.startdate),
            enddate = Number(request.enddate),
            new_user_id = Number(request.new_user_id),
            usc_phoneTK = request.usc_phoneTK,
            usc_company = request.usc_company,
            check_index = Number(request.check_index);
        let page = request.page && request.page > 0 ? request.page : 1,
            perPage = request.perPage && request.perPage > 0 ? request.perPage : 30;

        let match = {
                new_active: 2
            },
            match_company = {
                type: 1
            }
        if (new_id != 0) {
            match.new_id = new_id;
        }
        if (startdate != 0 || enddate != 0) {
            match.new_create_time = {};
            if (startdate != 0) {
                match.new_create_time.$gte = startdate;
            }
            if (enddate != 0) {
                match.new_create_time.$lte = enddate;
            }
        }
        if (new_title) {
            match.new_title = { $regex: new_title };
        }
        if (new_user_id != 0) {
            match.new_user_id = new_user_id;
        }
        if (usc_phoneTK) {
            match_company.phoneTK = usc_phoneTK;
        }
        if (usc_company) {
            match_company.userName = usc_company;
        }
        if (check_index) {
            match.new_check_index = check_index;
        }
        var listNew = []
        listNew = await NewTV365.aggregate([{
                $match: match
            },
            {
                $sort: {
                    new_create_time: -1
                }
            },

            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    _id: 1,
                    new_id: 1,
                    new_title: 1,
                    usc_id: "$company.idTimViec365",
                    usc_phone: "$company.phone",
                    usc_email: "$company.email",
                    usc_address: "$company.address",
                    usc_company: "$company.userName",
                    new_update_time: 1,
                    new_han_nop: 1,
                    new_active: 1,
                    new_create_time: 1,
                    new_check_index: 1
                }
            }

        ])
        var totalCount = 0;
        totalCount = await NewTV365.aggregate([{
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        let count = 0;
        if (totalCount.length) {
            count = totalCount[0].count;
        }
        return functions.success(res, "Thành công", { list: listNew, count });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
}

//Danh sách tin duyệt jobposting
exports.listNewTV365Jobposting = async(req, res, next) => {
    try {
        let request = req.body;
        let new_id = Number(request.new_id),
            new_title = request.new_title,
            startdate = Number(request.startdate),
            enddate = Number(request.enddate),
            new_user_id = Number(request.new_user_id),
            usc_phoneTK = request.usc_phoneTK,
            usc_company = request.usc_company,
            check_job = Number(request.check_job);
        let page = request.page && request.page > 0 ? request.page : 1,
            perPage = request.perPage && request.perPage > 0 ? request.perPage : 30;

        let match = {
                no_jobposting: 0,
                new_active: 1,
                // new_test: 0,
                // new_cap_bac: { $ne: 6 },
                // nm_type: { $nin: [2, 3] },
                // new_hinh_thuc: { $nin: [3, 4, 7] },
                new_create_time: { $gte: 1697562001 },
                new_han_nop: { $gte: functions.getTimeNow() }
            },
            match_company = {
                type: 1
            }
        if (new_id != 0) {
            match.new_id = new_id;
        }
        if (startdate != 0 || enddate != 0) {
            match.new_create_time = {};
            if (startdate != 0) {
                match.new_create_time.$gte = startdate;
            }
            if (enddate != 0) {
                match.new_create_time.$lte = enddate;
            }
        }
        if (new_title) {
            match.new_title = { $regex: new_title };
        }
        if (new_user_id != 0) {
            match.new_user_id = new_user_id;
        }
        if (usc_phoneTK) {
            match_company.phoneTK = usc_phoneTK;
        }
        if (usc_company) {
            match_company.userName = usc_company;
        }
        if (check_job) {
            match.new_active_jop = check_job;
        }
        var listNew = []
        listNew = await NewTV365.aggregate([{
                $match: match
            },
            {
                $sort: {
                    new_create_time: -1
                }
            },

            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    _id: 1,
                    new_id: 1,
                    new_title: 1,
                    usc_id: "$company.idTimViec365",
                    usc_phone: "$company.phone",
                    usc_email: "$company.email",
                    usc_address: "$company.address",
                    usc_company: "$company.userName",
                    new_update_time: 1,
                    new_han_nop: 1,
                    no_jobposting: 1,
                    new_create_time: 1,
                    new_active_jop: 1
                }
            }

        ])
        var totalCount = 0;
        totalCount = await NewTV365.aggregate([{
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        let count = 0;
        if (totalCount.length) {
            count = totalCount[0].count;
        }
        return functions.success(res, "Thành công", { list: listNew, count });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
}

//Cập nhật 1 trường trong tin
exports.changeNewField = async(req, res) => {
    try {
        let request = req.body;
        let new_id = request.new_id,
            value = request.value,
            field = request.field;
        if (field && value && new_id) {
            let dataUpdate = {};
            dataUpdate[`${field}`] = Number(value);
            await NewTV365.updateOne({ new_id: Number(new_id) }, {
                $set: dataUpdate
            });
            return functions.success(res, "Thành công");
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");
    } catch (e) {
        return functions.setError(res, e);
    }
};

//Danh sách tin đăng mới
exports.listNewTV365New = async(req, res, next) => {
    try {
        let request = req.body;
        let new_id = Number(request.new_id),
            new_title = request.new_title,
            startdate = Number(request.startdate),
            enddate = Number(request.enddate),
            new_user_id = Number(request.new_user_id),
            usc_phoneTK = request.usc_phoneTK,
            usc_company = request.usc_company,
            index = Number(request.index),
            jobposting = Number(request.jobposting);
        let page = request.page && request.page > 0 ? request.page : 1,
            perPage = request.perPage && request.perPage > 0 ? request.perPage : 30;

        let match = {
                // no_jobposting: 0,
                new_test: { $ne: 1 },
                new_create_time: { $gte: functions.getTimeNow() - 3 * 86400 }
            },
            match_company = {
                type: 1
            }
        if (new_id != 0) {
            match.new_id = new_id;
        }
        if (startdate != 0 || enddate != 0) {
            match.new_create_time = {};
            if (startdate != 0) {
                match.new_create_time.$gte = startdate;
            }
            if (enddate != 0) {
                match.new_create_time.$lte = enddate;
            }
        }
        if (new_title) {
            match.new_title = { $regex: new_title };
        }
        if (new_user_id != 0) {
            match.new_user_id = new_user_id;
        }
        if (usc_phoneTK) {
            match_company.phoneTK = usc_phoneTK;
        }
        if (usc_company) {
            match_company.userName = usc_company;
        }
        if (index) {
            match.new_active = index;
        }
        if (jobposting) {
            match.no_jobposting = jobposting;
        }
        var listNew = []
        listNew = await NewTV365.aggregate([{
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $sort: {
                    new_create_time: -1
                }
            },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    _id: 1,
                    new_id: 1,
                    new_title: 1,
                    usc_id: "$company.idTimViec365",
                    usc_phone: "$company.phone",
                    usc_email: "$company.email",
                    usc_address: "$company.address",
                    usc_company: "$company.userName",
                    new_update_time: 1,
                    new_create_time: 1,
                    new_han_nop: 1,
                    new_active: 1,
                    no_jobposting: 1
                }
            }

        ])

        var totalCount = 0;
        totalCount = await NewTV365.aggregate([{
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idTimViec365",
                    localField: "new_user_id",
                    let: { "type": "$Users.type" },
                    pipeline: [{
                        $match: match_company
                    }],
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        let count = totalCount[0] ? totalCount[0].count : 0;
        return functions.success(res, "Thành công", { list: listNew, count });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

//lay danh sach tin bi trung
exports.listNewSpam = async(req, res, nest) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const name = req.body.name;
        const startDate = Number(req.body.startDate);
        const endDate = Number(req.body.endDate);

        const promiseCount = NewTV365.countDocuments({
            new_check_spam: 1,
            ...(id ? { new_id: id } : {}),
            ...(name ? { new_title: { $regex: name, $options: 'i' } } : {}),
            ...(startDate ? { new_create_time: { $gte: startDate } } : {}),
            ...(endDate ? { new_create_time: { $lte: endDate } } : {}),
            ...(startDate && endDate ? { new_create_time: { $gte: startDate, $lte: endDate } } : {}),
        });

        const promiseListNewSpam = NewTV365.find({
                new_check_spam: 1,
                ...(id ? { new_id: id } : {}),
                ...(name ? { new_title: { $regex: name, $options: 'i' } } : {}),
                ...(startDate ? { new_create_time: { $gte: startDate } } : {}),
                ...(endDate ? { new_create_time: { $lte: endDate } } : {}),
                ...(startDate && endDate ? { new_create_time: { $gte: startDate, $lte: endDate } } : {}),
            }, {
                new_title: 1,
                new_id_duplicate: 1,
                new_id: 1,
                new_active: 1,
            })
            .sort({
                new_update_time: -1,
            })
            .skip((page - 1) * 30)
            .limit(30)
            .lean();

        const [listNewSpam, count] = await Promise.all([
            promiseListNewSpam,
            promiseCount,
        ]);

        const lists = [];

        for (let i = 0; i < listNewSpam.length; i++) {
            let element = listNewSpam[i];
            let arrId = element.new_id_duplicate;
            let arrNew = [];
            for (let j = 0; j < arrId.length; j++) {
                const promiseNew = NewTV365.findOne({
                    new_id: arrId[j],
                }, {
                    new_title: 1,
                    new_id: 1,
                    new_active: 1,
                });
                arrNew.push(promiseNew);
            }

            const arrResult = await Promise.all(arrNew);
            lists.push({
                ...element,
                new_duplicate: arrResult,
            });
        }

        return functions.success(res, 'Get new spame is successfully', {
            listNewSpam: lists,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//lấy danh sách ảnh bị trùng
exports.listImageSpam = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const name = req.body.name;
        const startDate = Number(req.body.startDate);
        const endDate = Number(req.body.endDate);

        const promiseListImageSpam = ImageSpam.aggregate([{
                $match: {
                    ...(id ? { img_id: id } : {}),
                    ...(name ? { img: { $regex: name, $options: 'i' } } : {}),
                    ...(startDate ? { createAt: { $gte: startDate } } : {}),
                    ...(endDate ? { createAt: { $lte: endDate } } : {}),
                    ...(startDate && endDate ? { createAt: { $gte: startDate, $lte: endDate } } : {}),
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
            {
                $lookup: {
                    from: 'User',
                    foreignField: 'idTimViec365',
                    localField: 'img_user_id',
                    as: 'user',
                },
            },
        ]);

        const promiseCount = ImageSpam.countDocuments(
            ...(id ? { img_id: id } : {}),
            ...(name ? { img: name } : {}),
            ...(startDate ? { createAt: { $gte: startDate } } : {}),
            ...(endDate ? { createAt: { $lte: endDate } } : {}),
            ...(startDate && endDate ? { createAt: { $gte: startDate, $lte: endDate } } : {})
        );

        const [listImageSpam, count] = await Promise.all([
            promiseListImageSpam,
            promiseCount,
        ]);

        return functions.success(res, 'Get list image spam is successfully', {
            listImageSpam,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listAllNewTest = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const nameNew = req.body.nameNew;
        const nameCity = req.body.nameCity;

        const promiseListAllNewTest = NewTV365.aggregate([{
                $match: {
                    new_test: 1,
                    ...(id ? { new_id: id } : {}),
                    ...(nameNew ? { new_title: { $regex: nameNew, $options: 'i' } } : {}),
                },
            },

            {
                $sort: {
                    new_create_time: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $ne: 0 },
                            type: 1,
                        },
                    }, ],
                    foreignField: 'idTimViec365',
                    localField: 'new_user_id',
                    as: 'user',
                },
            },
            {
                $match: {
                    ...(nameCity ? { 'user.userName': { $regex: nameCity, $options: 'i' } } : {}),
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
            {
                $project: {
                    new_id: 1,
                    new_title: 1,
                    new_create_time: 1,
                    user: {
                        userName: 1,
                        type: 1,
                        'inForCompany.timviec365.use_test': 1,
                        address: 1,
                    },
                },
            },
        ]);

        const promiseCount = NewTV365.aggregate([{
                $match: {
                    new_test: 1,
                    ...(id ? { new_id: id } : {}),
                    ...(nameNew ? { new_title: { $regex: nameNew, $options: 'i' } } : {}),
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $ne: 0 },
                            type: 1,
                        },
                    }, ],
                    foreignField: 'idTimViec365',
                    localField: 'new_user_id',
                    as: 'user',
                },
            },
            {
                $match: {
                    ...(nameCity ? { 'user.userName': { $regex: nameCity, $options: 'i' } } : {}),
                },
            },
            {
                $count: 'total',
            },
        ]);

        const [listAllNewTest, count] = await Promise.all([
            promiseListAllNewTest,
            promiseCount,
        ]);

        return functions.success(res, 'Get list new is successfully', {
            listAllNewTest,
            count: count[0] ? count[0].total : 0,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteImageSpam = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'ERROR');
        const imageSpam = await imageSpam.findOne({
            id: id,
        });
        if (!imageSpam)
            return functions.setError(res, 'error to delete image spam');
        const path =
            '../storage/base365/timviec365/pictures/videos/' +
            functions.convertDate(image.usc_createAt) +
            imageSpam.img;
        functions.deleteFile(path);
        await imageSpam.deleteOne({
            id: id,
        });
        return functions.success(res, 'Delete Image Spam have id : ' + id);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.activeNew = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'ERROR');
        await NewTV365.updateOne({
            new_id: id,
        }, {
            new_active: 2,
            new_check_spam: 2,
            new_id_duplicate: [],
        });
        return functions.success(
            res,
            'Update New have id : ' + id + ' is successfully'
        );
    } catch (e) {
        return functions.setError(res);
    }
};

exports.activeImageSpam = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'ERROR');
        const imageSpam = await imageSpam.findOne({
            id: id,
        });
        if (!imageSpam)
            return functions.setError(res, 'error to delete image spam');
        const user = await Users.findOne({
            type: 1,
            idTimViec365: imageSpam.img_user_id,
        });
        if (!user) return functions.setError(res, 'error to delete image spam');
        const linkImage = user.inForCompany.timviec365.usc_images + imageSpam.img;
        await Users.updateOne({
            type: 1,
            idTimViec365: imageSpam.img_user_id,
        }, {
            'inForCompany.timviec365.usc_images': linkImage,
            updatedAt: Date.now(),
        });
        await imageSpam.deleteOne({
            id: id,
        });
        return functions.success(res, 'Delete Image Spam have id : ' + id);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteNew = async(req, res, next) => {
    try {
        const id = req.params.idNew;
        if (!id) return functions.setError(res, 'Falure to delete new');
        let news = await NewTV365.findOne({
            new_id: id,
        }).lean();
        if (!news) return functions.setError(res, 'Falure to delete');
        const imageArray = news.new_images ? news.new_images.split(',') : [];
        const video = news.new_video;
        const company = await Users.findOne({
            idTimViec365: news.new_user_id,
            type: 0,
        });
        if (company) {
            imageArray.forEach((item) => {
                let path = serviceCompany.geturlImage(company.createdAt) + item;
                functions.deleteFile(path);
            });
            if (video) {
                let path = serviceCompany.geturlVideo(company.createdAt) + video;
                functions.deleteFile(path);
            }
        }
        await NewTV365.deleteOne({
            new_id: id,
        });
        let new_deleted = [];
        for (const [key, value] of Object.entries(news)) {
            if (key != '_id') {
                new_deleted[key] = news[key];
            }
        }
        const newDeleted = new NewTV365Deleted(new_deleted);
        await newDeleted.save();

        return functions.success(res, 'Delete new is successfully');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.historyGhim = async(req, res, next) => {
    try {
        if (req.body.new_id) {
            const new_id = req.body.new_id;
            let dataGhimHistory = await GhimHistory.findOne({ new_id }).sort({ created_time: -1 }).lean();
            return functions.success(res, "Thành công", { data: dataGhimHistory });
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
}