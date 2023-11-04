const axios = require('axios');
const functions = require('../../services/functions');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const Users = require('../../models/Users');
const ApplyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const UserSavePost = require('../../models/Timviec365/UserOnSite/Candicate/UserSavePost');
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost');
const LikePost = require('../../models/Timviec365/UserOnSite/LikePost');
const Keyword = require('../../models/Timviec365/UserOnSite/Company/Keywords');
const Blog = require('../../models/Timviec365/Blog/Posts');
const Category = require('../../models/Timviec365/CategoryJob');
const SaveVote = require('../../models/Timviec365/SaveVote');
const TblHistoryViewed = require('../../models/Timviec365/UserOnSite/Candicate/TblHistoryViewed');
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const HistoryNewPoint = require('../../models/Timviec365/HistoryNewPoint');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const GhimHistory = require('../../models/Timviec365/UserOnSite/Company/GhimHistory');
const PriceList = require('../../models/Timviec365/PriceList/PriceList');
const CategoryDes = require('../../models/Timviec365/CategoryDes');
const TblModules = require('../../models/Timviec365/TblModules');
const HistorySearch = require('../../models/Timviec365/HistorySearch');
const City = require('../../models/City');
const District = require('../../models/District');
const slugify = require('slugify');
const ImageSpam = require('../../models/Timviec365/UserOnSite/Company/ImageSpam');
const PostsTV365 = require('../../models/Timviec365/Blog/Posts');
// Service
const service = require('../../services/timviec365/new');
const serviceCompany = require('../../services/timviec365/company');
const New = require('../../models/Timviec365/UserOnSite/Company/New');
const creditsController = require('./credits');
const { handleCalculatePointNTDComment } = require('./history/PointNTDComment');
const serviceDataAI = require('../../services/timviec365/dataAI');
const serviceBlog = require('../../services/timviec365/blog');
const serviceSendMess = require('../../services/timviec365/sendMess');

// đẩy dữ liệu gợi ý
const HandlePusHDataRecomendationNewBeforeLogin = async(user_id) => {
    try {
        let listHistory = await HistorySearch.find({ user_id: String(user_id) })
            .sort({ _id: -1 })
            .skip(10)
            .lean();
        if (listHistory.length) {
            let arr_id = [];
            for (let i = 0; i < listHistory.length; i++) {
                arr_id.push(listHistory[i]);
            }
            await HistorySearch.deleteMany({ user_id: { $in: arr_id } });
        }
        return true;
    } catch (e) {
        console.log('err HandlePusHDataRecomendationNewBeforeLogin');
        return false;
    }
};
exports.PusHDataRecomendationNewBeforeLogin = async(req, res, next) => {
    try {
        let obj = new HistorySearch(req.body);
        obj.save().catch((e) => {
            console.log('err PusHDataRecomendationNewBeforeLogin');
            return false;
        });
        HandlePusHDataRecomendationNewBeforeLogin(req.body.user_id);
        return functions.success(res, 'Truyền dữ liệu thành công');
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.TakeDataRecommendHobby = async(req, res, next) => {
    try {
        let userId = String(req.body.userId);
        let listData = await HistorySearch.find({ user_id: userId }).lean();
        return res.json({
            data: {
                result: true,
                listData
            }
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};

// đăng tin
exports.postNewTv365 = async(req, res, next) => {
    try {
        let company = req.user.data,
            idCompany = company.idTimViec365,
            request = req.body,
            new_title = request.new_title,
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
            new_video_type = Number(request.new_video_type),
            new_ho_so = request.new_hoso,
            new_han_nop = request.new_han_nop,
            usc_name = request.usc_name,
            usc_name_add = request.usc_name_add,
            usc_name_phone = request.usc_name_phone,
            usc_name_email = request.usc_name_email,
            linkVideo = request.linkVideo || '',
            now = functions.getTimeNow(),
            video = '',
            link = '',
            // mảng chứa danh sách ảnh của tin
            listImg = [];

        if (
            new_title &&
            new_cat_id &&
            new_so_luong &&
            new_cap_bac &&
            new_hinh_thuc &&
            new_city &&
            new_qh &&
            new_addr &&
            new_money_unit &&
            new_mota &&
            new_exp &&
            new_bang_cap &&
            new_gioi_tinh &&
            new_quyenloi &&
            new_han_nop &&
            usc_name &&
            usc_name_add &&
            usc_name_phone &&
            usc_name_email &&
            new_money_type
        ) {
            // Check trùng tiêu đề
            if (idCompany != -1 && !(await service.checkExistTitle(idCompany, new_title))) {
                return functions.setError(res, 'Tiêu đề đã tồn tại', 500);
            }

            // Check ký tự đặc biệt trong tiêu đề
            if (await service.checkSpecalCharacter(new_title)) {
                return functions.setError(res, 'Tiêu đề không cho phép chứa ký tự đặc biệt', 500);
            }

            // Check từ khóa nằm trong tiêu đề
            if (!(await service.foundKeywordHot(new_title))) {
                return functions.setError(
                    res,
                    'Tiêu đề tin không được chứa các từ Hot, tuyển gấp, cần gấp, lương cao',
                    500
                );
            }

            // Check thời gian hạn nộp
            if (!(await functions.checkTime(new_han_nop))) {
                return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 500);
            }

            // Check định dạng sđt và email
            if (!(await functions.checkEmail(usc_name_email)) || !(await functions.checkPhoneNumber(usc_name_phone))) {
                return functions.setError(res, 'Email hoặc Số điện thoại không đúng định dạng', 500);
            }

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
                strict: true, // Loại bỏ các ký tự không hợp lệ
            });
            //Đạt thêm code check tin test
            const user = await Users.findOne({
                type: 1,
                idTimViec365: idCompany,
            });
            const isTest = user ?
                user.inForCompany ?
                user.inForCompany.timviec365 ?
                user.inForCompany.timviec365.usc_test :
                0 :
                0 :
                0;

            const new_id = Number(newMax.new_id) >= 2000000 ? Number(newMax.new_id) + 1 : 2000000;
            const newTV = new NewTV365({
                new_id: new_id,
                new_active: 2,
                new_title: new_title,
                new_user_id: idCompany,
                new_alias: new_alias,
                new_cat_id: [new_cat_id],
                new_city: [new_city],
                new_qh_id: [new_qh],
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
                new_update_time_2: now,
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
                link_video: linkVideo,
                new_test: isTest,
            });
            await newTV.save();
            await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                $set: {
                    'inForCompany.timviec365.usc_name': usc_name,
                    'inForCompany.timviec365.usc_name_add': usc_name_add,
                    'inForCompany.timviec365.usc_name_phone': usc_name_phone,
                    'inForCompany.timviec365.usc_name_email': usc_name_email,
                    'inForCompany.timviec365.usc_update_new': now,
                },
            });

            // Xử lý luồng gửi data crm
            await serviceCompany.CreateNewCrm(idCompany);

            //Gửi data sang chat
            serviceSendMess.createNew(idCompany);

            // Xử lý luồng phân quyền
            const arr_notify = req.body.arr_noti;
            service.up_notify(arr_notify, idCompany, 0, 1, new_id);

            // Xử lý luồng tải file
            if (JSON.stringify(req.files) !== '{}') {
                // Xử lý hình ảnh vào kho
                const storage = req.files.storage;
                let uploadStorage,
                    isUploadLogo = 0;
                let list_image = [],
                    list_video = [];
                for (let index = 0; index < storage.length; index++) {
                    const file = storage[index];
                    if (serviceCompany.checkItemStorage(file.type)) {
                        if (serviceCompany.isImage(file.type)) {
                            uploadStorage = serviceCompany.uploadStorage(idCompany, file, 'image', company.createdAt);
                            await serviceCompany.addStorage(idCompany, 'image', uploadStorage.file_name);
                            list_image.push(uploadStorage.file_name);
                        } else {
                            uploadStorage = serviceCompany.uploadStorage(idCompany, file, 'video', company.createdAt);
                            await serviceCompany.addStorage(idCompany, 'video', uploadStorage.file_name);
                            list_video.push(uploadStorage.file_name);
                        }
                    }
                }
                // Cập nhật vào base
                await NewTV365.updateOne({ new_id: new_id }, {
                    $set: {
                        new_images: list_image.toString(),
                        new_video: list_video.toString(),
                    },
                });
            }
            // xử lý luồng up link video youtube
            else {
                if (new_video_type == 2) {
                    await NewTV365.updateOne({ new_id: new_id }, {
                        $set: {
                            new_video: linkVideo,
                            new_video_type: 2,
                        },
                    });
                }
            }

            //Xử lý luồng check index bằng AI
            company = await Users.findOne({ _id: company._id }).lean();
            let listNewCit = new_city.split(','),
                listNewDis = new_qh.split(','),
                new_cit_name = '',
                new_qh_name = '';
            let listCit = await City.find({ _id: { $in: listNewCit } }).lean();
            let listDis = await District.find({ _id: { $in: listNewDis } }).lean();

            if (listCit.length) {
                let listName = [];
                listCit.forEach((value, i) => {
                    listName.push(value.name);
                });
                new_cit_name = listName.join(',');
            }
            if (listDis.length) {
                let listName = [];
                listDis.forEach((value, i) => {
                    listName.push(value.name);
                });
                new_qh_name = listName.join(',');
            }

            let new_money_str = await functions.new_money_tv(
                0,
                new_money_type,
                new_money_unit,
                new_money_min,
                new_money_max,
                new_money
            );
            let dataIndex = {
                new_id: new_id,
                new_title: new_title,
                new_city: new_city,
                new_addr: new_addr,
                cit_name: new_cit_name,
                new_qh_id: new_qh,
                new_mota: new_mota,
                new_quyenloi: new_quyenloi,
                new_yeucau: new_yeucau,
                new_money_str: new_money_str,
                new_name_cit: new_cit_name,
                new_name_qh: new_qh_name,
            };
            let company_name = '';
            if (idCompany == -1) {
                dataIndex.usc_address = usc_name_add;
                dataIndex.usc_company = usc_name;
            } else {
                dataIndex.usc_address = company.address;
                dataIndex.usc_company = company.userName;
                company_name = company.userName;
            }
            let responseIndex = await axios({
                method: 'post',
                url: 'http://43.239.223.19:8018/index',
                data: dataIndex,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let dataResIndex = responseIndex.data;
            let checkIndex = 0;
            if (dataResIndex && dataResIndex.data) {
                checkIndex = dataResIndex.data.item == 0 ? 1 : 2;
            }
            await NewTV365.updateOne({ new_id }, {
                $set: {
                    new_check_index: checkIndex,
                },
            });
            //Check jobposting AI
            let dataJob = dataIndex;

            array_hinh_thuc = [
                'Toàn thời gian cố định',
                'Toàn thời gian tạm thời',
                'Bán thời gian',
                'Bán thời gian tạm thời',
                'Hợp đồng',
                'Việc làm từ xa',
                'Khác',
            ];
            dataJob.new_hinh_thuc_text = array_hinh_thuc[new_hinh_thuc];
            let responseJob = await axios({
                method: 'post',
                url: 'http://43.239.223.19:8008/jobsposting',
                data: dataJob,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let dataResJob = responseJob.data;
            let checkJob = 0;
            if (dataResJob && dataResJob.data) {
                checkJob = dataResJob.data.item == 0 ? 1 : 2;
            }
            await NewTV365.updateOne({ new_id }, {
                $set: {
                    new_active_jop: checkJob,
                },
            });

            //Đẩy data sang AI
            serviceDataAI.addNew(
                new_id,
                new_title,
                new_addr,
                new_city,
                new_cap_bac,
                new_money,
                new_hinh_thuc,
                new_cat_id,
                new_lv,
                new_exp,
                idCompany,
                new_han_nop,
                new_mota,
                new_yeucau,
                new_quyenloi,
                new_ho_so,
                0,
                new_qh,
                new_bang_cap,
                new_gioi_tinh,
                new_money_min,
                new_money_max,
                new_money_unit,
                new_money_type,
                company_name
            );

            return functions.success(res, 'tạo bài tuyển dụng thành công', { data: { new_id } });
        }
        return functions.setError(res, 'thiếu dữ liệu', 404);
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// lấy 1 bài post
exports.getPost = async(req, res, next) => {
    try {
        let new_id = req.body.new_id;
        if (new_id) {
            let post = await functions.getDatafindOne(NewTV365, { new_id: new_id });
            if (post) {
                return functions.success(res, 'Lấy dữ liệu thành công', { post });
            }
            return functions.setError(res, 'Tin không tồn tại', 404);
        }
        return functions.setError(res, 'Chưa truyền id tin', 404);
    } catch (error) {
        return functions.setError(res, error);
    }
};

// check 10p đăng tin 1 lần
exports.checkPostNew10p = async(req, res, next) => {
    try {
        let id = req.user.data.idTimViec365;
        let post = await NewTV365.findOne({ new_user_id: id }).sort({ new_create_time: -1 });
        if (post) {
            let checkPost = functions.isCurrentTimeGreaterThanInputTime(post.new_create_time);
            if (checkPost) {
                return functions.success(res, 'B?n v?a dang tin c�ch d�y 10p');
            }
            return functions.setError(res, 'chua d? 10p', 404);
        }
        return functions.success(res, 'B?n v?a dang tin c�ch d�y 10p');
    } catch (error) {
        return functions.setError(res, error);
    }
};
// api lấy tổng số tin theo thời gian
exports.getCountByTime = async(req, res) => {
    try {
        const user = req.user.data,
            time_begin = req.body.time_begin,
            time_end = req.body.time_end;

        if (time_begin && time_end && !isNaN(time_begin) && !isNaN(time_end)) {
            const count = await NewTV365.countDocuments({
                new_user_id: user.idTimViec365,
                new_create_time: { $gt: time_begin, $lt: time_end },
            });
            return functions.success(res, 'Số lượng tin đăng trong ngày', { count });
        }
        return functions.setError(res, 'Chưa truyền giá trị thời gian');
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.getNewCreateTime = async(req, res) => {
    try {
        const user = req.user.data,
            userID = user.idTimViec365;

        let lastdt = 0; // Đéo biết là gì đâu nhưng thấy bên php như nào thì bếch sang
        if (userID == 143879) {
            const count = await NewTV365.countDocuments({ new_user_id: userID, new_create_time: { $gt: 1669889469 } });
            if (count >= 100) {
                lastdt = 1;
            }
        } else {
            // mdt = mức đăng tin
            const mdt = await NewTV365.findOne({ new_user_id: userID })
                .select('new_create_time')
                .sort({ new_create_time: -1 })
                .limit(1)
                .lean(),
                now = functions.getTimeNow();
            if (mdt > now - 600) {
                lastdt = 1;
            }
        }
        return functions.success(res, '....', { lastdt });
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.getListTitleNew = async(req, res) => {
    try {
        const user = req.user.data,
            userID = user.idTimViec365;

        const list = await NewTV365.find({ new_user_id: userID }).select('new_title').lean();
        return functions.success(res, '....', { list });
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.getListPermision = async(req, res) => {
    try {
        const user = req.user.data,
            userID = user.idTimViec365;

        const list = await NewTV365.find({ new_user_id: userID }).select('new_title').lean();
        return functions.success(res, '....', { list });
    } catch (error) {
        return functions.setError(res, error);
    }
};

// cập nhập tin tuyển dụng
exports.updateNewTv365 = async(req, res, next) => {
    try {
        const company = req.user.data;
        let idCompany = company.idTimViec365,
            request = req.body,
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
            new_ho_so = request.new_hoso,
            new_han_nop = request.new_han_nop,
            usc_name = request.usc_name,
            usc_name_add = request.usc_name_add,
            usc_name_phone = request.usc_name_phone,
            usc_name_email = request.usc_name_email,
            new_video_type = Number(request.new_video_type),
            new_images = request.new_images,
            new_video = request.linkVideo,
            new_lv;

        if (
            new_title &&
            new_cat_id &&
            new_so_luong &&
            new_cap_bac &&
            new_hinh_thuc &&
            new_city &&
            new_qh &&
            new_addr &&
            new_money_unit &&
            new_mota &&
            new_yeucau &&
            new_exp &&
            new_bang_cap &&
            new_gioi_tinh &&
            new_quyenloi &&
            new_han_nop &&
            usc_name &&
            usc_name_add &&
            usc_name_phone &&
            usc_name_email &&
            new_money_type &&
            new_id
        ) {
            const new365 = await NewTV365.findOne({ new_id: new_id }).lean();
            if (new365) {
                if (!(await service.checkExistTitle(idCompany, new_title, new_id))) {
                    return functions.setError(res, 'Tiêu đề đã tồn tại', 500);
                }

                if (await service.checkSpecalCharacter(new_title)) {
                    return functions.setError(res, 'Tiêu đề không cho phép chứa ký tự đặc biệt', 500);
                }

                if (!(await service.foundKeywordHot(new_title))) {
                    return functions.setError(
                        res,
                        'Tiêu đề tin không dược chứa các từ Hot, tuyển gấp, cần gấp, lương cao',
                        500
                    );
                }

                if (!(await functions.checkTime(new_han_nop))) {
                    return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 500);
                }

                if (!(await functions.checkEmail(usc_name_email)) ||
                    !(await functions.checkPhoneNumber(usc_name_phone))
                ) {
                    return functions.setError(res, 'Email hoặc Số điện thoại không đúng định dạng', 500);
                }

                // Xử lý giá trị của mức lương qua loại lương
                const getMoney = service.getMoney(new_money_type, new_money, new_money_min, new_money_max);
                new_money = getMoney.money;
                new_money_max = getMoney.maxValue;
                new_money_min = getMoney.minValue;

                // Lấy tag
                let takeData = await service.recognition_tag_tin(new_cat_id, new_title, new_mota, new_yeucau);
                new_lv = takeData.length > 0 ? takeData.id_tag : null;

                await NewTV365.updateOne({ new_id: new_id }, {
                    $set: {
                        new_title: new_title,
                        new_cat_id: [new_cat_id],
                        new_city: [new_city],
                        new_qh_id: [new_qh],
                        new_addr: new_addr,
                        new_money: new_money,
                        new_cap_bac: new_cap_bac,
                        new_exp: new_exp,
                        new_gioi_tinh: new_gioi_tinh,
                        new_bang_cap: new_bang_cap,
                        new_so_luong: new_so_luong,
                        new_hinh_thuc: new_hinh_thuc,
                        new_update_time_2: functions.getTimeNow(),
                        new_han_nop: new_han_nop,
                        new_mota: new_mota,
                        new_yeucau: new_yeucau,
                        new_quyenloi: new_quyenloi,
                        new_ho_so: new_ho_so,
                        new_hoahong: new_hoahong,
                        new_tgtv: new_tgtv,
                        new_lv: new_lv,
                        new_images: new_images,
                        new_video: new_video,
                        new_video_type: new_video_type,
                        nm_type: new_money_type,
                        nm_min_value: new_money_min,
                        nm_max_value: new_money_max,
                        nm_unit: new_money_unit,
                    },
                });

                // Xử lý data sang crm
                await serviceCompany.UpdateNewCrm(idCompany);

                //Gửi data sang chat
                serviceSendMess.editNew(idCompany);

                const list_delele = req.body.list_delele;
                const arr_notify = req.body.arr_noti;
                service.update_notify(list_delele, arr_notify, idCompany, 0, 1, new_id);

                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: {
                        'inForCompany.timviec365.usc_name': usc_name,
                        'inForCompany.timviec365.usc_name_add': usc_name_add,
                        'inForCompany.timviec365.usc_name_phone': usc_name_phone,
                        'inForCompany.timviec365.usc_name_email': usc_name_email,
                        'inForCompany.timviec365.usc_update_new': functions.getTimeNow(),
                    },
                });

                // Xử lý luồng tải file
                if (new_video_type == 1) {
                    if (JSON.stringify(req.files) !== '{}') {
                        // Xử lý hình ảnh vào kho
                        const storage = req.files.storage;
                        let uploadStorage,
                            isUploadLogo = 0;
                        let list_image = new365.new_images ? new365.new_images.split(',') : [],
                            list_video = [];
                        for (let index = 0; index < storage.length; index++) {
                            const file = storage[index];
                            if (serviceCompany.checkItemStorage(file.type)) {
                                if (serviceCompany.isImage(file.type)) {
                                    uploadStorage = serviceCompany.uploadStorage(
                                        idCompany,
                                        file,
                                        'image',
                                        company.createdAt
                                    );
                                    await serviceCompany.addStorage(idCompany, 'image', uploadStorage.file_name);
                                    list_image.push(uploadStorage.file_name);
                                } else {
                                    uploadStorage = serviceCompany.uploadStorage(
                                        idCompany,
                                        file,
                                        'video',
                                        company.createdAt
                                    );
                                    await serviceCompany.addStorage(idCompany, 'video', uploadStorage.file_name);
                                    list_video.push(uploadStorage.file_name);
                                }
                            }
                        }

                        // Cập nhật vào base
                        await NewTV365.updateOne({ new_id: new_id }, {
                            $set: {
                                new_images: list_image.toString(),
                                new_video: list_video.toString(),
                            },
                        });
                    }
                }
                if (new_video_type == 2) {
                    await NewTV365.updateOne({ new_id: new_id }, {
                        $set: {
                            link_video: new_video,
                        },
                    });
                }
                let dataUpdateAI = {
                    new_title,
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
                    new_lv,
                };
                let resAI = await serviceDataAI.updateNew(new_id, dataUpdateAI);
                return functions.success(res, 'cập nhập bài tuyển dụng thành công', {
                    new: await NewTV365.findOne({ new_id: new_id }).lean(),
                });
            }
            return functions.setError(res, 'Tin không tồn tại', 404);
        }
        return functions.setError(res, 'thiếu dữ liệu');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// hàm xóa tin
exports.deleteNewTv365 = async(req, res, next) => {
    try {
        const new_id = req.params.idNew,
            user = req.user.data;

        if (new_id) {
            const find = await NewTV365.findOne({ new_id: new_id, $or: [{ md5: '' }, { md5: null }] });
            if (find) {
                await NewTV365.updateOne({
                    new_id: new_id,
                    new_user_id: user.idTimViec365,
                }, {
                    $set: {
                        new_md5: 1,
                        new_active: 0,
                    },
                });
                return functions.success(res, 'xóa bài tuyển dụng thành công');
            }
            return functions.setError(res, 'Tin tuyển dụng không tồn tại');
        }
        return functions.setError(res, 'thiếu dữ liệu');
    } catch (error) {
        return functions.setError(res, error);
    }
};

// hàm làm mới tin
exports.refreshNew = async(req, res, next) => {
    try {
        let idNew = req.body.new_id;
        if (idNew) {
            await NewTV365.updateOne({ new_id: idNew }, {
                $set: { new_update_time: functions.getTimeNow() },
            });
            // Xử lý luồng gửi data crm
            const user = req.user.data;
            await serviceCompany.CreateNewCrm(user.idTimViec365);
            return functions.success(res, 'làm mới bài tuyển dụng thành công');
        }
        return functions.setError(res, 'thiếu dữ liệu', 404);
    } catch (error) {
        return functions.setError(res, error);
    }
};

//trang chủ timviec
let listPostVLHD_home = [];
let listPostVLTH_home = [];
let listPostVLTG_home = [];
let dataSeo_home = [];
exports.homePage = async(req, res, next) => {
    try {
        // functions.success(res, "Lấy danh sách tin đăng thành công", { VLHD: listPostVLHD, VLTH: listPostVLTH, VLTG: listPostVLTG, dataSeo });
        functions.success(res, 'Lấy danh sách tin đăng thành công', {
            VLHD: listPostVLHD_home,
            VLTH: listPostVLTH_home,
            VLTG: listPostVLTG_home,
            dataSeo: dataSeo_home,
        });
        let pageSizeHD = Number(req.body.pageSizeHD) || 47;
        let pageSizeTH = Number(req.body.pageSizeTH) || 21;
        let pageSizeTG = Number(req.body.pageSizeTG) || 30;
        let now = functions.getTimeNow();
        let listsHot = [],
            listsGap = [],
            listsTH = [];
        const project = {
            _id: 0,
            new_id: 1,
            new_title: 1,
            new_han_nop: 1,
            new_do: 1,
            new_ghim: 1,
            new_hot: 1,
            new_gap: 1,
            new_cao: 1,
            new_thuc: 1,
            new_alias: 1,
            new_active: 1,
            new_money: 1,
            new_hinh_thuc: 1,
            new_city: 1,
            new_create_time: 1,
            new_update_time: 1,
            nm_id: 1,
            nm_type: 1,
            nm_min_value: 1,
            nm_max_value: 1,
            nm_unit: 1,
            new_badge: 1,
            new_view_count: 1,
            usc_badge: '$user.inForCompany.timviec365.usc_badge',
            usc_id: '$user.idTimViec365',
            usc_company: '$user.userName',
            usc_alias: '$user.alias',
            chat365_id: '$user._id',
            usc_time_login: '$user.time_login',
            usc_create_time: '$user.createdAt',
            usc_logo: '$user.avatarUser',
            usc_star: '$user.inForCompany.timviec365.usc_star',
            isOnline: '$user.isOnline',
        };
        let listPostVLHD = await NewTV365.aggregate([{
                $match: {
                    new_cao: 0,
                    new_gap: 0,
                    new_han_nop: { $gt: now },
                    new_user_id: { $ne: 0 },
                },
            },
            {
                $sort: {
                    new_hot: -1,
                    new_update_time: -1,
                },
            },
            {
                $skip: 0,
            },
            {
                $limit: Number(pageSizeHD),
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.type': 1,
                },
            },
            {
                $project: project,
            },
        ]);

        for (let i = 0; i < listPostVLHD.length; i++) {
            let element = listPostVLHD[i];
            let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
            element.usc_logo = avatarUser;
        }

        let listPostVLTH = [],
            listPostVLTG = [];
        listPostVLTH = await NewTV365.aggregate([{
                $match: {
                    new_hot: 0,
                    new_cao: 0,
                    new_han_nop: { $gt: now },
                    new_user_id: { $ne: 0 },
                },
            },
            {
                $sort: {
                    new_gap: -1,
                    new_update_time: -1,
                },
            },
            {
                $limit: Number(pageSizeTH),
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.type': 1,
                },
            },
            {
                $project: project,
            },
        ]);

        for (let i = 0; i < listPostVLTH.length; i++) {
            let element = listPostVLTH[i];
            let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
            element.usc_logo = avatarUser;
        }

        listPostVLTG = await NewTV365.aggregate([{
                $match: {
                    new_gap: 0,
                    new_hot: 0,
                    new_han_nop: { $gt: now },
                    new_user_id: { $ne: 0 },
                },
            },
            {
                $sort: {
                    new_cao: -1,
                    new_update_time: -1,
                },
            },
            {
                $skip: 0,
            },
            {
                $limit: Number(pageSizeTG),
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.type': 1,
                },
            },
            {
                $project: project,
            },
        ]);

        for (let i = 0; i < listPostVLTG.length; i++) {
            let element = listPostVLTG[i];
            let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
            element.usc_logo = avatarUser;
        }

        // Lấy bài viết chân trang
        const dataSeo = await TblModules.findOne({
            module: 'https://timviec365.vn/',
        }).lean();
        listPostVLHD_home = listPostVLHD;
        listPostVLTH_home = listPostVLTH;
        listPostVLTG_home = listPostVLTG;
        dataSeo_home = dataSeo;
        return true;
    } catch (error) {
        return functions.setError(res, error);
    }
};

// Tìm kiếm việc làm
exports.listJobBySearchAI = async(req, res, next) => {
    try {
        const request = req.body;
        let page = request.page || 1,
            pageSize = Number(request.pageSize) || 30,
            cate_id = Number(request.cate_id) || 0,
            city = Number(request.city) || 0,
            new_lv = request.new_lv,
            new_cap_bac = request.new_cap_bac,
            new_qh_id = request.new_qh_id,
            now = functions.getTimeNow(),
            type = request.type,
            list_id = request.list_id || null;
        let time_hn_max = now + 31536000,
            time_hn_min = now - 31536000;

        const skip = (page - 1) * pageSize;
        let condition = {
                new_active: { $ne: 0 },
                new_over: 0,
                $and: [{ new_han_nop: { $gte: time_hn_min } }],
                new_user_id: { $ne: 0 },
            },
            sort = {
                new_hot: -1,
                new_cao: -1,
                new_gap: -1,
                new_nganh: -1,
                new_update_time: -1,
                new_id: -1,
            };
        // Tìm kiếm việc làm theo ngành nghề
        // if (cate_id != 0) {
        //     condition.$and.push({
        //         $or: [
        //             { new_cat_id: cate_id },
        //             { new_real_cate_arr:cate_id}
        //             // { new_real_cate: { $regex: '(^|,)' + cate_id + '(^|,)' } },
        //             // { new_real_cate: cate_id },
        //             // { new_real_cate: { $regex: '(^)' + cate_id + '(^|,)' } },
        //             // { new_real_cate: { $regex: '(^|,)' + cate_id + '($)' } }
        //         ]
        //     });
        // }
        // // Tìm kiếm việc làm theo tỉnh thành
        // if (city != 0) {
        //     condition = {
        //         $or: [
        //             { new_city: { $all: [city] } }, { new_city: { $all: [0] } }
        //         ],
        //         ...condition
        //     };
        // }
        // // Tìm kiếm điều kiện có tag
        // if (new_lv) {
        //     condition = {
        //         $or: [
        //             { new_title: { $regex: new_lv, $options: 'i' } },
        //             { new_lv: { $regex: new_lv, $options: 'i' } },
        //         ],
        //         ...condition
        //     };
        // }
        // // Tìm kiếm điều kiện cấp bậc
        // if (new_cap_bac) {
        //     condition.new_cap_bac = new_cap_bac;
        // }
        // // Tìm kiếm điều kiện quận huyện
        // if (new_qh_id) {
        //     condition.new_qh_id = { $all: [new_qh_id] };
        // }

        // // Tìm kiếm điều kiện theo danh sách ID
        // if (list_id != null) {
        //     condition = {
        //         new_id: {
        //             $in: list_id.split(',').map(Number)
        //         }
        //     };
        // }

        // // Sắp xếp theo tin mới nhất
        // if (type && type == "new") {
        //     sort = { new_update_time: -1 };
        // }
        // // Sắp xếp theo mức lương
        // else if (type && type == "money") {
        //     sort = { new_money: -1 };
        // }

        const inputAI = JSON.parse(req.body.inputAI);
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.4:5001/search_tin',
            data: inputAI,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).catch((err) => {
            console.log(err);
        });

        let listNewId = response.data.data.list_id.split(',').map(Number);
        condition = {...condition, new_id: { $in: listNewId } };
        //---- luồng 1
        listJobNew = await NewTV365.aggregate([{
                $sort: sort,
            },
            {
                $match: condition,
            },
            {
                $skip: skip,
            },
            {
                $limit: Number(pageSize),
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.type': 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    new_id: 1,
                    new_title: 1,
                    new_money: 1,
                    new_user_id: 1,
                    new_city: 1,
                    new_cat_id: 1,
                    new_create_time: 1,
                    new_update_time: 1,
                    new_view_count: 1,
                    new_alias: 1,
                    new_ghim: 1,
                    new_hot: 1,
                    new_cao: 1,
                    new_gap: 1,
                    new_nganh: 1,
                    new_active: 1,
                    new_han_nop: 1,
                    new_yeucau: 1,
                    new_quyenloi: 1,
                    new_bang_cap: 1,
                    nm_type: 1,
                    nm_min_value: 1,
                    nm_max_value: 1,
                    new_exp: 1,
                    nm_unit: 1,
                    nm_id: 1,
                    usc_id: '$user.idTimViec365',
                    usc_create_time: '$user.createdAt',
                    usc_company: '$user.userName',
                    usc_alias: '$user.alias',
                    usc_logo: '$user.avatarUser',
                    usc_time_login: '$user.time_login',
                    usc_star: '$user.inForCompany.timviec365.usc_star',
                    chat365_secret: '$user.chat365_secret',
                    usc_city: '$user.city',
                    chat365_id: '$user._id',
                    isOnline: '$user.isOnline',
                    saved: '',
                    applied: '',
                    views: '',
                    new_badge: 1,
                },
            },
        ]);

        // Kiểm tra xem có đăng nhập hay không
        const user = await functions.getTokenUser(req, res, next);
        let listNewId_listLike = [];
        let listUserId_list = [];
        for (let i = 0; i < listJobNew.length; i++) {
            listNewId_listLike.push(Number(listJobNew[i].new_id));
            listUserId_list.push(Number(listJobNew[i].new_user_id));
        }
        // danh sách like
        let list_ListLikePost = await LikePost.aggregate([{
                $match: {
                    lk_new_id: { $in: listNewId_listLike },
                    lk_type: { $ne: 8 },
                    lk_for_comment: 0,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'lk_user_idchat',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $skip: 0,
            },
            {
                $project: {
                    lk_id: 1,
                    lk_type: 1,
                    lk_for_comment: 1,
                    lk_user_name: '$user.userName',
                    lk_user_avatar: '$user.avatarUser',
                    lk_user_idchat: '$user._id',
                },
            },
        ]);

        // danh sách share
        let list_ListSharePost = await LikePost.aggregate([{
                $match: {
                    lk_new_id: { $in: listNewId_listLike },
                    lk_type: { $eq: 8 },
                    lk_for_comment: 0,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'lk_user_idchat',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            // {
            //     $skip: 0
            // },
            {
                $project: {
                    lk_id: 1,
                    lk_type: 1,
                    lk_for_comment: 1,
                    lk_user_name: '$user.userName',
                    lk_user_avatar: '$user.avatarUser',
                    lk_user_idchat: '$user._id',
                },
            },
        ]);
        // tổng số bình luận
        let total_comments = await CommentPost.find({ cm_parent_id: 0, cm_new_id: { $in: listNewId_listLike } }, { cm_new_id: 1 }).lean();

        // tổng số huy hiệu tia sét
        let total_usc_badge = await NewTV365.find({ new_user_id: { $in: listUserId_list }, new_badge: 1 }).lean();

        // danh sách bình luận
        let list_arr_comments = await CommentPost.distinct('cm_sender_idcha cm_sender_name', {
            cm_new_id: { $in: listNewId_listLike },
            cm_parent_id: 0,
        });

        // kiểm tra hồ sơ ( luồng sau đăng nhập )
        let list_checkNopHoSo = [];
        if (user) {
            list_checkNopHoSo = await ApplyForJob.find({
                nhs_new_id: { $in: listNewId_listLike },
                nhs_use_id: user.idTimViec365,
            }).lean();
        }
        for (let i = 0; i < listJobNew.length; i++) {
            const element = listJobNew[i];
            let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
            element.usc_logo = avatarUser;
            element.new_city = element.new_city.toString();
            element.new_cat_id = element.new_cat_id.toString();

            // Lấy danh sách thả cảm xúc
            let ListLikePost = list_ListLikePost.filter((e) => e.lk_new_id == element.new_id);
            element.arr_likes_new = ListLikePost;
            // lấy danh sách chia sẻ
            const ListSharePost = list_ListSharePost.filter((e) => e.lk_new_id == element.new_id);

            element.arr_share_new = ListSharePost;

            // lấy tổng số bình luận
            element.count_comments = total_comments.filter((e) => e.cm_new_id == Number(element.new_id)).length;
            // element.count_comments = await CommentPost.countDocuments({ cm_parent_id: 0, cm_new_id: Number(element.new_id) });
            // Lấy huy hiệu tia sét
            //element.usc_badge = await NewTV365.countDocuments({ new_user_id: element.new_user_id, new_badge: 1 });
            element.usc_badge = total_usc_badge.filter((e) => e.new_user_id == element.new_user_id).length;
            // lấy danh sách bình luận
            element.arr_comments = list_arr_comments.filter((e) => e.cm_new_id == Number(element.new_id));
            // element.arr_comments = await CommentPost.distinct('cm_sender_idcha cm_sender_name', { cm_new_id: Number(element.new_id), cm_parent_id: 0 });
            if (user) {
                //let checkNopHoSo = await functions.getDatafindOne(ApplyForJob, { nhs_new_id: element.new_id, nhs_use_id: user.idTimViec365 });
                let checkNopHoSo = list_checkNopHoSo.find((e) => e.nhs_new_id == element.new_id);
                if (checkNopHoSo) {
                    element.applied = true;
                }
            }
        }

        // ---- luồng 2
        const total = await functions.findCount(NewTV365, condition);

        // -- luồng 3
        // Lấy bài viết chân trang
        const footerNew = await CategoryDes.findOne({
                cate_id: cate_id,
                city_id: city,
            },
            'cate_h1 cate_tt cate_tt1 cate_descri cate_tdgy cate_ndgy cate_des'
        ).lean();

        if (footerNew && footerNew.cate_des != '') {
            footerNew.cate_des = functions.renderCDNImage(footerNew.cate_des);
        }

        // // Chức danh
        let conditionChucDanh = [{
                $or: [
                    { key_name: { $regex: /thực tập/i } },
                    { key_name: { $regex: /nhân viên/i } },
                    { key_name: { $regex: /chuyên viên/i } },
                    { key_name: { $regex: /trưởng phòng/i } },
                    { key_name: { $regex: /trưởng nhóm/i } },
                    { key_name: { $regex: /trợ lý/i } },
                    { key_name: { $regex: /phó trưởng phòng/i } },
                    { key_name: { $regex: /phó giám đốc/i } },
                    { key_name: { $regex: /giám đốc/i } },
                    { key_name: { $regex: /quản lý/i } },
                    { key_name: { $regex: /quản đốc/i } },
                    { key_cb_id: { $ne: 0 } },
                ],
            },
            { key_301: '' },
        ];

        if (cate_id != 0) {
            conditionChucDanh = [
                ...conditionChucDanh,
                {
                    key_cate_lq: cate_id,
                },
            ];
        }
        if (city != 0) {
            conditionChucDanh = [
                ...conditionChucDanh,
                {
                    key_city_id: city,
                },
            ];
        }
        const listChucDanh = await Keyword.aggregate([{
                $match: {
                    $and: conditionChucDanh,
                },
            },
            { $limit: 20 },
            {
                $project: {
                    _id: 0,
                    key_id: 1,
                    key_cate_id: 1,
                    key_city_id: 1,
                    key_qh_id: 1,
                    key_name: 1,
                    key_cb_id: 1,
                    key_type: 1,
                },
            },
        ]);

        // Từ khóa liên quan (wordReacted)
        let listWordReacted = [];
        if (cate_id != 0) {
            listWordReacted = await Keyword.aggregate([{
                    $match: {
                        key_name: { $ne: '' },
                        key_301: '',
                        key_cb_id: 0,
                        key_city_id: city,
                        key_name: {
                            $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                        },
                        key_cate_lq: cate_id,
                    },
                },
                { $limit: 20 },
                {
                    $project: {
                        _id: 0,
                        key_id: 1,
                        key_cate_id: 1,
                        key_city_id: 1,
                        key_qh_id: 1,
                        key_name: 1,
                        key_cb_id: 1,
                        key_type: 1,
                    },
                },
            ]);
        }

        // Địa điểm (city)
        let listCityReated = [];
        if (city != 0 || cate_id != 0) {
            let conditionCityReated = {
                key_301: '',
                key_cb_id: 0,
                key_cate_id: 0,
            };
            if (cate_id != 0 && request.cate_name) {
                const cate_name = request.cate_name;
                conditionCityReated.key_city_id = { $ne: 0 };
                conditionCityReated.key_name = { $regex: cate_name };
            }
            if (city != 0) {
                conditionCityReated.key_name = '';
                conditionCityReated.key_qh_id = { $ne: 0 };
                conditionCityReated.key_city_id = city;
            }

            listCityReated = await Keyword.aggregate([{
                    $match: conditionCityReated,
                },
                {
                    $project: {
                        _id: 0,
                        key_id: 1,
                        key_cate_id: 1,
                        key_city_id: 1,
                        key_qh_id: 1,
                        key_name: 1,
                        key_cb_id: 1,
                        key_type: 1,
                    },
                },
            ]);
        }

        const listCongvieclienquan = [];
        return functions.success(res, 'Lấy danh sách tin đăng thành công', {
            items: listJobNew,
            total,
            footerNew,
            listChucDanh,
            listWordReacted,
            listCityReated,
            listCongvieclienquan,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};

// Tìm kiếm việc làm
exports.listJobBySearch = async(req, res, next) => {
    try {
        const request = req.body;
        let page = request.page || 1,
            pageSize = Number(request.pageSize) || 30,
            keyword = request.keyword,
            cate_id = Number(request.cate_id) || 0,
            city = Number(request.city) || 0,
            new_lv = request.new_lv,
            new_cap_bac = request.new_cap_bac,
            new_qh_id = request.new_qh_id,
            now = functions.getTimeNow(),
            type = request.type,
            list_id = request.list_id || null;
        let time_hn_max = now + 31536000,
            time_hn_min = now - 31536000;

        const skip = (page - 1) * pageSize;
        let condition = {
                new_active: { $ne: 0 },
                new_over: 0,
                $and: [{ new_han_nop: { $gte: time_hn_min } }],
                new_user_id: { $ne: 0 },
            },
            sort = {
                new_hot: -1,
                new_cao: -1,
                new_gap: -1,
                new_nganh: -1,
                new_update_time: -1,
                new_id: -1,
            };
        // Tìm kiếm việc làm theo ngành nghề
        if (cate_id != 0) {
            condition.$and.push({
                $or: [{ new_cat_id: cate_id }, { new_real_cate_arr: cate_id }],
            });
        }
        // Tìm kiếm việc làm theo tỉnh thành
        if (city != 0) {
            // condition = {
            //     $or: [
            //         { new_city: { $all: [city] } }, { new_city: { $all: [0] } }
            //     ],
            //     ...condition
            // };
            condition = {
                $or: [{ new_city: city }, { new_city: 0 }],
                ...condition,
            };
        }
        // Tìm kiếm điều kiện có tag
        if (new_lv) {
            condition = {
                $or: [{ new_title: { $regex: new_lv, $options: 'i' } }, { new_lv: { $regex: new_lv, $options: 'i' } }],
                ...condition,
            };
        }
        // Tìm kiếm điều kiện cấp bậc
        if (new_cap_bac) {
            condition.new_cap_bac = new_cap_bac;
        }
        // Tìm kiếm điều kiện quận huyện
        if (new_qh_id) {
            condition.new_qh_id = { $all: [new_qh_id] };
        }

        // Tìm kiếm điều kiện theo danh sách ID
        if (list_id != null) {
            condition = {
                new_id: {
                    $in: list_id.split(',').map(Number),
                },
            };
        }

        // Sắp xếp theo tin mới nhất
        if (type && type == 'new') {
            sort = { new_update_time: -1 };
        }
        // Sắp xếp theo mức lương
        else if (type && type == 'money') {
            sort = { new_money: -1 };
        }
        let listCampaign;
        if (page == 1) {
            listCampaign = await service.listNewCampaign(keyword);
            // listCampaign = [];
            // if (listCampaign.listNew) {
            //     // condition.new_id = {
            //     //     // $nin: listCampaign.listNew.split(',').map(Number)
            //     // }
            // }
        }

        // luồng 1
        let listJobNew = [];
        // luồng 2
        let total = 0;
        // -- luồng 3
        // Lấy bài viết chân trang
        let footerNew = [];
        let listChucDanh = [];
        let listWordReacted = [];
        let listCityReated = [];

        const condutionForSearch = condition;
        await Promise.all(
            [1, 2, 3, 4].map(async(index) => {
                if (index == 1) {
                    //---- luồng 1
                    // console.log("Luồng 1", new Date());

                    listJobNew = await NewTV365.aggregate([{
                            $sort: sort,
                        },
                        {
                            $match: condutionForSearch,
                        },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: Number(pageSize),
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'new_user_id',
                                foreignField: 'idTimViec365',
                                as: 'user',
                            },
                        },
                        {
                            $unwind: '$user',
                        },
                        {
                            $match: {
                                'user.type': 1,
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                new_id: 1,
                                new_title: 1,
                                new_money: 1,
                                new_user_id: 1,
                                new_city: 1,
                                new_cat_id: 1,
                                new_create_time: 1,
                                new_update_time: 1,
                                new_view_count: 1,
                                new_alias: 1,
                                new_ghim: 1,
                                new_hot: 1,
                                new_cao: 1,
                                new_gap: 1,
                                new_nganh: 1,
                                new_active: 1,
                                new_han_nop: 1,
                                new_yeucau: 1,
                                new_quyenloi: 1,
                                new_bang_cap: 1,
                                nm_type: 1,
                                nm_min_value: 1,
                                nm_max_value: 1,
                                new_exp: 1,
                                nm_unit: 1,
                                nm_id: 1,
                                usc_id: '$user.idTimViec365',
                                usc_create_time: '$user.createdAt',
                                usc_company: '$user.userName',
                                usc_alias: '$user.alias',
                                usc_logo: '$user.avatarUser',
                                usc_time_login: '$user.time_login',
                                usc_star: '$user.inForCompany.timviec365.usc_star',
                                chat365_secret: '$user.chat365_secret',
                                usc_city: '$user.city',
                                chat365_id: '$user._id',
                                isOnline: '$user.isOnline',
                                saved: '',
                                applied: '',
                                views: '',
                                new_badge: 1,
                                new_qc: 'false',
                            },
                        },
                    ]);
                    if (page == 1) {
                        if (listCampaign.list_top.length > 0) {
                            listJobNew = [...listCampaign.list_top, ...listJobNew];
                        }
                        if (listCampaign.list_bot.length > 0) {
                            listJobNew = [...listJobNew, ...listCampaign.list_bot];
                        }
                    }
                    // Kiểm tra xem có đăng nhập hay không
                    let user;
                    user = await functions.getTokenUser(req, res, next);

                    let listNewId_listLike = [];
                    let listUserId_list = [];
                    for (let i = 0; i < listJobNew.length; i++) {
                        listNewId_listLike.push(Number(listJobNew[i].new_id));
                        listUserId_list.push(Number(listJobNew[i].new_user_id));
                    }

                    // 1. danh sách like
                    let list_ListLikePost = [];

                    //2. danh sách share
                    let list_ListSharePost = [];

                    //3 tổng số bình luận
                    let total_comments = [];

                    //4 tổng số huy hiệu tia sét
                    let total_usc_badge = [];

                    //5 danh sách bình luận
                    let list_arr_comments = [];

                    //6 kiểm tra hồ sơ ( luồng sau đăng nhập )
                    let list_checkNopHoSo = [];

                    await Promise.all(
                        [1, 2, 3, 4, 5, 6].map(async(index2) => {
                            if (index2 == 1) {
                                list_ListLikePost = await LikePost.aggregate([{
                                        $match: {
                                            lk_new_id: { $in: listNewId_listLike },
                                            lk_type: { $ne: 8 },
                                            lk_for_comment: 0,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'Users',
                                            localField: 'lk_user_idchat',
                                            foreignField: '_id',
                                            as: 'user',
                                        },
                                    },
                                    {
                                        $unwind: '$user',
                                    },
                                    {
                                        $skip: 0,
                                    },
                                    {
                                        $project: {
                                            lk_id: 1,
                                            lk_type: 1,
                                            lk_for_comment: 1,
                                            lk_user_name: '$user.userName',
                                            lk_user_avatar: '$user.avatarUser',
                                            lk_user_idchat: '$user._id',
                                        },
                                    },
                                ]);
                            } else if (index2 == 2) {
                                list_ListSharePost = await LikePost.aggregate([{
                                        $match: {
                                            lk_new_id: { $in: listNewId_listLike },
                                            lk_type: { $eq: 8 },
                                            lk_for_comment: 0,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'Users',
                                            localField: 'lk_user_idchat',
                                            foreignField: '_id',
                                            as: 'user',
                                        },
                                    },
                                    {
                                        $unwind: '$user',
                                    },
                                    // {
                                    //     $skip: 0
                                    // },
                                    {
                                        $project: {
                                            lk_id: 1,
                                            lk_type: 1,
                                            lk_for_comment: 1,
                                            lk_user_name: '$user.userName',
                                            lk_user_avatar: '$user.avatarUser',
                                            lk_user_idchat: '$user._id',
                                        },
                                    },
                                ]);
                            } else if (index2 == 3) {
                                total_comments = await CommentPost.find({ cm_parent_id: 0, cm_new_id: { $in: listNewId_listLike } }, { cm_new_id: 1 }).lean();
                            } else if (index2 == 4) {
                                total_usc_badge = await NewTV365.find({
                                    new_user_id: { $in: listUserId_list },
                                    new_badge: 1,
                                }).lean();
                            } else if (index2 == 5) {
                                list_arr_comments = await CommentPost.distinct('cm_sender_idcha cm_sender_name', {
                                    cm_new_id: { $in: listNewId_listLike },
                                    cm_parent_id: 0,
                                });
                            } else if (index2 == 6) {
                                if (user) {
                                    list_checkNopHoSo = await ApplyForJob.find({
                                        nhs_new_id: { $in: listNewId_listLike },
                                        nhs_use_id: user.idTimViec365,
                                    }).lean();
                                }
                            }
                        })
                    );
                    for (let i = 0; i < listJobNew.length; i++) {
                        const element = listJobNew[i];
                        let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                        element.usc_logo = avatarUser;
                        element.new_city = element.new_city.toString();
                        element.new_cat_id = element.new_cat_id.toString();

                        // Lấy danh sách thả cảm xúc
                        let ListLikePost = list_ListLikePost.filter((e) => e.lk_new_id == element.new_id);
                        element.arr_likes_new = ListLikePost;
                        // lấy danh sách chia sẻ
                        const ListSharePost = list_ListSharePost.filter((e) => e.lk_new_id == element.new_id);

                        element.arr_share_new = ListSharePost;

                        // lấy tổng số bình luận
                        element.count_comments = total_comments.filter(
                            (e) => e.cm_new_id == Number(element.new_id)
                        ).length;
                        // element.count_comments = await CommentPost.countDocuments({ cm_parent_id: 0, cm_new_id: Number(element.new_id) });
                        // Lấy huy hiệu tia sét
                        //element.usc_badge = await NewTV365.countDocuments({ new_user_id: element.new_user_id, new_badge: 1 });
                        element.usc_badge = total_usc_badge.filter((e) => e.new_user_id == element.new_user_id).length;
                        // lấy danh sách bình luận
                        element.arr_comments = list_arr_comments.filter((e) => e.cm_new_id == Number(element.new_id));
                        // element.arr_comments = await CommentPost.distinct('cm_sender_idcha cm_sender_name', { cm_new_id: Number(element.new_id), cm_parent_id: 0 });
                        if (user) {
                            //let checkNopHoSo = await functions.getDatafindOne(ApplyForJob, { nhs_new_id: element.new_id, nhs_use_id: user.idTimViec365 });
                            let checkNopHoSo = list_checkNopHoSo.find((e) => e.nhs_new_id == element.new_id);
                            if (checkNopHoSo) {
                                element.applied = true;
                            }
                        }
                    }
                    // console.log("Luồng 1 end", new Date());
                } else if (index == 2) {
                    // ---- luồng 2
                    // console.log("Luồng 2", new Date());
                    // let condition_tempt = condition;
                    // condition_tempt['new_id'] = { $gte: 300000 }
                    total_tempt = await functions.findCount(NewTV365, {...condition, new_id: { $lte: 300000 } });
                    total = total + total_tempt;
                    // console.log("Luồng 2 end", new Date());
                } else if (index == 3) {
                    // ---- luồng 3
                    // console.log("Luồng 3", new Date());
                    // let condition_tempt = condition;
                    // condition_tempt['new_id'] = { $lte: 300000 }
                    total_tempt = await functions.findCount(NewTV365, {...condition, new_id: { $lte: 300000 } });
                    total = total + total_tempt;
                    // console.log("Luồng 3 end", new Date());
                } else if (index == 4) {
                    // console.log("Luồng 4", new Date());
                    footerNew = await CategoryDes.findOne({
                            cate_id: cate_id,
                            city_id: city,
                        },
                        'cate_h1 cate_tt cate_tt1 cate_descri cate_tdgy cate_ndgy cate_des'
                    ).lean();

                    if (footerNew && footerNew.cate_des != '') {
                        footerNew.cate_des = functions.renderCDNImage(footerNew.cate_des);
                    }

                    // Chức danh
                    let conditionChucDanh = [{
                            $or: [
                                { key_name: { $regex: /thực tập/i } },
                                { key_name: { $regex: /nhân viên/i } },
                                { key_name: { $regex: /chuyên viên/i } },
                                { key_name: { $regex: /trưởng phòng/i } },
                                { key_name: { $regex: /trưởng nhóm/i } },
                                { key_name: { $regex: /trợ lý/i } },
                                { key_name: { $regex: /phó trưởng phòng/i } },
                                { key_name: { $regex: /phó giám đốc/i } },
                                { key_name: { $regex: /giám đốc/i } },
                                { key_name: { $regex: /quản lý/i } },
                                { key_name: { $regex: /quản đốc/i } },
                                { key_cb_id: { $ne: 0 } },
                            ],
                        },
                        { key_301: '' },
                    ];

                    if (cate_id != 0) {
                        conditionChucDanh = [
                            ...conditionChucDanh,
                            {
                                key_cate_lq: cate_id,
                            },
                        ];
                    }
                    if (city != 0) {
                        conditionChucDanh = [
                            ...conditionChucDanh,
                            {
                                key_city_id: city,
                            },
                        ];
                    }
                    listChucDanh = await Keyword.aggregate([{
                            $match: {
                                $and: conditionChucDanh,
                            },
                        },
                        { $limit: 20 },
                        {
                            $project: {
                                _id: 0,
                                key_id: 1,
                                key_cate_id: 1,
                                key_city_id: 1,
                                key_qh_id: 1,
                                key_name: 1,
                                key_cb_id: 1,
                                key_type: 1,
                            },
                        },
                    ]);

                    // Từ khóa liên quan (wordReacted)
                    if (cate_id != 0) {
                        listWordReacted = await Keyword.aggregate([{
                                $match: {
                                    key_name: { $ne: '' },
                                    key_301: '',
                                    key_cb_id: 0,
                                    key_city_id: city,
                                    key_name: {
                                        $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                                    },
                                    key_cate_lq: cate_id,
                                },
                            },
                            { $limit: 20 },
                            {
                                $project: {
                                    _id: 0,
                                    key_id: 1,
                                    key_cate_id: 1,
                                    key_city_id: 1,
                                    key_qh_id: 1,
                                    key_name: 1,
                                    key_cb_id: 1,
                                    key_type: 1,
                                },
                            },
                        ]);
                    }

                    // Địa điểm (city)
                    if (city != 0 || cate_id != 0) {
                        let conditionCityReated = {
                            key_301: '',
                            key_cb_id: 0,
                            key_cate_id: 0,
                        };
                        if (cate_id != 0 && request.cate_name) {
                            const cate_name = request.cate_name;
                            conditionCityReated.key_city_id = { $ne: 0 };
                            conditionCityReated.key_name = { $regex: cate_name };
                        }
                        if (city != 0) {
                            conditionCityReated.key_name = '';
                            conditionCityReated.key_qh_id = { $ne: 0 };
                            conditionCityReated.key_city_id = city;
                        }

                        listCityReated = await Keyword.aggregate([{
                                $match: conditionCityReated,
                            },
                            {
                                $project: {
                                    _id: 0,
                                    key_id: 1,
                                    key_cate_id: 1,
                                    key_city_id: 1,
                                    key_qh_id: 1,
                                    key_name: 1,
                                    key_cb_id: 1,
                                    key_type: 1,
                                },
                            },
                        ]);
                    }
                    // console.log("Luồng 4 end", new Date());
                }
            })
        );

        const listCongvieclienquan = [];
        return functions.success(res, 'Lấy danh sách tin đăng thành công', {
            items: listJobNew,
            total,
            footerNew,
            listChucDanh,
            listWordReacted,
            listCityReated,
            listCongvieclienquan,
            condition: condutionForSearch,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

// chi tiết tin tuyển dụng - server
exports.detail = async(req, res, next) => {
    try {
        let newID = Number(req.body.new_id);
        let statusApply = false;
        let statusSavePost = false;

        if (newID) {
            let sum_star = 0;
            let count_star = 0;
            let voted = 0;
            let listVoteData = await SaveVote.find({ id_be_vote: newID }).lean();
            if (listVoteData.length) {
                voted = 1;
                for (let i = 0; i < listVoteData.length; i++) {
                    sum_star = sum_star + listVoteData[i].star;
                    count_star = count_star + 1;
                }
            }
            let result = await NewTV365.aggregate([{
                    $match: { new_id: Number(newID) },
                },
                {
                    $lookup: {
                        from: 'City',
                        localField: 'new_city',
                        foreignField: '_id',
                        as: 'City',
                    },
                },
                { $unwind: { path: '$City', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'District',
                        localField: 'new_qh_id',
                        foreignField: '_id',
                        as: 'District',
                    },
                },
                { $unwind: { path: '$District', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                { $match: { 'user.type': 1 } },
                { $skip: 0 },
                { $limit: 1 },
                {
                    $project: {
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_alias: 1,
                        new_cat_id: 1,
                        new_lv: 1,
                        new_addr: 1,
                        new_city: 1,
                        new_qh_id: 1,
                        new_user_id: 1,
                        new_money: 1,
                        new_cap_bac: 1,
                        new_exp: 1,
                        new_bang_cap: 1,
                        new_gioi_tinh: 1,
                        new_so_luong: 1,
                        new_hinh_thuc: 1,
                        new_create_time: 1,
                        new_update_time: 1,
                        new_view_count: 1,
                        new_han_nop: 1,
                        new_hot: 1,
                        new_tgtv: 1,
                        new_images: 1,
                        new_video: 1,
                        new_video_type: 1,
                        new_mota: 1,
                        new_quyenloi: 1,
                        new_hoahong: 1,
                        new_do: 1,
                        new_ho_so: 1,
                        nm_type: 1,
                        nm_id: 1,
                        nm_min_value: 1,
                        nm_max_value: 1,
                        nm_unit: 1,
                        new_301: 1,
                        new_yeucau: 1,
                        nm_unit: 1,
                        new_tgtv: 1,
                        new_lv: 1,
                        new_user_id: 1,
                        new_active: 1,
                        new_title_seo: 1,
                        new_md5: 1,
                        new_des_seo: 1,
                        no_jobposting: 1,
                        new_badge: 1,
                        new_test: 1,
                        new_gap: 1,
                        new_hot: 1,
                        new_cao: 1,
                        new_nganh: 1,
                        new_ghim: 1,
                        new_do: 1,
                        new_thuc: 1,
                        new_vip_time: 1,
                        new_cate_time: 1,
                        new_bao_luu: 1,
                        new_order: 1,
                        link_video: 1,
                        usc_id: '$user.idTimViec365',
                        id_qlc: '$user.idQLC',
                        usc_company: '$user.userName',
                        usc_alias: '$user.alias',
                        usc_phone: '$user.phone',
                        usc_phone_tk: '$user.phoneTK',
                        usc_logo: '$user.avatarUser',
                        usc_address: '$user.address',
                        usc_name: '$user.userName',
                        usc_name_add: '$user.inForCompany.timviec365.usc_name_add',
                        usc_name_phone: '$user.inForCompany.timviec365.usc_name_phone',
                        usc_name_email: '$user.inForCompany.timviec365.usc_name_email',
                        usc_email: '$user.email',
                        usc_create_time: '$user.createdAt',
                        usc_pass: '$user.password',
                        usc_badge: '$user.inForCompany.timviec365.usc_badge',
                        usc_star: '$user.inForCompany.timviec365.usc_star',
                        chat365_id: '$user._id',
                        isOnline: '$user.isOnline',
                        usc_time_login: '$user.time_login',
                        chat365_secret: '$user.chat365_secret',
                        name_city: '$City.name',
                        name_district: '$District.name',
                        usc_video_com: '',
                        new_audio: 1,
                        new_trans_audio: 1,
                    },
                },
            ]);
            if (result.length > 0) {
                const post = result[0];
                //xử lí tên tỉnh thành nếu không có
                if (!post.name_city) post.name_city = 'Toàn Quốc';
                //xử lí mức lương
                post.new_money_str = await functions.new_money_tv(
                    0,
                    0,
                    post.nm_unit,
                    post.nm_min_value,
                    post.nm_max_value,
                    post.new_money
                );
                // Tăng lượt xem
                await NewTV365.updateOne({ new_id: newID }, {
                    $set: { new_view_count: Number(post.new_view_count) + 1 },
                });

                // Xử lý hình ảnh cdn
                post.usc_logo = functions.getUrlLogoCompany(post.usc_create_time, post.usc_logo);
                post.saved = statusSavePost;
                post.applied = statusApply;
                if (!post.new_des_seo) {
                    post.new_des_seo = '';
                }
                //Xử lý ngành nghề cho app
                const jobGet = await Category.find({ cat_id: { $in: post.new_cat_id } }, { cat_id: 1, cat_name: 1 }).lean();
                if (jobGet) {
                    const dataJob = jobGet.map((item) => item.cat_name);
                    post.cat_name_full = dataJob.toString();
                } else {
                    post.cat_name_full = null;
                }
                // Xử lý hiển thị hình ảnh
                if (post.new_images != '' && post.new_images != null) {
                    let array_new_images =
                        typeof post.new_images == 'string' ? post.new_images.split(',') : post.new_images;
                    let array_new_images_check = [];
                    for (let m = 0; m < array_new_images.length; m++) {
                        if (serviceCompany.checkStorageVideo(post.usc_create_time, array_new_images[m])) {
                            array_new_images_check.push(
                                serviceCompany.urlStorageVideo(post.usc_create_time, array_new_images[m])
                            );
                        }
                    }
                    array_new_images = array_new_images_check;
                    post.new_images = array_new_images.toString();
                    post.new_images_for_app = array_new_images;
                } else {
                    post.new_images_for_app = [];
                }

                if (post.new_video != '' && post.new_video != null) {
                    post.new_video = serviceCompany.urlStorageVideo(post.usc_create_time, post.new_video);
                }
                // Xử lý đếm số sao đánh giá
                const countVote = await SaveVote.aggregate([
                    { $match: { id_be_vote: newID, type: 'new' } },
                    {
                        $group: {
                            _id: null,
                            sum: { $sum: '$star' },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                if (countVote.length > 0) {
                    post.sum_star = countVote[0].sum;
                    post.count_star = countVote[0].count;
                }

                post.resultCountVote = [];
                for (let n = 1; n <= 5; n++) {
                    const result = await SaveVote.countDocuments({
                        id_be_vote: newID,
                        type: 'new',
                        star: n,
                    });
                    post.resultCountVote.push(result);
                }

                // Xử lý chuyển từ mảng -> chuỗi phục vụ trả về cho frontend
                const array_new_cat = post.new_cat_id,
                    new_cat_id = post.new_cat_id.toString(),
                    array_new_city = post.new_city,
                    new_city = post.new_city.toString(),
                    array_new_qh = post.new_qh_id,
                    new_qh_id = post.new_qh_id.toString();

                // Trả về cho frontend dạng text
                post.new_cat_id = new_cat_id;
                post.new_city = new_city;
                post.new_qh_id = new_qh_id;

                // Xử lý lĩnh vực
                let list_lv = [];
                if (post.new_lv != null) {
                    list_lv = await Keyword.find({
                            key_name: { $ne: '' },
                            key_cate_id: 0,
                            key_city_id: 0,
                            key_cb_id: 0,
                            key_301: '',
                            key_name: { $in: post.new_lv.split(',') },
                        })
                        .select('key_name key_id key_type')
                        .lean();
                }
                post.list_lv = list_lv;

                let list_qh = [];
                // Lấy ra danh sách tag theo quận huyện
                if (array_new_qh.length > 0) {
                    list_qh = await Keyword.find({
                            key_name: '',
                            key_cate_id: 0,
                            key_city_id: { $ne: 0 },
                            key_qh_id: { $ne: 0 },
                            key_cb_id: 0,
                            key_qh_id: { $in: array_new_qh },
                        })
                        .select('key_id key_city_id key_qh_id')
                        .lean();
                }
                post.list_qh = list_qh;
                //Xử lí tên tỉnh thành cho tiện ích app chat
                if (post.new_city != '' && post.new_city != null && post.new_city != 0) {
                    let array_name_city = typeof post.new_city == 'string' ? post.new_city.split(',') : post.new_city;
                    for (let t = 0; t < array_name_city.length; t++) {
                        let cit = await City.findOne({ _id: array_name_city[t] }).select('name').lean();
                        if (cit) array_name_city[t] = cit.name;
                    }

                    post.new_name_cit = array_name_city.toString();
                } else {
                    post.new_name_cit = 'Toàn quốc';
                }
                //Xử lí quân huyện
                if (post.new_qh_id != '' && post.new_qh_id != null && post.new_qh_id != 0) {
                    let array_new_qh_id =
                        typeof post.new_qh_id == 'string' ? post.new_qh_id.split(',') : post.new_qh_id;
                    for (let t = 0; t < array_new_qh_id.length; t++) {
                        let dis = await District.findOne({ _id: array_new_qh_id[t] }).select('name').lean();
                        if (dis) array_new_qh_id[t] = dis.name;
                    }

                    post.new_name_qh = array_new_qh_id.toString();
                } else {
                    post.new_name_qh = '';
                }
                let listApplyText = '';
                const user = await functions.getTokenUser(req, res);
                // Xử lý luồng người dùng đăng nhập
                if (user) {
                    const userID = user.idTimViec365;
                    // Xử lý luồng đánh giá sao
                    let user_type_vote = 1;
                    if (user.type == 0 || user.type == 2) {
                        user_type_vote = 0;
                    }
                    const votePost = await functions.getDatafindOne(SaveVote, {
                        id_be_vote: newID,
                        type: 'new',
                        userId: userID,
                        user_type_vote: user_type_vote,
                    });
                    if (votePost) {
                        post.voted = 1;
                    }

                    // Xử lý luồng ứng viên
                    if (user.type != 1) {
                        //check ứng viên ứng tuyển hoặc lưu tin
                        const apply = await functions.getDatafindOne(ApplyForJob, {
                                nhs_use_id: userID,
                                nhs_new_id: newID,
                                nhs_kq: { $ne: 10 },
                            }),
                            savePost = await functions.getDatafindOne(UserSavePost, { use_id: userID, new_id: newID });

                        if (apply) post.applied = true;
                        if (savePost) post.saved = true;

                        // Danh sách id tin tuyển dụng ứng viên đã ứng tuyển
                        const listApply = ApplyForJob.find({ nhs_use_id: userID, nhs_new_id: newID, nhs_kq: { $ne: 10 } }, { nhs_new_id: 1 }).lean();
                        let arrIdApply = [];
                        for (let i = 0; i < listApply.length; i++) {
                            const element = listApply[i];
                            arrIdApply.push(element.nhs_new_id);
                        }
                        listApplyText = arrIdApply.toString();

                        // Thêm vào lịch sử xem tin
                        const getItemMaxHistory = await TblHistoryViewed.findOne({}, { id: 1 })
                            .sort({ id: -1 })
                            .limit(1)
                            .lean();
                        const itemHistory = new TblHistoryViewed({
                            id: Number(getItemMaxHistory.id) + 1,
                            id_uv: userID,
                            id_new: newID,
                            time_view: functions.getTimeNow(),
                        });
                        await itemHistory.save();

                        // Check hồ sơ
                        const check_hs = await Profile.find({ hs_use_id: userID }, {
                            hs_id: 1,
                            hs_link: 1,
                            hs_active: 1,
                            hs_name: 1,
                            hs_create_time: 1,
                        }).limit(3);

                        if (check_hs) {
                            if (check_hs.length < 2) {
                                post.tv365_nc = 0;
                            } else {
                                post.tv365_nc = 2;
                            }
                        }
                    }
                }
                post.listApplyText = listApplyText;
                // Kết thúc luồng xử lý ứng viên đăng nhập

                //box đia điểm
                let findKeyCity = await Keyword.find({
                    key_cb_id: 0,
                    key_cate_id: 0,
                    key_name: '',
                    key_qh_id: { $ne: 0 },
                    key_city_id: { $in: array_new_city },
                }, {
                    _id: 1,
                    key_id: 1,
                    key_cate_id: 1,
                    key_city_id: 1,
                    key_qh_id: 1,
                    key_type: 1,
                }).limit(20);

                //box chức danh
                let title = post.new_title.toLowerCase();

                let keyName = [
                    'thực tập',
                    'chuyên viên',
                    'nhân viên',
                    'trưởng phòng',
                    'trưởng nhóm',
                    'trợ lý',
                    'phó trưởng phòng',
                    'phó giám đốc',
                    'giám đốc',
                    'quản lý',
                    'quản đốc',
                ];

                let findChucDanh = await Keyword.find({
                        key_name: { $in: keyName.map((name) => new RegExp(name, 'i')) },
                        key_cate_lq: { $in: array_new_cat },
                        key_city_id: { $in: array_new_city },
                        $or: [{ key_qh_id: { $in: array_new_qh } }, { key_qh_id: { $nin: array_new_qh } }],
                    }, {
                        _id: 1,
                        key_id: 1,
                        key_cate_id: 1,
                        key_name: 1,
                        key_city_id: 1,
                        key_qh_id: 1,
                        key_cb_id: 1,
                        key_type: 1,
                    })
                    .sort({ key_qh_id: { $in: array_new_qh } ? -1 : 1 })
                    .limit(20);

                //box từ khóa liên quan

                let keyNameLq1 = [
                    'tuyển',
                    'gấp',
                    'hot',
                    'tại',
                    'thực tập',
                    'nhân viên',
                    'chuyên viên',
                    'giám đốc',
                    'trưởng phòng',
                    'trưởng nhóm',
                    'trợ lý',
                    'phó trưởng phòng',
                    'phó giám đốc',
                    'quản lý',
                    'quản đốc',
                ];

                const keyNameLq2 = `(${keyNameLq1.join('|')})`;
                let findTuKhoaLienQuan = await Keyword.find({
                        key_name: { $not: { $regex: keyNameLq2, $options: 'i' } },
                        key_name: { $ne: '' },
                        key_city_id: 0,
                        key_cate_lq: { $in: array_new_cat },
                        key_cb_id: 0,
                        $or: [{ key_qh_id: { $in: array_new_qh } }, { key_qh_id: { $nin: array_new_qh } }],
                    }, {
                        _id: 1,
                        key_id: 1,
                        key_cate_id: 1,
                        key_city_id: 1,
                        key_name: 1,
                        key_qh_id: 1,
                        key_type: 1,
                    })
                    .sort({ key_qh_id: { $in: array_new_qh } ? -1 : 1 })
                    .limit(20);

                let keyBlogLienQuan = await functions.replaceMQ(post.new_title);
                keyBlogLienQuan = await functions.replaceKeywordSearch(1, keyBlogLienQuan);
                keyBlogLienQuan = await functions.removerTinlq(keyBlogLienQuan);
                let regexKeyBlog = new RegExp(keyBlogLienQuan.replace(/\s+/g, '|'), 'i');

                //box hướng dẫn
                let huongDan = await Blog.find({
                        new_title: { $regex: regexKeyBlog },
                    }, { new_id: 1, new_title: 1, new_title_rewrite: 1, new_picture: 1 })
                    .sort({ new_id: -1 })
                    .limit(4);

                for (let i = 0; i < huongDan.length; i++) {
                    const element = huongDan[i];
                    element.new_picture = functions.getPictureBlogTv365(element.new_picture);
                }

                return functions.success(res, 'Chi tiết tin tuyển dụng', {
                    data: post,
                    dia_diem: findKeyCity,
                    chuc_danh: findChucDanh,
                    tu_khoa: findTuKhoaLienQuan,
                    HuongDan: huongDan,
                    sum_star,
                    count_star,
                    voted,
                });
            }
            return functions.setError(res, 'không có tin tuyển dụng này', 404);
        }
        return functions.setError(res, 'thiếu dữ liệu', 404);
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// danh sách bình luận của chi tiết tin
exports.listComment = async(req, res) => {
    try {
        const request = req.body,
            new_id = Number(request.new_id) || null,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10,
            skip = (page - 1) * pageSize;
        if (new_id) {
            const checkNew = await NewTV365.countDocuments({ new_id: new_id });
            if (checkNew > 0) {
                const result = await service.inforLikeComment(new_id);
                // lấy danh sách bình luận
                // const listComment = await CommentPost.find({ cm_new_id: new_id, cm_parent_id: 0 })
                // .skip(skip)
                // .limit(pageSize)
                // .sort({ cm_time: -1 })
                // .lean();
                const listComment = await CommentPost.aggregate([
                    { $match: { cm_new_id: new_id, cm_parent_id: 0 } },
                    { $sort: { cm_id: -1 } },
                    { $skip: skip },
                    { $limit: pageSize },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'cm_sender_idchat',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    { $unwind: '$user' },
                    {
                        $project: {
                            cm_id: 1,
                            cm_new_id: 1,
                            cm_parent_id: 1,
                            cm_comment: 1,
                            cm_time: 1,
                            cm_sender_idchat: 1,
                            cm_sender_name: '$user.userName',
                            cm_sender_avatar: '$user.avatarUser',
                            usc_create_time: '$user.createdAt',
                            cm_sender_type: '$user.type',
                            cm_tag: 1,
                            cm_img: 1,
                        },
                    },
                ]);
                for (let i = 0; i < listComment.length; i++) {
                    const element = listComment[i];
                    element.cm_sender_avatar = functions.getUrlLogoCompany(
                        element.usc_create_time,
                        element.cm_sender_avatar
                    );
                    element.cm_img = service.getUrlIMGComment(element.cm_time, element.cm_img);
                    const arr_likes = await service.inforLikeChild(new_id, element.cm_id);
                    element.arr_likes = arr_likes;

                    const arr_reply = await service.inforCommentChild(new_id, element.cm_id);
                    element.arr_reply = arr_reply;
                }
                return functions.success(res, 'Danh sách bình luận', {
                    arr_likes_new: result.arr_likes_new,
                    arr_share_new: result.arr_share_new,
                    arr_comments: listComment,
                    count_comments: result.count_comments,
                });
            }
            return functions.setError(res, 'Tin không tồn tại');
        }
        return functions.setError(res, 'Chưa truyền ID');
    } catch (error) {
        return functions.setError(res, error);
    }
};
// ren ra url tìm kiếm việc làm
exports.renderUrlSearch = async(req, res, next) => {
    try {
        const request = req.body,
            cate_id = Number(request.cate_id) || 0,
            city_id = Number(request.city_id) || 0,
            key_word = request.key_word || '',
            district_id = Number(request.district_id) || 0,
            cb_id = Number(request.cb_id) || 0;
        let result = [];
        if (district_id == 0) {
            result = await Keyword.findOne({
                key_name: { $regex: key_word, $options: 'i' },
                key_cate_id: cate_id,
                key_city_id: city_id,
                key_cb_id: cb_id,
                key_qh_id: 0,
            }).lean();
        } else {
            var match = await Keyword.aggregate([{
                    $match: {
                        key_name: key_word,
                        key_cate_id: cate_id,
                        key_city_id: city_id,
                        key_cb_id: cb_id,
                        key_qh_id: district_id,
                    },
                },
                {
                    $lookup: {
                        from: 'District',
                        localField: 'key_qh_id',
                        foreignField: '_id',
                        as: 'qh',
                    },
                },
                {
                    $unwind: '$qh',
                },
                { $limit: 1 },
                {
                    $project: {
                        _id: 0,
                        key_id: 1,
                        key_type: 1,
                        key_err: 1,
                        key_cb_id: 1,
                        key_qh_id: 1,
                        cit_name: '$qh.name',
                    },
                },
            ]);
            if (match) {
                result = match[0];
            } else {
                result = [];
            }
        }

        await functions.success(res, 'Kết quả tìm kiếm', { result: result });
    } catch (error) {
        return functions.setError(res, error);
    }
};

// trả ra thông tin seo của tag để tìm kiếm api
exports.getDataTag = async(req, res, next) => {
    const request = req.body,
        keyid = request.keyid || 0,
        keyw = request.keyw || '';
    let data;
    if (keyid != 0) {
        data = await Keyword.findOne({
            key_id: keyid,
        }).lean();
    } else {
        data = await Keyword.findOne({
            key_name: keyw,
            key_err: 1,
        });
    }

    if (data) {
        data.key_teaser = functions.renderCDNImage(data.key_teaser);
    }

    return functions.success(res, 'lấy thông tin thành công', { data });
};

exports.addNewFromTv365 = async(req, res) => {
    try {
        // return functions.success(res, "Xóa xong");
        let request = req.body,
            new_id = request.new_id,
            new_title = request.new_title,
            new_md5 = request.new_md5,
            new_alias = request.new_alias,
            new_301 = request.new_301,
            new_cat_id = request.new_cat_id,
            new_real_cate = request.new_real_cate,
            new_city = request.new_city,
            new_qh_id = request.new_qh_id,
            new_addr = request.new_addr,
            new_money = request.new_money,
            new_cap_bac = request.new_cap_bac,
            new_exp = request.new_exp,
            new_bang_cap = request.new_bang_cap,
            new_gioi_tinh = request.new_gioi_tinh,
            new_so_luong = request.new_so_luong,
            new_hinh_thuc = request.new_hinh_thuc,
            new_user_id = request.new_user_id,
            new_user_redirect = request.new_user_redirect,
            new_do_tuoi = request.new_do_tuoi,
            new_create_time = request.new_create_time,
            new_update_time = request.new_update_time,
            new_vip_time = request.new_vip_time,
            new_vip = request.new_vip,
            new_cate_time = request.new_cate_time,
            new_active = request.new_active,
            new_type = request.new_type,
            new_over = request.new_over,
            new_view_count = request.new_view_count,
            new_han_nop = request.new_han_nop,
            new_post = request.new_post,
            new_renew = request.new_renew,
            new_hot = request.new_hot,
            new_do = request.new_do,
            new_gap = request.new_gap,
            new_cao = request.new_cao,
            new_nganh = request.new_nganh,
            new_ghim = request.new_ghim,
            new_thuc = request.new_thuc,
            new_order = request.new_order,
            new_ut = request.new_ut,
            send_vip = request.send_vip,
            new_hide_admin = request.new_hide_admin,
            new_point = request.new_point,
            new_test = request.new_test,
            new_badge = request.new_badge,
            // Cập nhật new_multi
            new_mota = request.new_mota,
            new_yeucau = request.new_yeucau,
            new_quyenloi = request.new_quyenloi,
            new_ho_so = request.new_ho_so,
            new_title_seo = request.new_title_seo,
            new_des_seo = request.new_des_seo,
            new_hoahong = request.new_hoahong,
            new_tgtv = request.new_tgtv,
            new_lv = request.new_lv,
            new_bao_luu = request.new_bao_luu,
            time_bao_luu = request.time_bao_luu,
            no_jobposting = request.no_jobposting,
            new_video = request.new_video,
            new_video_type = request.new_video_type,
            new_video_active = request.new_video_active,
            new_images = request.new_images,
            // Cập nhật new_money
            nm_id = request.nm_id,
            nm_type = request.nm_type,
            nm_min_value = request.nm_min_value,
            nm_max_value = request.nm_max_value,
            nm_unit = request.nm_unit;

        await NewTV365.deleteOne({ new_id });
        const newTV = new NewTV365({
            new_id: new_id,
            new_title: new_title,
            new_md5: new_md5,
            new_alias: new_alias,
            new_301: new_301,
            new_cat_id: new_cat_id.split(',').map(Number),
            new_real_cate: new_real_cate,
            new_city: new_city.split(',').map(Number),
            new_qh_id: new_qh_id.split(',').map(Number),
            new_addr: new_addr,
            new_money: new_money,
            new_cap_bac: new_cap_bac,
            new_exp: new_exp,
            new_bang_cap: new_bang_cap,
            new_gioi_tinh: new_gioi_tinh,
            new_so_luong: new_so_luong,
            new_hinh_thuc: new_hinh_thuc,
            new_user_id: new_user_id,
            new_user_redirect: new_user_redirect,
            new_do_tuoi: new_do_tuoi,
            new_create_time: new_create_time,
            new_update_time: new_update_time,
            new_vip_time: new_vip_time,
            new_vip: new_vip,
            new_cate_time: new_cate_time,
            new_active: new_active,
            new_type: new_type,
            new_over: new_over,
            new_view_count: new_view_count,
            new_han_nop: new_han_nop,
            new_post: new_post,
            new_renew: new_renew,
            new_hot: new_hot,
            new_do: new_do,
            new_gap: new_gap,
            new_cao: new_cao,
            new_nganh: new_nganh,
            new_ghim: new_ghim,
            new_thuc: new_thuc,
            new_order: new_order,
            new_ut: new_ut,
            send_vip: send_vip,
            new_hide_admin: new_hide_admin,
            new_point: new_point,
            new_test: new_test,
            new_badge: new_badge,

            // Cập nhật new_multi
            new_mota: new_mota,
            new_yeucau: new_yeucau,
            new_quyenloi: new_quyenloi,
            new_ho_so: new_ho_so,
            new_title_seo: new_title_seo,
            new_des_seo: new_des_seo,
            new_hoahong: new_hoahong,
            new_tgtv: new_tgtv,
            new_lv: new_lv,
            new_bao_luu: new_bao_luu,
            time_bao_luu: time_bao_luu,
            no_jobposting: no_jobposting,
            new_video: new_video,
            new_video_type: new_video_type,
            new_video_active: new_video_active,
            new_images: new_images,

            // Cập nhật new_money
            nm_id: nm_id,
            nm_type: nm_type,
            nm_min_value: nm_min_value,
            nm_max_value: nm_max_value,
            nm_unit: nm_unit,
        });
        await newTV.save();

        return functions.success(res, 'tạo bài tuyển dụng thành công');
    } catch (error) {
        // console.log(error);
        return functions.setError(res, error);
    }
};

// Cập nhật điểm cho tin tuyển dụng
exports.updatePointNew = async(req, res) => {
    try {
        const new_id = req.body.new_id;
        if (new_id) {
            const findNew = await NewTV365.findOne({ new_id }, { new_point: 1 }).lean();
            if (findNew) {
                // Cập nhật điểm
                await NewTV365.updateOne({ new_id }, {
                    $set: {
                        new_point: Number(findNew.new_point) + 1,
                    },
                });

                // Lưu vào lịch sử
                const point = 1,
                    type = 0;
                await service.logHistoryNewPoint(new_id, point, type);

                return functions.success(res, 'Cập nhật điểm khi xem tin thành công');
            }
            return functions.setError(res, 'Tin tuyển dụng không tồn tại');
        }
    } catch (error) {
        return functions.setError(res, 'Đã có lỗi xảy ra');
    }
};

exports.sampleJobPostings = async(req, res) => {
    try {
        const lg_cate = req.body.lg_cate || 0,
            now = functions.getTimeNow(),
            time_start = now - 60 * 86400;
        let new365;
        if (lg_cate != 0) {
            new365 = await NewTV365.findOne({
                    new_cat_id: [lg_cate],
                    new_create_time: { $gte: time_start, $lte: now },
                })
                .select('new_id')
                .sort({ new_point: -1 })
                .limit(1);
        } else if (lg_cate == 0) {
            new365 = await NewTV365.findOne({}).select('new_id').sort({ new_point: -1, new_id: -1 }).limit(1);
        }
        let data = {};
        if (new365) {
            const new_id = new365.new_id;
            const sampleJobPostings = await NewTV365.aggregate([
                { $match: { new_id: Number(new_id) } },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $match: {
                        'user.type': 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_han_nop: 1,
                        nm_id: 1,
                        nm_type: 1,
                        nm_unit: 1,
                        nm_min_value: 1,
                        nm_max_value: 1,
                        new_money: 1,
                        new_exp: 1,
                        new_gioi_tinh: 1,
                        new_so_luong: 1,
                        new_bang_cap: 1,
                        new_cap_bac: 1,
                        new_hinh_thuc: 1,
                        new_cat_id: 1,
                        usc_id: '$user.idTimViec365',
                        usc_company: '$user.userName',
                        usc_alias: '$user.alias',
                        usc_logo: '$user.avatarUser',
                        usc_create_time: '$user.createdAt',
                        new_city: 1,
                        new_qh_id: 1,
                        new_addr: 1,
                        new_mota: 1,
                        new_yeucau: 1,
                        new_quyenloi: 1,
                        new_ho_so: 1,
                        new_create_time: 1,
                        new_update_time: 1,
                        new_view_count: 1,
                        new_hoahong: 1,
                        new_tgtv: 1,
                    },
                },
            ]);

            data = sampleJobPostings[0];
            data.new_cat_id = data.new_cat_id.toString();
            data.new_city = data.new_city.toString();
            data.new_qh_id = data.new_qh_id.toString();
            data.usc_logo = functions.getUrlLogoCompany(data.usc_create_time, data.usc_logo);
            data.db_tgian = await HistoryNewPoint.countDocuments({ nh_type_point: 0, nh_new_id: data.new_id });

            const db_luot = await ApplyForJob.countDocuments({
                    nhs_new_id: data.new_id,
                    nhs_kq: { $in: [0, 2, 13] },
                }),
                db_cvg = await ApplyForJob.countDocuments({
                    nhs_new_id: data.new_id,
                    nhs_kq: { $in: [10, 11, 12, 14] },
                });
            data.sl_ung_tuyen = db_luot + db_cvg;
        }
        return functions.success(res, 'Lấy mẫu tin', { new: data });
    } catch (error) {
        return functions.setError(res, 'Đã có lỗi xảy ra');
    }
};

exports.listTagByCate = async(req, res) => {
    const page = req.body.page || 1,
        pageSize = req.body.pageSize || 8;
    const list = await Category.find({
            cat_active: 1,
        })
        .select('cat_id cat_name')
        .sort({
            cat_order_show: -1,
            cat_id: 1,
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const listChild = await Keyword.aggregate([{
                $match: {
                    key_name: { $ne: '' },
                    key_index: 1,
                    key_cate_lq: element.cat_id,
                },
            },
            {
                $project: {
                    key_id: 1,
                    key_name: 1,
                    key_lq: 1,
                    key_cate_id: 1,
                    key_city_id: 1,
                    key_qh_id: 1,
                    key_cb_id: 1,
                    key_type: 1,
                    key_err: 1,
                    key_cate_lq: 1,
                },
            },
        ]);
        element.listChild = listChild;
    }

    return functions.success(res, 'danh sách việc làm theo tag', { list });
};

exports.listSuggestFromAI = async(req, res) => {
    try {
        const request = req.body;
        const new_id = request.new_id,
            page = request.page || 1,
            pageSize = request.pageSize || 12,
            find_new_ghim = request.find_new_ghim || 0,
            list_id_hide = request.list_id_hide || '';

        if (new_id) {
            let listFromAI = await axios({
                method: 'post',
                url: process.env.domain_ai_recommend_4001 + '/recommendation_tin',
                data: {
                    site: 'timviec365',
                    new_id: new_id,
                    pagination: page,
                    size: pageSize,
                    find_new_ghim: find_new_ghim,
                    hide_list_id: list_id_hide,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let list_new = [];
            if (listFromAI.data.data != null && listFromAI.data.data.list_id != '') {
                list_new = await NewTV365.aggregate([
                    { $match: { new_id: { $in: listFromAI.data.data.list_id.split(',').map(Number) } } },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            as: 'user',
                        },
                    },
                    {
                        $unwind: '$user',
                    },
                    {
                        $match: {
                            'user.type': 1,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            new_id: 1,
                            new_title: 1,
                            new_alias: 1,
                            new_han_nop: 1,
                            nm_id: 1,
                            nm_type: 1,
                            nm_unit: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            new_money: 1,
                            new_exp: 1,
                            new_gioi_tinh: 1,
                            new_so_luong: 1,
                            new_bang_cap: 1,
                            new_cap_bac: 1,
                            new_hinh_thuc: 1,
                            new_cat_id: 1,
                            usc_id: '$user.idTimViec365',
                            usc_company: '$user.userName',
                            usc_alias: '$user.alias',
                            usc_logo: '$user.avatarUser',
                            usc_create_time: '$user.createdAt',
                            new_city: 1,
                            new_badge: 1,
                            new_active: 1,
                            usc_badge: '$user.inForCompany.timviec365.usc_badge',
                        },
                    },
                ]);
            }
            for (let i = 0; i < list_new.length; i++) {
                const element = list_new[i];
                element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                element.new_cat_id = element.new_cat_id.toString();
                element.new_city = element.new_city.toString();
            }
            return functions.success(res, 'Kết quả tìm kiếm', { listFromAI: list_new });
        }
        return functions.setError(res, 'Chưa truyền lên ID');
    } catch (error) {
        return functions.setError(res, error);
    }
};

//comment tin tuyển dụng
exports.comment = async(req, res, next) => {
    try {
        let cm_sender_idchat = req.user.data._id,
            cm_new_id = req.body.cm_new_id,
            cm_parent_id = req.body.cm_parent_id || 0,
            cm_comment = req.body.cm_comment,
            cm_tag = req.body.cm_tag,
            link = req.body.link,
            comment_name = req.body.comment_name,
            author = req.body.author,
            cm_tag_js = [];
        if (cm_tag) {
            cm_tag = JSON.parse(cm_tag);
            for (i in cm_tag) {
                let cm = cm_tag[i];
                console.log(cm[1])
                if (cm_comment.includes(cm[1].trim())) {
                    console.log('ok');
                    cm_tag_js.push(cm);
                }
            }
        }
        const cm_time = functions.getTimeNow();
        let File = req.files || null;
        if (File && File.FileName && File.FileName.originalFilename == '') File = {};
        let FileName = null;
        if (cm_new_id && cm_new_id && cm_comment) {
            let findNew = await NewTV365.findOne({ new_id: cm_new_id }, { new_id: 1, new_user_id: 1 });
            if (findNew) {
                const timeCheck = cm_time - 30,
                    findComment = await functions.getDatafind(CommentPost, {
                        cm_new_id: Number(cm_new_id),
                        cm_sender_idchat: cm_sender_idchat,
                        cm_time: { $gt: timeCheck },
                    });
                if (findComment && findComment.length < 10) {
                    if (File && File.FileName) {
                        let upload = await service.uploadCmt(
                            null,
                            null,
                            File.FileName, ['.jpeg', '.jpg', '.png'],
                            cm_time
                        );
                        if (!upload) {
                            return functions.setError(res, 'có lỗi trong quá trình tải ảnh');
                        }
                        FileName = upload;
                    }
                    const maxID = await CommentPost.findOne({}, { cm_id: 1 }).sort({ cm_id: -1 }).limit(1).lean(),
                        cm_id = Number(maxID.cm_id) + 1;

                    let data = {
                        cm_id: cm_id,
                        cm_new_id: Number(cm_new_id),
                        cm_parent_id: cm_parent_id,
                        cm_sender_idchat: cm_sender_idchat,
                        cm_comment: cm_comment,
                        cm_time: cm_time,
                        cm_tag: cm_tag_js.length ? JSON.stringify(cm_tag_js) : '',
                        cm_img: FileName,
                    };
                    await new CommentPost(data).save();
                    if (author != cm_sender_idchat) {
                        serviceSendMess.SendNotification({
                            Title: 'Thông báo bình luận',
                            Message: `Bài viết bạn đã được bình luận bởi ${comment_name}`,
                            Type: 'NTD',
                            UserId: author,
                            SenderId: `${cm_sender_idchat}`,
                            Link: link,
                        });
                    }
                    let listIdTag = [];
                    if (cm_tag_js.length) {
                        cm_tag_js.forEach((cm, i) => {
                            if (listIdTag.indexOf(cm[0]) == -1) {
                                listIdTag.push(cm[0]);
                                let dataNotiChat = {
                                    Title: 'Thông báo',
                                    Message: `${comment_name} đã nhắc đến bạn trong một bình luận`,
                                    Type: 'NTD',
                                    UserId: cm[0],
                                    SenderId: `${cm_sender_idchat}`,
                                    Link: link,
                                }
                                let response = serviceSendMess.SendNotification(dataNotiChat);
                            }
                        })
                        let listUserTag = await Users.find({ _id: { $in: listIdTag } }).select("_id idTimviec365 type userName");
                        let listComTag = [];
                        let listCanTag = [];
                        for (i in listUserTag) {
                            if (listUserTag[i].type == 1) {
                                listComTag.push(listUserTag[i].idTimViec365);
                            } else {
                                listCanTag.push(listUserTag[i].idTimViec365);
                            }
                        }
                        let listUserPm = await PermissionNotify.find({ $or: [{ pn_usc_id: { $in: listComTag }, pn_id_new: 0 }, { pn_use_id: { $in: listCanTag }, pn_id_new: 0 }] });
                        for (key in listUserPm) {

                            let permissionData = listUserPm[key];

                            let listPermissions = permissionData.pn_type_noti.split(',');
                            if (listPermissions.indexOf('3')) {
                                //Lấy thông tin user được phân quyền
                                let UserTag = listUserTag.find(e => (permissionData.pn_usc_id && e.idTimviec365 == permissionData.pn_usc_id) || (permissionData.pn_use_id && e.idTimviec365 == permissionData.pn_use_id));
                                dataNotiChat.UserId = permissionData.pn_id_chat;
                                let dataNotiChat = {
                                    Title: 'Thông báo',
                                    Message: `${comment_name} đã nhắc đến ${UserTag.userName} trong một bình luận`,
                                    Type: 'NTD',
                                    UserId: cm[0],
                                    SenderId: permissionData.pn_id_chat,
                                    Link: link,
                                }
                                let response = serviceSendMess.SendNotification(dataNotiChat);
                            }
                        }
                    }

                    return functions.success(res, 'Thêm bình luận thành công', { cm_id: data.cm_id });
                }
                return functions.setError(res, 'bạn đã bình luận quá nhanh', 400);
            }
            return functions.setError(res, 'không tồn tại tin tuyển dụng này', 400);
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    } catch (e) {
        console.log('Đã có lỗi xảy ra khi bình luận', e);
        return functions.setError(res, e.message);
    }
};

// Like tin tuyển dụng
exports.like = async(req, res) => {
    try {
        const user = req.user.data;
        const { id, new_id, type, author } = req.body;
        const cm_id = req.body.cm_id || 0;
        if (id && new_id && type) {
            if (type == 0) {
                // xóa trước đã
                await LikePost.deleteMany({
                    lk_user_idchat: user._id,
                    lk_type: { $lt: 8 },
                    lk_new_id: new_id,
                    lk_for_comment: cm_id ? cm_id : 0,
                });
                let count = 0;
                let countForApp = 0;
                if (cm_id == 0) {
                    [count, countForApp] = await Promise.all([
                        LikePost.find({
                            lk_type: { $lt: 8 },
                            lk_for_comment: 0,
                        }),
                        LikePost.find({
                            lk_type: { $lt: 8 },
                            lk_for_comment: 0,
                            lk_new_id: new_id,
                        })
                        .sort({ lk_id: -1 })
                        .lean(),
                    ]);
                }
                return functions.success(res, 'Thành công', {
                    data: count,
                    dataForApp: countForApp,
                });
            } else {
                const time_now = functions.getTimeNow();
                const check = await LikePost.findOne({
                    lk_user_idchat: user._id,
                    lk_type: { $lt: 8 },
                    lk_new_id: new_id,
                    lk_for_comment: cm_id || 0,
                }, { lk_id: 1, lk_time: 1 });
                if (check) {
                    await LikePost.updateOne({
                        lk_user_idchat: user._id,
                        lk_type: { $lt: 8 },
                        lk_new_id: new_id,
                        lk_for_comment: cm_id,
                    }, {
                        $set: {
                            lk_type: type,
                            lk_time: time_now,
                        },
                    });
                    if (time_now - check.lk_time < 10) {
                        return functions.setError(res, 'Đừng có spam');
                    }
                } else {
                    const max_lk = (await LikePost.findOne({}, { lk_id: 1 }).sort({ lk_id: -1 }).lean()) || 0;
                    const item = new LikePost({
                        lk_id: Number(max_lk.lk_id) + 1 || 1,
                        lk_type: type,
                        lk_new_id: new_id,
                        lk_for_comment: cm_id,
                        lk_user_idchat: user._id,
                        lk_time: time_now,
                    });
                    await item.save();
                }
                let count = 0;
                let countForApp = 0;
                if (cm_id == 0) {
                    [count, countForApp] = await Promise.all([
                        LikePost.find({
                            lk_type: { $lt: 8 },
                            lk_for_comment: 0,
                        }),
                        LikePost.find({
                            lk_type: { $lt: 8 },
                            lk_for_comment: 0,
                            lk_new_id: new_id,
                        })
                        .sort({ lk_id: -1 })
                        .lean(),
                    ]);
                }
                return functions.success(res, 'Thành công', {
                    data: count,
                    dataForApp: countForApp,
                });
            }
        }
        return functions.setError(res, 'Chưa đủ thông tin truyền lên');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.tuDongGhimTin = async(req, res) => {
    try {
        let {
            /**Id tin */
            new_id,
            /**Gói ghim tin */
            bg_id,
            /** Vị trí ghim tin
             * type: String,
             * enum: ["hap_dan", "thuong_hieu", "tuyen_gap", null],
             * default: null
             */
            ghim_start,
        } = req.body;
        if (!req.user || !req.user.data.idTimViec365) return functions.setError(res, 'Forbidden', 403);
        let usc_id = req.user.data.idTimViec365;
        let priceListing = await PriceList.findOne({ bg_id: bg_id, bg_type: { $in: ['1', '4', '5', '6'] } });
        if (!priceListing) return functions.setError(res, 'Gói ghim tin không tồn tại', 404);
        let news = await NewTV365.findOne({ new_id: new_id, new_user_id: usc_id });
        if (!news) return functions.setError(res, 'Bản tin không tồn tại', 404);

        let bg_vat = priceListing.bg_vat;
        let bg_vip_duration = priceListing.bg_vip_duration;
        let bg_type = priceListing.bg_type;
        if (typeof bg_vat === 'string' && bg_vip_duration && bg_type) {
            bg_vat = Number(bg_vat.replace(/\./g, ''));
            if (isNaN(bg_vat)) return functions.setError(res, 'Gói ghim tin không tồn tại', 404);
            if (
                ['1', '4', '5'].includes(bg_type) &&
                (news.new_hot || news.new_cao || news.new_gap) &&
                news.new_vip_time > functions.getTimeNow()
            )
                return functions.setError(res, 'Tin vẫn đang được ghim', 400);
            if (bg_type === '6' && news.new_nganh && news.new_cate_time > functions.getTimeNow())
                return functions.setError(res, 'Tin vẫn đang được ghim ngành', 400);

            let paymentResult = await creditsController.useCreditsHandler(usc_id, bg_vat);
            if (!paymentResult) {
                return functions.setError(res, 'Tài khoản không đủ!', 400);
            }
            /**
             * 1: Hấp dẫn
             * 4: Thương hiệu
             * 5: Tuyển gấp
             * 6: Trang ngành
             */
            switch (bg_type) {
                case '1':
                    await New.updateOne({
                        new_id: new_id,
                        new_user_id: usc_id,
                    }, {
                        $set: {
                            new_hot: 1,
                            new_cao: 0,
                            new_gap: 0,
                            new_vip_time: Number(ghim_start) + Number(bg_vip_duration),
                        },
                    });
                    break;

                case '4':
                    await New.updateOne({
                        new_id: new_id,
                        new_user_id: usc_id,
                    }, {
                        $set: {
                            new_hot: 0,
                            new_cao: 1,
                            new_gap: 0,
                            new_vip_time: Number(ghim_start) + Number(bg_vip_duration),
                        },
                    });
                    break;

                case '5':
                    await New.updateOne({
                        new_id: new_id,
                        new_user_id: usc_id,
                    }, {
                        $set: {
                            new_hot: 0,
                            new_cao: 0,
                            new_gap: 1,
                            new_vip_time: Number(ghim_start) + Number(bg_vip_duration),
                        },
                    });
                    break;

                case '6':
                    await New.updateOne({
                        new_id: new_id,
                        new_user_id: usc_id,
                    }, {
                        $set: {
                            new_nganh: 1,
                            new_cate_time: Number(ghim_start) + Number(bg_vip_duration),
                        },
                    });
                    break;
            }
            let bg_title = 'Ghim tin' + service.renderBGName(bg_type) + ' - ' + priceListing.bg_handung;
            let data = {
                new_id: new_id,
                new_title: news.new_title,
                new_user_id: usc_id,
                bg_type: bg_type,
                bg_id: bg_id,
                bg_title: bg_title,
                created_time: functions.getTimeNow(),
                ghim_start: Number(ghim_start),
                ghim_end: Number(ghim_start) + Number(bg_vip_duration),
                price: Number(bg_vat),
                duration: bg_vip_duration,
            };
            await new GhimHistory(data).save();

            return functions.success(res, 'Ghim tin thành công', { data });
        } else {
            return functions.setError(res, 'Chưa đủ thông tin truyền lên', 400);
        }
    } catch (error) {
        return functions.setError(res, error);
    }
};

//Lấy lịch sử ghim
exports.getPinnedHistory = async(req, res) => {
    try {
        let { new_id } = req.params;
        let docs = await GhimHistory.find({ new_id });
        return functions.success(res, 'Thành công', { data: docs });
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.unverifiedUser = async(req, res, next) => {
    try {
        req.user = {
            data: {
                idTimViec365: -1,
                createdAt: functions.getTimeNow(),
            },
        };
        next();
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.verifyNew = async(req, res, next) => {
    try {
        let { new_id, otp } = req.body;
        if (!new_id) return next();
        if (!req.user || !req.user.data) return functions.setError(res, 'Không tồn tại người dùng này');
        let new_user_id = req.user.data.idTimViec365;
        if (otp) {
            let user = await Users.findOne({ _id: req.user.data._id, otp });
            if (!user) return functions.setError(res, 'xác thực thất bại', 404);
        }

        await NewTV365.updateOne({ new_id }, {
            $set: {
                new_user_id: new_user_id,
                new_active: 2,
            },
        });
        next();
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.vote = async(req, res) => {
    try {
        if (req.body.star && req.body.newId) {
            const userId = req.user.data.idTimViec365,
                userType = req.user.data.type,
                star = Number(req.body.star);
            const newId = Number(req.body.newId);
            const checkNew = await NewTV365.findOne({ new_id: newId }).lean();
            if (checkNew) {
                service.handleCaculatePointVoteNew(userId, userType, star, newId);
                return functions.success(res, 'Thành công');
            }
            return functions.setError(res, 'Tin không tồn tại');
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ');
        }
    } catch (error) {
        return functions.setError(res, error);
    }
};

const attachNewAdditionalInfo = async(newListOrg, req, res, next) => {
    // Kiểm tra xem có đăng nhập hay không
    const user = await functions.getTokenUser(req, res, next);
    let newList = [...newListOrg];
    let likePostPromises = [];
    let sharePostPromises = [];
    let countCommentPromises = [];
    let arrCommentsPromises = [];
    let voteStarPromises = [];
    let appliedPromises = [];
    let viewedPromises = [];
    for (let i = 0; i < newList.length; i++) {
        const newTV365 = newList[i];
        let avatarUser = functions.getUrlLogoCompany(newTV365.usc_create_time, newTV365.usc_logo);
        newTV365.usc_logo = avatarUser;
        newTV365.new_city = newTV365.new_city.toString();
        newTV365.new_cat_id = newTV365.new_cat_id.toString();

        // Lấy danh sách thả cảm xúc
        likePostPromises.push(
            LikePost.aggregate([{
                    $match: {
                        lk_new_id: Number(newTV365.new_id),
                        lk_type: { $ne: 8 },
                        lk_for_comment: 0,
                    },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'lk_user_idchat',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $project: {
                        lk_id: 1,
                        lk_type: 1,
                        lk_for_comment: 1,
                        lk_user_name: '$user.userName',
                        lk_user_avatar: '$user.avatarUser',
                        lk_user_idchat: '$user._id',
                    },
                },
            ])
        );
        sharePostPromises.push(
            LikePost.aggregate([{
                    $match: {
                        lk_new_id: Number(newTV365.new_id),
                        lk_type: { $eq: 8 },
                        lk_for_comment: 0,
                    },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'lk_user_idchat',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $project: {
                        lk_id: 1,
                        lk_type: 1,
                        lk_for_comment: 1,
                        lk_user_name: '$user.userName',
                        lk_user_avatar: '$user.avatarUser',
                        lk_user_idchat: '$user._id',
                    },
                },
            ])
        );

        countCommentPromises.push(CommentPost.countDocuments({ cm_parent_id: 0, cm_new_id: Number(newTV365.new_id) }));
        arrCommentsPromises.push(
            CommentPost.aggregate([{
                    $match: { cm_new_id: Number(newTV365.new_id), cm_parent_id: 0 },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'cm_sender_idchat',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $project: {
                        cm_sender_idchat: 1,
                        cm_sender_name: '$user.userName',
                    },
                },
                {
                    $group: {
                        _id: {
                            cm_sender_name: '$cm_sender_name',
                            cm_sender_idchat: '$cm_sender_idchat',
                        },
                    },
                },
                {
                    $project: {
                        _id: null,
                        cm_sender_name: '$_id.cm_sender_name',
                        cm_sender_idchat: '$_id.cm_sender_idchat',
                    },
                },
            ])
        );

        voteStarPromises.push(
            SaveVote.aggregate([{
                    $match: {
                        id_be_vote: Number(newTV365.new_id),
                        type: 'new',
                    },
                },
                {
                    $group: {
                        _id: '$star',
                        total: { $sum: '$star' },
                        count: { $sum: 1 },
                    },
                },
            ])
        );

        if (user) {
            viewedPromises.push(TblHistoryViewed.findOne({ id_uv: user.idTimViec365, id_new: newTV365.new_id }));
            appliedPromises.push(
                functions.getDatafindOne(ApplyForJob, { nhs_new_id: newTV365.new_id, nhs_use_id: user.idTimViec365 })
            );
        }
    }

    let [arr_likes_new, arr_share_new, count_comments, arr_comments, voteStar, views, applied] = await Promise.all([
        Promise.all(likePostPromises),
        Promise.all(sharePostPromises),
        Promise.all(countCommentPromises),
        Promise.all(arrCommentsPromises),
        Promise.all(voteStarPromises),
        Promise.all(viewedPromises),
        Promise.all(appliedPromises),
    ]);
    for (let i = 0; i < newList.length; i++) {
        const newTV365 = newList[i];
        newTV365.arr_likes_new = arr_likes_new[i];
        newTV365.arr_share_new = arr_share_new[i];
        newTV365.count_comments = count_comments[i];
        newTV365.arr_comments = arr_comments[i];
        if (voteStar[i][0] && voteStar[i][0].total) {
            newTV365.sum_star = voteStar[i][0].total;
            newTV365.count_star = voteStar[i][0].count;
        } else {
            newTV365.sum_star = 0;
            newTV365.count_star = 0;
        }
        newTV365.views = views[i] ? 1 : 0;
        newTV365.applied = applied[i] ? 1 : 0;
    }
    return newList;
};

exports.listNewsTiaSet = async(req, res) => {
    try {
        let { keyword, city, limit, page } = req.body;
        if (!limit) limit = 20;
        if (!page || page < 1) page = 1;
        let now = functions.getTimeNow();
        let match = {};
        match['new_han_nop'] = { $gt: now };
        if (keyword) match['$text'] = { $search: keyword };
        if (city) match['new_city'] = Number(city);
        let listPromise = NewTV365.aggregate([{
                $match: match,
            },
            {
                $sort: {
                    new_hot: -1,
                    new_cao: -1,
                    new_gap: -1,
                    new_update_time: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    $or: [{
                            new_badge: 1,
                        },
                        {
                            'user.inForCompany.timviec365.usc_badge': 1,
                        },
                    ],
                },
            },

            {
                $skip: limit * (page - 1),
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    new_id: 1,
                    new_han_nop: 1,
                    new_thuc: 1,
                    new_do: 1,
                    new_ghim: 1,
                    new_title: 1,
                    new_alias: 1,
                    new_active: 1,
                    usc_alias: '$user.alias',
                    new_money: 1,
                    new_hot: 1,
                    new_city: 1,
                    usc_id: '$user.idTimViec365',
                    usc_logo: '$user.avatarUser',
                    usc_create_time: '$user.createdAt',
                    usc_company: '$user.userName',
                    usc_type: '$user.inForCompany.timviec365.usc_type',
                    new_create_time: 1,
                    nm_id: 1,
                    nm_type: 1,
                    nm_min_value: 1,
                    nm_unit: 1,
                    nm_max_value: 1,
                    chat365_id: '$user.chat365_id',
                    new_cat_id: 1,
                    new_cao: 1,
                    new_gap: 1,
                    new_nganh: 1,
                    new_quyenloi: 1,
                    new_view_count: 1,
                    new_yeucau: 1,
                    new_badge: 1,
                    usc_badge: '$user.inForCompany.timviec365.usc_badge',
                    usc_star: '$user.inForCompany.timviec365.usc_star',
                    usc_time_login: '$user.time_login',
                    isOnline: '$user.isOnline',
                },
            },
        ]);
        let getCount = async() => {
            let new_user_ids = (
                await Users.find({
                    type: 1,
                    'inForCompany.timviec365.usc_badge': 1,
                }).select('idTimViec365')
            ).map((d) => d.idTimViec365);
            match['$or'] = [{ new_user_id: { $in: new_user_ids } }, { new_badge: 1 }];
            return await NewTV365.find(match).count();
        };
        let countPromise = getCount();

        let [list, count] = await Promise.all([listPromise, countPromise]);
        list = await attachNewAdditionalInfo(list, req, res);
        return functions.success(res, 'Thành công', { data: list, count: count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.listNewsAnhSao = async(req, res) => {
    try {
        let { keyword, city, limit, page } = req.body;
        if (!limit) limit = 20;
        if (!page || page < 1) page = 1;
        let now = functions.getTimeNow();
        let match = {};
        match['new_han_nop'] = { $gt: now };
        if (keyword) match['$text'] = { $search: keyword };
        if (city) match['new_city'] = Number(city);
        let listPromise = NewTV365.aggregate([{
                $match: match,
            },
            {
                $sort: {
                    new_hot: -1,
                    new_cao: -1,
                    new_gap: -1,
                    new_update_time: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.inForCompany.timviec365.usc_star': 1,
                },
            },

            {
                $skip: limit * (page - 1),
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    new_id: 1,
                    new_han_nop: 1,
                    new_thuc: 1,
                    new_do: 1,
                    new_ghim: 1,
                    new_title: 1,
                    new_alias: 1,
                    new_active: 1,
                    usc_alias: '$user.alias',
                    new_money: 1,
                    new_hot: 1,
                    new_city: 1,
                    usc_id: '$user.idTimViec365',
                    usc_logo: '$user.avatarUser',
                    usc_create_time: '$user.createdAt',
                    usc_company: '$user.userName',
                    usc_type: '$user.inForCompany.timviec365.usc_type',
                    new_create_time: 1,
                    nm_id: 1,
                    nm_type: 1,
                    nm_min_value: 1,
                    nm_unit: 1,
                    nm_max_value: 1,
                    chat365_id: '$user.chat365_id',
                    new_cat_id: 1,
                    new_cao: 1,
                    new_gap: 1,
                    new_nganh: 1,
                    new_quyenloi: 1,
                    new_view_count: 1,
                    new_yeucau: 1,
                    new_badge: 1,
                    usc_badge: '$user.inForCompany.timviec365.usc_badge',
                    usc_star: '$user.inForCompany.timviec365.usc_star',
                    usc_time_login: '$user.time_login',
                    isOnline: '$user.isOnline',
                },
            },
        ]);
        let getCount = async() => {
            let new_user_ids = (
                await Users.find({
                    type: 1,
                    'inForCompany.timviec365.usc_star': 1,
                }).select('idTimViec365')
            ).map((d) => d.idTimViec365);
            match['new_user_id'] = { $in: new_user_ids };
            return await NewTV365.find(match).count();
        };
        let countPromise = getCount();

        let [list, count] = await Promise.all([listPromise, countPromise]);
        list = await attachNewAdditionalInfo(list, req, res);
        return functions.success(res, 'Thành công', { data: list, count: count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// AI
//danh sách tin theo tag
exports.listNewByTag = async(req, res, next) => {
    try {
        const new_lv = req.body.new_lv;
        const pageSize = Number(req.body.pageSize) || 20;
        const page = Number(req.body.page) || 1;
        const dataNewByTag = await axios({
            method: 'post',
            url: 'http://43.239.223.4:5001/search_tin_tag',
            data: {
                site: 'timviec365',
                ...(new_lv ? { new_lv: new_lv } : {}),
                pagination: page,
                size: pageSize,
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let listNewByTag = [];

        if (dataNewByTag) {
            const listIdFind = dataNewByTag.data.data.list_id.split(',').map(Number);
            listNewByTag = await NewTV365.aggregate([{
                    $match: {
                        new_id: {
                            $in: listIdFind,
                        },
                    },
                },
                {
                    $sort: {
                        new_han_nop: 1,
                    },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                // {
                // 	$unwind: '$user',
                // },
                {
                    $project: {
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_alias: 1,
                        new_han_nop: 1,
                        nm_id: 1,
                        nm_type: 1,
                        nm_unit: 1,
                        nm_min_value: 1,
                        nm_max_value: 1,
                        new_money: 1,
                        new_exp: 1,
                        new_gioi_tinh: 1,
                        new_so_luong: 1,
                        new_bang_cap: 1,
                        new_cap_bac: 1,
                        new_hinh_thuc: 1,
                        new_cat_id: 1,
                        new_city: 1,
                        new_badge: 1,
                        new_active: 1,
                        new_update_time: 1,
                        user: {
                            _id: 1,
                            idTimViec365: 1,
                            userName: 1,
                            alias: 1,
                            type: 1,
                            avatarUser: 1,
                            createdAt: 1,
                            'inForCompany.timviec365.usc_badge': 1,
                            chat365_secret: 1,
                            email: 1,
                            password: 1,
                        },
                    },
                },
            ]);
        }
        return functions.success(res, 'Get List New By Tag Is Successfully', {
            listNewByTag,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//gợi ý tin hết hạn hoặc ghim
exports.suggestedFiveNewForDueNewOrPin = async(req, res, next) => {
    try {
        const timeNow = Date.now();
        const new_id = req.body.new_id;
        if (new_id) {
            const dataFiveSuggesstedNew = await axios({
                method: 'post',
                url: 'http://43.239.223.21:7102/similar_news',
                data: {
                    site: 'timviec365',
                    new_id,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let listSuggestNew = [];
            if (dataFiveSuggesstedNew) {
                let { list_id_cat_city, list_id_cat_not_city, list_id } = dataFiveSuggesstedNew.data;

                list_id_cat_city = list_id_cat_city ? list_id_cat_city.map(Number) : [];
                list_id_cat_not_city = list_id_cat_not_city ? list_id_cat_not_city.map(Number) : [];
                list_id = list_id ? list_id.map(Number) : [];
                let listIdFind = [];
                if (list_id_cat_city.length > 5) {
                    listIdFind = list_id_cat_city.slice(0, 6);
                } else {
                    listIdFind = list_id_cat_city.concat(list_id_cat_not_city).slice(0, 6);
                    if (listIdFind.length < 6) {
                        listIdFind = listIdFind.concat(list_id).slice(0, 6);
                    }
                }
                listSuggestNew = await NewTV365.aggregate([{
                        $match: {
                            new_id: {
                                $in: listIdFind,
                            },
                        },
                    },
                    {
                        $sort: {
                            new_vip_time: -1,
                            new_han_nop: -1,
                        },
                    },
                    {
                        $limit: 5,
                    },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            as: 'user',
                        },
                    },
                    {
                        $project: {
                            new_vip_time: 1,
                            new_hot: 1,
                            new_gap: 1,
                            new_cao: 1,
                            new_ghim: 1,
                            _id: 0,
                            new_id: 1,
                            new_title: 1,
                            new_alias: 1,
                            new_han_nop: 1,
                            nm_id: 1,
                            nm_type: 1,
                            nm_unit: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            new_money: 1,
                            new_exp: 1,
                            new_gioi_tinh: 1,
                            new_so_luong: 1,
                            new_bang_cap: 1,
                            new_cap_bac: 1,
                            new_hinh_thuc: 1,
                            new_cat_id: 1,
                            new_city: 1,
                            new_badge: 1,
                            new_active: 1,
                            new_update_time: 1,
                            user: {
                                _id: 1,
                                idTimViec365: 1,
                                userName: 1,
                                alias: 1,
                                type: 1,
                                avatarUser: 1,
                                createdAt: 1,
                                'inForCompany.timviec365.usc_badge': 1,
                                chat365_secret: 1,
                                email: 1,
                                password: 1,
                                isOnline: 1,
                                time_login: 1,
                            },
                        },
                    },
                ]);
            }
            return functions.success(res, 'Get list suggestNew for user successfully', {
                total: listSuggestNew.length,
                listSuggestNew,
            });
        } else return functions.setError(res, 'Missing the new_id');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//gợi ý tin tuyển dụng cho ứng viên
exports.listSuggestNewForCandidateFromAI = async(req, res, next) => {
    try {
        const timeNow = Date.now();
        const user_id = req.body.id_user;
        const pageSize = Number(req.body.pageSize) || 20;
        const page = Number(req.body.page) || 1;
        if (user_id) {
            const dataSuggestNew = await axios({
                method: 'post',
                url: 'http://43.239.223.21:7001/recommend_uv',
                data: {
                    site: 'timviec365',
                    id_user: user_id,
                    page: page,
                    size: pageSize,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let listSuggestNew = [];
            let listSuggestNew1 = [];
            let listSuggestNew2 = [];
            let listSuggestNew3 = [];
            let listSuggestNew4 = [];
            let listSuggestNew5 = [];
            let listSuggestNew6 = [];

            if (dataSuggestNew) {
                let { list_id_cat_city, list_id_cat_not_city, list_id } = dataSuggestNew.data;
                list_id_cat_city = list_id_cat_city ? list_id_cat_city.map(Number) : [];
                list_id_cat_not_city = list_id_cat_not_city ? list_id_cat_not_city.map(Number) : [];
                list_id = list_id ? list_id.map(Number) : [];
                const new_id = dataSuggestNew.data.new_id;
                listSuggestNew1 = await NewTV365.aggregate([{
                        $match: {
                            new_id: {
                                $in: list_id_cat_city,
                                $ne: new_id,
                            },
                            // new_vip_time: {
                            //     $gte: timeNow,
                            // },
                            $or: [{ new_hot: 1 }, { new_gap: 1 }, { new_cao: 1 }, { new_nganh: 1 }, { new_ghim: 1 }],
                        },
                    },
                    {
                        $sort: {
                            new_vip_time: -1,
                            new_han_nop: -1,
                        },
                    },
                    {
                        $limit: pageSize,
                    },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            as: 'user',
                        },
                    },
                    {
                        $project: {
                            new_vip_time: 1,
                            new_hot: 1,
                            new_gap: 1,
                            new_cao: 1,
                            new_ghim: 1,
                            _id: 0,
                            new_id: 1,
                            new_title: 1,
                            new_alias: 1,
                            new_han_nop: 1,
                            nm_id: 1,
                            nm_type: 1,
                            nm_unit: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            new_money: 1,
                            new_exp: 1,
                            new_gioi_tinh: 1,
                            new_so_luong: 1,
                            new_bang_cap: 1,
                            new_cap_bac: 1,
                            new_hinh_thuc: 1,
                            new_cat_id: 1,
                            new_city: 1,
                            new_badge: 1,
                            new_active: 1,
                            new_update_time: 1,
                            user: {
                                _id: 1,
                                idTimViec365: 1,
                                userName: 1,
                                alias: 1,
                                type: 1,
                                avatarUser: 1,
                                createdAt: 1,
                                'inForCompany.timviec365.usc_badge': 1,
                                chat365_secret: 1,
                                email: 1,
                                password: 1,
                                isOnline: 1,
                                time_login: 1,
                            },
                        },
                    },
                ]);
                let numberNeed = pageSize - listSuggestNew1.length;
                if (numberNeed > 0) {
                    let listIdPin = listSuggestNew1.map((item) => item.new_id);
                    listSuggestNew2 = await NewTV365.aggregate([{
                            $match: {
                                new_id: {
                                    $nin: listIdPin,
                                    $in: list_id_cat_city,
                                    $ne: new_id,
                                },
                            },
                        },
                        {
                            $sort: {
                                new_vip_time: -1,
                                new_han_nop: -1,
                            },
                        },
                        {
                            $limit: numberNeed,
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'new_user_id',
                                foreignField: 'idTimViec365',
                                as: 'user',
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                new_id: 1,
                                new_title: 1,
                                new_alias: 1,
                                new_han_nop: 1,
                                nm_id: 1,
                                nm_type: 1,
                                nm_unit: 1,
                                nm_min_value: 1,
                                nm_max_value: 1,
                                new_money: 1,
                                new_exp: 1,
                                new_gioi_tinh: 1,
                                new_so_luong: 1,
                                new_bang_cap: 1,
                                new_cap_bac: 1,
                                new_hinh_thuc: 1,
                                new_cat_id: 1,
                                new_city: 1,
                                new_badge: 1,
                                new_active: 1,
                                new_update_time: 1,
                                user: {
                                    _id: 1,
                                    idTimViec365: 1,
                                    userName: 1,
                                    alias: 1,
                                    type: 1,
                                    avatarUser: 1,
                                    createdAt: 1,
                                    'inForCompany.timviec365.usc_badge': 1,
                                    chat365_secret: 1,
                                    email: 1,
                                    password: 1,
                                },
                            },
                        },
                    ]);
                    numberNeed -= listSuggestNew2.length;
                    if (numberNeed > 0) {
                        listSuggestNew3 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                    // new_vip_time: {
                                    //     $gte: timeNow,
                                    // },
                                    $or: [
                                        { new_hot: 1 },
                                        { new_gap: 1 },
                                        { new_cao: 1 },
                                        { new_ghim: 1 },
                                        { new_nganh: 1 },
                                    ],
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    user: {
                                        _id: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        type: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                    }
                    const listId4 = listSuggestNew3.map((item) => item.new_id);
                    numberNeed -= listSuggestNew3.length;
                    if (numberNeed > 0) {
                        listSuggestNew4 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: listId4,
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    user: {
                                        _id: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        type: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                    }
                    if (numberNeed > 0) {
                        listSuggestNew5 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: list_id_cat_city,
                                        $nin: list_id_cat_not_city,
                                        $in: list_id,
                                        $ne: new_id,
                                    },
                                    new_vip_time: {
                                        $gte: timeNow,
                                    },
                                    $or: [
                                        { new_hot: 1 },
                                        { new_gap: 1 },
                                        { new_cao: 1 },
                                        { new_ghim: 1 },
                                        { new_nganh: 1 },
                                    ],
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    user: {
                                        _id: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        type: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                        const listId5 = listSuggestNew5.map((item) => item.new_id);
                        numberNeed -= listSuggestNew5.length;
                        if (numberNeed > 0) {
                            listSuggestNew6 = await NewTV365.aggregate([{
                                    $match: {
                                        new_id: {
                                            $nin: listId5,
                                            $in: list_id,
                                            $ne: new_id,
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        new_vip_time: -1,
                                        new_han_nop: -1,
                                    },
                                },
                                {
                                    $limit: numberNeed,
                                },
                                {
                                    $lookup: {
                                        from: 'Users',
                                        localField: 'new_user_id',
                                        foreignField: 'idTimViec365',
                                        as: 'user',
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        new_id: 1,
                                        new_title: 1,
                                        new_alias: 1,
                                        new_han_nop: 1,
                                        nm_id: 1,
                                        nm_type: 1,
                                        nm_unit: 1,
                                        nm_min_value: 1,
                                        nm_max_value: 1,
                                        new_money: 1,
                                        new_exp: 1,
                                        new_gioi_tinh: 1,
                                        new_so_luong: 1,
                                        new_bang_cap: 1,
                                        new_cap_bac: 1,
                                        new_hinh_thuc: 1,
                                        new_cat_id: 1,
                                        new_city: 1,
                                        new_badge: 1,
                                        new_active: 1,
                                        new_update_time: 1,
                                        user: {
                                            _id: 1,
                                            idTimViec365: 1,
                                            userName: 1,
                                            alias: 1,
                                            type: 1,
                                            avatarUser: 1,
                                            createdAt: 1,
                                            'inForCompany.timviec365.usc_badge': 1,
                                            chat365_secret: 1,
                                            email: 1,
                                            password: 1,
                                        },
                                    },
                                },
                            ]);
                        }
                    }
                }
                const listSuggest = [
                    ...listSuggestNew1,
                    ...listSuggestNew2,
                    ...listSuggestNew3,
                    ...listSuggestNew4,
                    ...listSuggestNew5,
                    ...listSuggestNew6,
                ];
                listSuggestNew = listSuggest.filter((value, index, origin) => {
                    let firstIndex = origin.findIndex((item) => item.new_id === value.new_id);
                    return index === firstIndex;
                });
            }
            return functions.success(res, 'Get list suggestNew for user successfully', {
                listSuggestNew,
            });
        } else return functions.setError(res, 'Missing the user_id');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//tin tương tự
exports.listSimulateNew = async(req, res, next) => {
    try {
        const timeNow = Math.round(Date.now() / 1000);
        const new_id = Number(req.body.new_id);
        if (new_id) {
            const dataSimulateNew = await axios({
                method: 'post',
                url: 'http://43.239.223.21:7010/similar_news',
                data: {
                    site: 'timviec365',
                    new_id,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let listSimulateNew = [];
            let listSimulateNew1 = [];
            let listSimulateNew2 = [];
            let listSimulateNew3 = [];
            let listSimulateNew4 = [];
            let listSimulateNew5 = [];
            let listSimulateNew6 = [];
            if (dataSimulateNew) {
                let { list_id_cat_city, list_id_cat_not_city, list_id } = dataSimulateNew.data;
                list_id_cat_city = list_id_cat_city.map(Number);
                list_id_cat_not_city = list_id_cat_not_city.map(Number);
                list_id = list_id.map(Number);

                listSimulateNew1 = await NewTV365.aggregate([{
                        $match: {
                            new_id: {
                                $in: list_id_cat_city,
                                $ne: new_id,
                            },
                            new_vip_time: {
                                $gte: timeNow,
                            },
                            $or: [{ new_hot: 1 }, { new_gap: 1 }, { new_cao: 1 }, { new_nganh: 1 }, { new_ghim: 1 }],
                        },
                    },
                    {
                        $sort: {
                            new_vip_time: -1,
                            new_han_nop: -1,
                        },
                    },
                    {
                        $limit: 12,
                    },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            as: 'user',
                        },
                    },
                    {
                        $lookup: {
                            from: 'City',
                            localField: 'new_city',
                            foreignField: '_id',
                            as: 'City',
                        },
                    },
                    {
                        $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                    },
                    {
                        $project: {
                            new_vip_time: 1,
                            new_hot: 1,
                            new_gap: 1,
                            new_cao: 1,
                            new_ghim: 1,
                            _id: 0,
                            new_id: 1,
                            new_title: 1,
                            new_alias: 1,
                            new_han_nop: 1,
                            nm_id: 1,
                            nm_type: 1,
                            nm_unit: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            new_money: 1,
                            new_exp: 1,
                            new_gioi_tinh: 1,
                            new_so_luong: 1,
                            new_bang_cap: 1,
                            new_cap_bac: 1,
                            new_hinh_thuc: 1,
                            new_cat_id: 1,
                            new_city: 1,
                            new_badge: 1,
                            new_active: 1,
                            new_update_time: 1,
                            name_city: '$City.name',
                            user: {
                                _id: 1,
                                idTimViec365: 1,
                                userName: 1,
                                alias: 1,
                                type: 1,
                                avatarUser: 1,
                                createdAt: 1,
                                'inForCompany.timviec365.usc_badge': 1,
                                chat365_secret: 1,
                                email: 1,
                                password: 1,
                                isOnline: 1,
                                time_login: 1,
                            },
                        },
                    },
                ]);
                for (let i = 0; i < listSimulateNew1.length; i++) {
                    let element = listSimulateNew1[i];
                    element.new_money_str = await functions.new_money_tv(
                        element.nm_id,
                        element.nm_type,
                        element.nm_unit,
                        element.nm_min_value,
                        element.nm_max_value,
                        element.new_money
                    );
                }
                let numberNeed = 12 - listSimulateNew1.length;
                if (numberNeed > 0 && list_id_cat_city.length > 0) {
                    let listIdPin = listSimulateNew1.map((item) => item.new_id);
                    listSimulateNew2 = await NewTV365.aggregate([{
                            $match: {
                                new_id: {
                                    $nin: listIdPin,
                                    $in: list_id_cat_city,
                                    $ne: new_id,
                                },
                            },
                        },
                        {
                            $sort: {
                                new_vip_time: -1,
                                new_han_nop: -1,
                            },
                        },
                        {
                            $limit: numberNeed,
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'new_user_id',
                                foreignField: 'idTimViec365',
                                as: 'user',
                            },
                        },
                        {
                            $lookup: {
                                from: 'City',
                                localField: 'new_city',
                                foreignField: '_id',
                                as: 'City',
                            },
                        },
                        {
                            $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                        },
                        {
                            $project: {
                                _id: 0,
                                new_id: 1,
                                new_title: 1,
                                new_alias: 1,
                                new_han_nop: 1,
                                nm_id: 1,
                                nm_type: 1,
                                nm_unit: 1,
                                nm_min_value: 1,
                                nm_max_value: 1,
                                new_money: 1,
                                new_exp: 1,
                                new_gioi_tinh: 1,
                                new_so_luong: 1,
                                new_bang_cap: 1,
                                new_cap_bac: 1,
                                new_hinh_thuc: 1,
                                new_cat_id: 1,
                                new_city: 1,
                                new_badge: 1,
                                new_active: 1,
                                new_update_time: 1,
                                name_city: '$City.name',
                                user: {
                                    _id: 1,
                                    idTimViec365: 1,
                                    userName: 1,
                                    type: 1,
                                    alias: 1,
                                    avatarUser: 1,
                                    createdAt: 1,
                                    'inForCompany.timviec365.usc_badge': 1,
                                    chat365_secret: 1,
                                    email: 1,
                                    password: 1,
                                },
                            },
                        },
                    ]);

                    for (let i = 0; i < listSimulateNew2.length; i++) {
                        const element = listSimulateNew2[i];
                        element.new_money_str = await functions.new_money_tv(
                            element.nm_id,
                            element.nm_type,
                            element.nm_unit,
                            element.nm_min_value,
                            element.nm_max_value,
                            element.new_money
                        );
                    }
                    numberNeed -= listSimulateNew2.length;
                    if (numberNeed > 0 && list_id_cat_not_city.length > 0) {
                        listSimulateNew3 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                    new_vip_time: {
                                        $gte: timeNow,
                                    },
                                    $or: [
                                        { new_hot: 1 },
                                        { new_gap: 1 },
                                        { new_cao: 1 },
                                        { new_ghim: 1 },
                                        { new_nganh: 1 },
                                    ],
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'City',
                                    localField: 'new_city',
                                    foreignField: '_id',
                                    as: 'City',
                                },
                            },
                            {
                                $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    name_city: '$City.name',
                                    user: {
                                        _id: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        type: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                        for (let i = 0; i < listSimulateNew3.length; i++) {
                            let element = listSimulateNew3[i];
                            element.new_money_str = await functions.new_money_tv(
                                element.nm_id,
                                element.nm_type,
                                element.nm_unit,
                                element.nm_min_value,
                                element.nm_max_value,
                                element.new_money
                            );
                        }
                    }
                    const listId4 = listSimulateNew3.map((item) => item.new_id);
                    numberNeed -= listSimulateNew3.length;
                    if (numberNeed > 0 && list_id_cat_not_city.length > 0) {
                        listSimulateNew4 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: listId4,
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'City',
                                    localField: 'new_city',
                                    foreignField: '_id',
                                    as: 'City',
                                },
                            },
                            {
                                $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    name_city: '$City.name',
                                    user: {
                                        _id: 1,
                                        type: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                        for (let i = 0; i < listSimulateNew4.length; i++) {
                            let element = listSimulateNew4[i];
                            element.new_money_str = await functions.new_money_tv(
                                element.nm_id,
                                element.nm_type,
                                element.nm_unit,
                                element.nm_min_value,
                                element.nm_max_value,
                                element.new_money
                            );
                        }
                    }
                }
                if (numberNeed > 0 && list_id.length > 0) {
                    listSimulateNew5 = await NewTV365.aggregate([{
                            $match: {
                                new_id: {
                                    $nin: list_id_cat_city,
                                    $nin: list_id_cat_not_city,
                                    $in: list_id,
                                    $ne: new_id,
                                },
                                new_vip_time: {
                                    $gte: timeNow,
                                },
                                $or: [
                                    { new_hot: 1 },
                                    { new_gap: 1 },
                                    { new_cao: 1 },
                                    { new_ghim: 1 },
                                    { new_nganh: 1 },
                                ],
                            },
                        },
                        {
                            $sort: {
                                new_vip_time: -1,
                                new_han_nop: -1,
                            },
                        },
                        {
                            $limit: numberNeed,
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'new_user_id',
                                foreignField: 'idTimViec365',
                                as: 'user',
                            },
                        },
                        {
                            $lookup: {
                                from: 'City',
                                localField: 'new_city',
                                foreignField: '_id',
                                as: 'City',
                            },
                        },
                        {
                            $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                        },
                        {
                            $project: {
                                _id: 0,
                                new_id: 1,
                                new_title: 1,
                                new_alias: 1,
                                new_han_nop: 1,
                                nm_id: 1,
                                nm_type: 1,
                                nm_unit: 1,
                                nm_min_value: 1,
                                nm_max_value: 1,
                                new_money: 1,
                                new_exp: 1,
                                new_gioi_tinh: 1,
                                new_so_luong: 1,
                                new_bang_cap: 1,
                                new_cap_bac: 1,
                                new_hinh_thuc: 1,
                                new_cat_id: 1,
                                new_city: 1,
                                new_badge: 1,
                                new_active: 1,
                                new_update_time: 1,
                                name_city: '$City.name',
                                user: {
                                    _id: 1,
                                    idTimViec365: 1,
                                    userName: 1,
                                    alias: 1,
                                    type: 1,
                                    avatarUser: 1,
                                    createdAt: 1,
                                    'inForCompany.timviec365.usc_badge': 1,
                                    chat365_secret: 1,
                                    email: 1,
                                    password: 1,
                                },
                            },
                        },
                    ]);
                    for (let i = 0; i < listSimulateNew5.length; i++) {
                        let element = listSimulateNew5[i];
                        element.new_money_str = await functions.new_money_tv(
                            element.nm_id,
                            element.nm_type,
                            element.nm_unit,
                            element.nm_min_value,
                            element.nm_max_value,
                            element.new_money
                        );
                    }
                    const listId5 = listSimulateNew5.map((item) => item.new_id);
                    numberNeed -= listSimulateNew5.length;
                    if (numberNeed > 0) {
                        listSimulateNew6 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: listId5,
                                        $in: list_id,
                                        $ne: new_id,
                                    },
                                },
                            },
                            {
                                $sort: {
                                    new_vip_time: -1,
                                    new_han_nop: -1,
                                },
                            },
                            {
                                $limit: numberNeed,
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'new_user_id',
                                    foreignField: 'idTimViec365',
                                    as: 'user',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'City',
                                    localField: 'new_city',
                                    foreignField: '_id',
                                    as: 'City',
                                },
                            },
                            {
                                $unwind: { path: '$City', preserveNullAndEmptyArrays: true },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    new_id: 1,
                                    new_title: 1,
                                    new_alias: 1,
                                    new_han_nop: 1,
                                    nm_id: 1,
                                    nm_type: 1,
                                    nm_unit: 1,
                                    nm_min_value: 1,
                                    nm_max_value: 1,
                                    new_money: 1,
                                    new_exp: 1,
                                    new_gioi_tinh: 1,
                                    new_so_luong: 1,
                                    new_bang_cap: 1,
                                    new_cap_bac: 1,
                                    new_hinh_thuc: 1,
                                    new_cat_id: 1,
                                    new_city: 1,
                                    new_badge: 1,
                                    new_active: 1,
                                    new_update_time: 1,
                                    name_city: '$City.name',
                                    user: {
                                        _id: 1,
                                        idTimViec365: 1,
                                        userName: 1,
                                        alias: 1,
                                        type: 1,
                                        avatarUser: 1,
                                        createdAt: 1,
                                        'inForCompany.timviec365.usc_badge': 1,
                                        chat365_secret: 1,
                                        email: 1,
                                        password: 1,
                                    },
                                },
                            },
                        ]);
                        for (let i = 0; i < listSimulateNew6.length; i++) {
                            let element = listSimulateNew6[i];
                            element.new_money_str = await functions.new_money_tv(
                                element.nm_id,
                                element.nm_type,
                                element.nm_unit,
                                element.nm_min_value,
                                element.nm_max_value,
                                element.new_money
                            );
                        }
                    }
                }

                listSimulateNew = [
                    ...listSimulateNew1,
                    ...listSimulateNew2,
                    ...listSimulateNew3,
                    ...listSimulateNew4,
                    ...listSimulateNew5,
                    ...listSimulateNew6,
                ];
            }
            return functions.success(res, 'Get list suggestNew for user successfully', {
                listSimulateNew,
            });
        } else return functions.setError(res, 'Mission the new_id');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//thông tin độ phù hợp
exports.rankCandidate = async(req, res, next) => {
    try {
        const new_id = req.body.new_id;
        const use_id = req.body.use_id;
        if (new_id && use_id) {
            const promiseData = axios({
                method: 'post',
                url: 'http://43.239.223.21:9101/xep_hang_uv',
                data: {
                    new_id,
                    use_id,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const promiseData2 = axios({
                method: 'post',
                url: 'http://43.239.223.4:7003/view_mdtd',
                data: {
                    new_id: new_id,
                    use_id: use_id,
                    site_cv: 'uvtimviec365_5',
                    site_tin: 'timviec365',
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const [data, data2] = await Promise.all([promiseData, promiseData2]);
            const soluong = data.data;
            const fitValue = data2.data;
            if (data) {
                return functions.success(res, 'get level fitness successfully', {
                    soluong,
                    data: fitValue.data,
                });
            } else {
                return functions.setError(res, 'Failure get data');
            }
        } else return functions.setError(res, 'Missing use_id and new_id ');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//tool run always
//tin bi trung
const checkSpamNew = async() => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 60000));
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
            } else continue;
        } catch (e) {
            console.log(e.message);
        }
    }
};
//anh bi trung
const checkSpamImage = async() => {
    let i = -1;
    while (true) {
        i++;
        if (i == 4) {
            i = -1;
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }
        try {
            const timeNow = Math.round(Date.now() / 1000);
            let imageNoSpam = '';
            const newData = (
                await NewTV365.find({
                    new_images: { $ne: null, $ne: '' },
                    $or: [{ new_check_spam_img: 0 }, { new_check_spam_img: null }],
                    // new_update_time: {
                    // 	$gte: timeNow,
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
            // console.log('Checking spam image for new: ' + newId);

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

            const createTime = new Date(user['createdAt'] * 1000);
            const y = createTime.getFullYear();
            let d = createTime.getDate();
            d = d < 10 ? '0' + d : d;
            let m = createTime.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            const linkBase = 'https://cdn.timviec365.vn/pictures/videos/' + y + '/' + m + '/' + d + '/';

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
                // list_new_image: listNewImageName,
                // list_image: listImageName,
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

            // console.log('Check spam image is successfully ' + userId);
        } catch (e) {
            console.log(e);
            continue;
        }
    }
};
const checkGrammarNew = async() => {
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 3) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 60000));
            }
            const newCheck = await NewTV365.find({
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
        } catch (e) {
            console.log(e.message);
        }
    }
};
//ngu phap cho blog
const checkGrammarBlog = async() => {
    const timeNow = Date.now() / 1000;
    let i = -1;
    while (true) {
        try {
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 60000));
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
                await new Promise((resolve) => setTimeout(resolve, 60000));
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
        } catch (e) {
            console.log(e.message);
        }
    }
};
//chuyển đổi giọng nói cho bản tin
const translateTextToAudio = async() => {
    let i = -1;
    while (true) {
        try {
            const timeNow = Date.now() / 1000;
            i++;
            if (i == 4) {
                i = -1;
                await new Promise((resolve) => setTimeout(resolve, 60000));
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
            // console.log('Translating text of new to audio: ' + new_id);
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
            let viewer = 'Lượt xem: ' + (news['new_view_count'] ? news['new_view_count'] : 0);
            let infoGeneral = 'Thông tin chung: ';
            let update = 'Cập nhật: ';
            if (news.new_update_time > news.new_create_time) {
                const updateDate = new Date(news.new_update_time * 1000); // Chuyển đổi từ timestamp sang mili giây
                update += `${updateDate.getDate()}/${updateDate.getMonth() + 1}/${updateDate.getFullYear()}`;
            } else {
                const createDate = new Date(news.new_create_time * 1000); // Chuyển đổi từ timestamp sang mili giây
                update += `${createDate.getDate()}/${createDate.getMonth() + 1}/${createDate.getFullYear()}`;
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
                'Chức vụ: ' + (news.new_cap_bac != 0 ? service.getPosition(news.new_cap_bac) : 'Nhân viên') + '. ';

            if (news['new_hinh_thuc'] != 7) {
                infoGeneral +=
                    'Hình thức làm việc: ' +
                    (news.new_hinh_thuc > 0 ? service.getForm(news.new_hinh_thuc) : 'Toàn thời gian cố định') +
                    '. ';
            } else {
                infoGeneral += 'Hình thức làm việc: Việc làm từ xa. ';
            }

            if (news['new_hoahong'] != '') {
                infoGeneral += 'Hoa hồng: ' + news['new_hoahong'] + '. ';
            }

            infoGeneral +=
                'Số lượng cần tuyển: ' + (news.new_so_luong != '' ? news.new_so_luong : 'không hạn mức') + ' người. ';

            if (news.new_tgtv != '') infoGeneral += 'Thời gian thử việc: ' + news.new_tgtv + '. ';
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

            if (news['new_addr']) infoGeneral += '. ' + 'Địa chỉ chi tiết: ' + news['new_addr'] + '. ';

            infoGeneral += 'Mô tả công việc: ' + news['new_mota'].replace(/<[^>]*>/g, '');
            infoGeneral +=
                '. Yêu cầu: Kinh Nghiệm: ' +
                (news['new_exp'] > 0 ? service.getExperience(news['new_exp']) : 'Không yêu cầu') +
                '. ';
            infoGeneral +=
                'Bằng cấp: ' +
                (news['new_bang_cap'] != 0 ? service.getExperience(news['new_bang_cap']) : 'Không yêu cầu') +
                '. ';
            infoGeneral +=
                'Giới tính: ' + (news['new_gioi_tinh'] != '' ? news['new_gioi_tinh'] : 'Không yêu cầu') + '. ';
            infoGeneral +=
                news['new_yeucau'].replace(/<[^>]*>/g, '') +
                '. Quyền lợi: ' +
                news['new_quyenloi'].replace(/<[^>]*>/g, '');
            if (news['new_ho_so'] != '') infoGeneral += '. Hồ sơ: ' + news['new_ho_so'].replace(/<[^>]*>/g, '') + '. ';
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
                url: 'http://43.239.223.5:5133/tts',
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
            // console.log('Trans text new to audio is successfully ' + new_id);
        } catch (e) {
            console.log(e.message);
        }
    }
};

//AI - tìm kiếm việc làm cho APP
exports.SearchCareer = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 12;
        let newAI = [];
        let keyword = req.body.keyword; // Từ khóa
        let new_lv = req.body.new_lv; // Lấy từ khóa id lĩnh vực để tìm kiếm
        let new_city = req.body.new_city; // Tỉnh thành, thành phố
        let new_exp = req.body.new_exp; // Số năm kinh nghiệm
        let new_hinh_thuc = req.body.new_hinh_thuc; // Hình thức làm việc
        let new_cap_bac = req.body.new_cap_bac; // Cấp bậc (nhân viên, trưởng phòng, v.v.v)
        let new_money = req.body.new_money; // Mức lương mong muốn
        let new_gioi_tinh = req.body.new_gioi_tinh; // Yêu cầu về giới tính
        let new_qh_id = req.body.new_qh_id; // Quận huyện, phường xã
        let new_bang_cap = req.body.new_bang_cap; // Bằng cấp
        let new_cat_id = req.body.new_cat_id; // Ngành nghề mong muốn
        let type_search = req.body.type_search; // Kiểu loại search
        let usc_company = req.body.usc_company; // Tên của công ty
        let new_north_id = req.body.new_north_id; // Miền bắc
        let new_centeral_id = req.body.new_centeral_id; // Miền trung
        let new_south_id = req.body.new_south_id; // Miền nam
        let new_present = req.body.new_present; // Thời gian cập nhật
        let han_nop = req.body.han_nop; // Lấy tin tuyển dụng dựa vào thời gian hạn nộp
        let pagination = req.body.pagination; // Phân trang
        let size = req.body.size; // Số lượng tin tuyển dụng mỗi page
        let site = req.body.site || 'timviec365'; //Index của elasticsearch

        let condition = {};
        if (site) condition.site = site;
        if (keyword) condition.keyword = keyword;
        if (new_lv) condition.new_lv = new_lv;
        if (new_city) condition.new_city = new_city;
        if (new_exp) condition.new_exp = new_exp;
        if (new_hinh_thuc) condition.new_hinh_thuc = new_hinh_thuc;
        if (new_cap_bac) condition.new_cap_bac = new_cap_bac;
        if (new_money) condition.new_money = new_money;
        if (new_gioi_tinh) condition.new_gioi_tinh = new_gioi_tinh;
        if (new_qh_id) condition.new_qh_id = new_qh_id;
        if (new_bang_cap) condition.new_bang_cap = new_bang_cap;
        if (new_cat_id) condition.new_cat_id = new_cat_id;
        if (type_search) condition.type_search = type_search;
        if (usc_company) condition.usc_company = usc_company;
        if (new_north_id) condition.new_north_id = new_north_id;
        if (new_centeral_id) condition.new_centeral_id = new_centeral_id;
        if (new_south_id) condition.new_south_id = new_south_id;
        if (new_present) condition.new_present = new_present;
        if (han_nop) condition.han_nop = han_nop;
        if (pagination) condition.pagination = pagination;
        if (size) condition.size = size;
        let totalCount = 0;
        let takeData = await axios({
            method: 'post',
            url: 'http://43.239.223.4:5001/search_tin',
            data: condition,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (takeData.data.data) {
            //lọc dữ liệu nhận về
            let listNewId = takeData.data.data.list_id.split(',');
            for (let i = 0; i < listNewId.length; i++) {
                listNewId[i] = Number(listNewId[i]);
            }
            //lấy danh sách tin theo ID nhận từ AI
            if (takeData.data.data.total > 0) {
                let findNew = await NewTV365.aggregate([
                    { $match: { new_id: { $in: listNewId } } },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            pipeline: [{
                                $match: {
                                    $and: [{ type: 1 }, { idTimViec365: { $ne: 0 } }],
                                },
                            }, ],
                            as: 'user',
                        },
                    },
                    {
                        $unwind: '$user',
                    },
                    {
                        $project: {
                            new_id: 1,
                            usc_id: '$new_user_id',
                            new_title: 1,
                            new_md5: 1,
                            new_alias: 1,
                            new_301: 1,
                            new_cat_id: 1,
                            new_real_cate: 1,
                            new_city: 1,
                            new_qh_id: 1,
                            new_addr: 1,
                            new_money: 1,
                            new_cap_bac: 1,
                            new_exp: 1,
                            new_bang_cap: 1,
                            new_gioi_tinh: 1,
                            new_so_luong: 1,
                            new_hinh_thuc: 1,
                            new_user_id: 1,
                            new_user_redirect: 1,
                            new_do_tuoi: 1,
                            new_create_time: 1,
                            new_update_time: 1,
                            new_vip_time: 1,
                            new_vip: 1,
                            new_cate_time: 1,
                            new_active: 1,
                            new_type: 1,
                            new_over: 1,
                            new_view_count: 1,
                            new_han_nop: 1,
                            new_post: 1,
                            new_renew: 1,
                            new_hot: 1,
                            new_do: 1,
                            new_cao: 1,
                            new_gap: 1,
                            new_nganh: 1,
                            new_ghim: 1,
                            new_thuc: 1,
                            new_order: 1,
                            new_ut: 1,
                            send_vip: 1,
                            new_hide_admin: 1,
                            new_point: 1,
                            new_test: 1,
                            new_badge: 1,
                            new_check_spam: 1,
                            new_id_deplicate: 1,
                            new_ho_so: 1,
                            new_title_seo: 1,
                            new_des_seo: 1,
                            new_hoahong: 1,
                            new_tgtv: 1,
                            new_lv: 1,
                            new_bao_luu: 1,
                            time_bao_luu: 1,
                            no_jobposting: 1,
                            new_video: 1,
                            new_video_type: 1,
                            new_video_active: 1,
                            new_images: 1,
                            nm_id: 1,
                            nm_type: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            nm_unit: 1,
                            usc_badge: '$user.inForCompany.timviec365.usc_badge',
                            usc_id: '$user.idTimViec365',
                            usc_company: '$user.userName',
                            usc_alias: '$user.alias',
                            chat365_id: '$user._id',
                            usc_time_login: '$user.time_login',
                            usc_create_time: '$user.createdAt',
                            usc_logo: '$user.avatarUser',
                            usc_star: '$user.inForCompany.timviec365.usc_star',
                            isOnline: '$user.isOnline',
                            new_qc: "false"
                        },
                    },
                ]);
                // for (let i = 0; i < findNew.length; i++) {
                // let element = findNew[i]
                // element.new_money_str = await functions.new_money_tv(0, element.nm_type, element.nm_unit, element.nm_min_value, element.nm_max_value, element.new_money);
                // newAI.push(findNew[i])
                // }
                let listCampaign;
                if (page == 1) {
                    listCampaign = await service.listNewCampaign(keyword);
                }
                if (page == 1) {
                    if (listCampaign.list_top.length > 0) {
                        findNew = [...listCampaign.list_top, ...findNew];
                    }
                    if (listCampaign.list_bot.length > 0) {
                        findNew = [...findNew, ...listCampaign.list_bot];
                    }
                }
                await Promise.all(
                    findNew.map(async(element) => {
                        //xử lí hình ảnh
                        let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                        element.usc_logo = avatarUser;
                        //xử lí đường dẫn
                        let url = functions.renderAliasURL(element.new_id, element.new_alias, element.new_title);
                        element.url = url;
                        const new_city = element.new_city;
                        //xử lí đếm like và comment
                        const newID = element.new_id;
                        let [countLike, countComments, new_money_str, listWordReacted, countVote] = await Promise.all([
                            service.inforLikeChild(element.new_id, 0),
                            CommentPost.countDocuments({
                                cm_parent_id: 0,
                                cm_new_id: Number(element.new_id),
                            }),
                            // xử lý mức lương
                            functions.new_money_tv(
                                0,
                                0,
                                element.nm_unit,
                                element.nm_min_value,
                                element.nm_max_value,
                                element.new_money
                            ),

                            // Từ khóa liên quan (wordReacted)
                            Keyword.aggregate([{
                                    $match: {
                                        key_name: { $ne: '' },
                                        key_301: '',
                                        key_cb_id: 0,
                                        key_city_id: { $in: new_city },
                                        key_cate_lq: { $in: element.new_cat_id },
                                        // key_name: {
                                        // $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                                        // },
                                    },
                                },
                                { $limit: 3 },
                                {
                                    $project: {
                                        _id: 0,
                                        key_id: 1,
                                        key_cate_id: 1,
                                        key_city_id: 1,
                                        key_qh_id: 1,
                                        key_name: 1,
                                        key_cb_id: 1,
                                        key_type: 1,
                                    },
                                },
                            ]),
                            // Xử lý đếm số sao đánh giá
                            SaveVote.aggregate([
                                { $match: { id_be_vote: newID, type: 'new' } },
                                {
                                    $group: {
                                        _id: null,
                                        sum: { $sum: '$star' },
                                        count: { $sum: 1 },
                                    },
                                },
                            ]),
                        ]);
                        if (countLike) {
                            //xử lí đếm từng loại cảm xúc
                            let arr_count_like = countLike.map((vl_lk) => vl_lk.lk_type);
                            element.items_count_like = arr_count_like.reduce((acc, val) => {
                                acc[val] = (acc[val] || 0) + 1;
                                return acc;
                            }, {});
                            element.count_like = countLike.length;

                            const user = await functions.getTokenUser(req, res);
                            // Xử lý luồng người dùng đăng nhập
                            if (user) {
                                const idchat = user._id; // id chat
                                //ktra xem người dùng tương tác bài hay chưa
                                let LikeYet = await LikePost.findOne({
                                    lk_new_id: Number(element.new_id),
                                    lk_user_idchat: Number(idchat),
                                    lk_type: { $lt: 8 },
                                    lk_for_comment: 0,
                                });
                                element.type_lk = LikeYet ? LikeYet.lk_type : 0;
                            }
                            element.listLike = countLike;
                        } else {
                            element.type_lk = 0;
                            element.count_like = 0;
                            element.listLike = countLike;
                        }

                        //Xử lí tên tỉnh thành cho tiện ích app chat
                        if (element.new_city != '' && element.new_city != null && element.new_city != 0) {
                            let array_name_city =
                                typeof element.new_city == 'string' ? element.new_city.split(',') : element.new_city;
                            for (let t = 0; t < array_name_city.length; t++) {
                                if (array_name_city[t] !== 0) {
                                    let cit = await City.findOne({ _id: array_name_city[t] }).select('name').lean();
                                    if (cit) array_name_city[t] = cit.name;
                                }
                            }

                            element.new_name_cit = array_name_city.toString();
                        } else {
                            element.new_name_cit = 'Toàn quốc';
                        }
                        //Xử lí tên từ khóa cho app
                        if (listWordReacted) {
                            let array_kw =
                                typeof listWordReacted == 'object' ? listWordReacted.map((item) => item.key_name) : '';

                            if (array_kw != ',,') element.listWordReacted = array_kw.toString();
                            else element.listWordReacted = '';
                        } else {
                            element.listWordReacted = '';
                        }
                        element.count_comments = countComments;
                        element.new_money_str = new_money_str;
                        // Xử lý đếm số sao đánh giá
                        if (countVote.length > 0) {
                            element.sum_star = countVote[0].sum;
                            element.count_star = countVote[0].count;
                        } else {
                            element.sum_star = 0;
                            element.count_star = 0;
                        }

                        element.resultCountVote = [];
                        for (let n = 1; n <= 5; n++) {
                            const result = await SaveVote.countDocuments({
                                id_be_vote: newID,
                                type: 'new',
                                star: n,
                            });
                            element.resultCountVote.push(result);
                        }
                        newAI.push(element);
                    })
                );
                totalCount = takeData.data.data.total;
            }
            return functions.success(res, 'Get list is successfully', { newAI, totalCount });
        }
        return functions.setError(res, 'đã có lỗi với tìm kiếm bằng AI');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//trang chủ timviec cho app
exports.homePageApp = async(req, res, next) => {
    try {
        let lk_user_idchat = req.body.idchat;
        let pageSizeHD = Number(req.body.pageSizeHD) || 30;
        let pageSizeTH = Number(req.body.pageSizeTH) || 21;
        let pageSizeTG = Number(req.body.pageSizeTG) || 30;
        let statusSavePost = false;
        let now = new Date().getTime() / 1000;
        const timeNow = Math.round(Date.now() / 1000);
        let listsHot = [],
            listsGap = [],
            listsTH = [];
        const lookUser = {
            $lookup: {
                from: 'Users',
                localField: 'new_user_id',
                foreignField: 'idTimViec365',
                as: 'user',
            },
        };
        const project = {
            $project: {
                _id: 0,
                new_id: 1,
                new_title: 1,
                new_han_nop: 1,
                new_cat_id: 1,
                new_do: 1,
                new_ghim: 1,
                new_thuc: 1,
                new_alias: 1,
                new_active: 1,
                new_money: 1,
                new_hinh_thuc: 1,
                new_city: 1,
                new_create_time: 1,
                nm_id: 1,
                nm_type: 1,
                nm_min_value: 1,
                nm_max_value: 1,
                nm_unit: 1,
                new_badge: 1,
                new_view_count: 1,
                new_quyenloi: 1,
                new_yeucau: 1,
                new_money_str: 1,
                usc_badge: '$user.inForCompany.timviec365.usc_badge',
                usc_id: '$user.idTimViec365',
                usc_company: '$user.userName',
                usc_alias: '$user.alias',
                chat365_id: '$user._id',
                usc_time_login: '$user.time_login',
                usc_create_time: '$user.createdAt',
                usc_logo: '$user.avatarUser',
                usc_star: '$user.inForCompany.timviec365.usc_star',
                isOnline: '$user.isOnline',
            },
        };
        const functionProcessCount = async(cond) => {
            await Promise.all(
                cond.map(async(element) => {
                    //xử lí hình ảnh
                    let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    element.usc_logo = avatarUser;
                    //xử lí đường dẫn
                    let url = functions.renderAliasURL(element.new_id, element.new_alias, element.new_title);
                    element.url = url;
                    const new_city = element.new_city;
                    //xử lí đếm like và comment
                    const newID = element.new_id;
                    //xử lí kiểm tra người dùng lưu bài viết chưa
                    element.saved = statusSavePost;
                    // Xử lý luồng người dùng đăng nhập
                    const user = await functions.getTokenUser(req, res);
                    if (user) {
                        const userID = user.idTimViec365;
                        let savePost = await functions.getDatafindOne(UserSavePost, { use_id: userID, new_id: newID });
                        if (savePost) element.saved = true;
                    }
                    let [countLike, countComments, new_money_str, listWordReacted, countVote] = await Promise.all([
                        service.inforLikeChild(element.new_id, 0),
                        CommentPost.countDocuments({
                            // cm_parent_id: 0,
                            cm_new_id: Number(element.new_id),
                        }),
                        // xử lý mức lương
                        functions.new_money_tv(
                            0,
                            0,
                            element.nm_unit,
                            element.nm_min_value,
                            element.nm_max_value,
                            element.new_money
                        ),

                        // Từ khóa liên quan (wordReacted)
                        Keyword.aggregate([{
                                $match: {
                                    key_name: { $ne: '' },
                                    key_301: '',
                                    key_cb_id: 0,
                                    key_city_id: { $in: new_city },
                                    key_cate_lq: { $in: element.new_cat_id },
                                    // key_name: {
                                    // $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                                    // },
                                },
                            },
                            { $limit: 3 },
                            {
                                $project: {
                                    _id: 0,
                                    key_id: 1,
                                    key_cate_id: 1,
                                    key_city_id: 1,
                                    key_qh_id: 1,
                                    key_name: 1,
                                    key_cb_id: 1,
                                    key_type: 1,
                                },
                            },
                        ]),
                        // Xử lý đếm số sao đánh giá
                        SaveVote.aggregate([
                            { $match: { id_be_vote: newID, type: 'new' } },
                            {
                                $group: {
                                    _id: null,
                                    sum: { $sum: '$star' },
                                    count: { $sum: 1 },
                                },
                            },
                        ]),
                    ]);
                    if (countLike.length > 0) {
                        //xử lí đếm từng loại cảm xúc
                        let arr_count_like = countLike.map((vl_lk) => vl_lk.lk_type);
                        element.items_count_like = arr_count_like.reduce((acc, val) => {
                            acc[val] = (acc[val] || 0) + 1;
                            return acc;
                        }, {});
                        element.count_like = countLike.length;

                        if (lk_user_idchat) {
                            //ktra xem người dùng tương tác bài hay chưa
                            let LikeYet = await LikePost.findOne({
                                lk_new_id: Number(element.new_id),
                                lk_user_idchat: Number(lk_user_idchat),
                                lk_type: { $lt: 8 },
                                lk_for_comment: 0,
                            });
                            element.type_lk = LikeYet ? LikeYet.lk_type : 0;
                        }
                        element.listLike = countLike;
                    } else {
                        element.type_lk = 0;
                        element.count_like = 0;
                        element.listLike = countLike;
                    }

                    //Xử lí tên tỉnh thành cho tiện ích app chat
                    if (element.new_city != '' && element.new_city != null && element.new_city != 0) {
                        let array_name_city =
                            typeof element.new_city == 'string' ? element.new_city.split(',') : element.new_city;
                        for (let t = 0; t < array_name_city.length; t++) {
                            if (array_name_city[t] !== 0) {
                                let cit = await City.findOne({ _id: array_name_city[t] }).select('name').lean();
                                if (cit) array_name_city[t] = cit.name;
                            }
                        }

                        element.new_name_cit = array_name_city.toString();
                    } else {
                        element.new_name_cit = 'Toàn quốc';
                    }
                    //Xử lí tên từ khóa cho app
                    if (listWordReacted) {
                        let array_kw =
                            typeof listWordReacted == 'object' ? listWordReacted.map((item) => item.key_name) : '';

                        if (array_kw != ',,') element.listWordReacted = array_kw.toString();
                        else element.listWordReacted = '';
                    } else {
                        element.listWordReacted = '';
                    }
                    element.count_comments = countComments;
                    element.new_money_str = new_money_str;
                    // Xử lý đếm số sao đánh giá
                    if (countVote.length > 0) {
                        element.sum_star = countVote[0].sum;
                        element.count_star = countVote[0].count;
                    } else {
                        element.sum_star = 0;
                        element.count_star = 0;
                    }

                    element.resultCountVote = [];
                    for (let n = 1; n <= 5; n++) {
                        const result = await SaveVote.countDocuments({
                            id_be_vote: newID,
                            type: 'new',
                            star: n,
                        });
                        element.resultCountVote.push(result);
                    }
                })
            );
        };
        let [listPostVLHD, listPostVLTH, listPostVLTG] = await Promise.all([
            NewTV365.aggregate([{
                    $match: {
                        new_cao: 0,
                        new_gap: 0,
                        new_han_nop: { $gt: now },
                    },
                },
                {
                    $sort: {
                        new_hot: -1,
                        new_update_time: -1,
                    },
                },
                {
                    $skip: 0,
                },
                {
                    $limit: Number(pageSizeHD),
                },
                lookUser,
                {
                    $unwind: '$user',
                },
                {
                    $match: {
                        'user.type': 1,
                    },
                },
                project,
            ]),
            NewTV365.aggregate([{
                    $match: {
                        new_hot: 0,
                        new_gap: 0,
                        new_han_nop: { $gt: now },
                    },
                },
                {
                    $sort: {
                        new_cao: -1,
                        new_update_time: -1,
                    },
                },
                {
                    $skip: 0,
                },
                {
                    $limit: pageSizeTH,
                },
                lookUser,
                {
                    $unwind: '$user',
                },

                project,
            ]),
            NewTV365.aggregate([{
                    $match: {
                        new_cao: 0,
                        new_hot: 0,
                        new_han_nop: { $gt: now },
                    },
                },
                {
                    $sort: {
                        new_gap: -1,
                        new_update_time: -1,
                    },
                },
                {
                    $skip: 0,
                },
                {
                    $limit: pageSizeTG,
                },
                lookUser,
                {
                    $unwind: '$user',
                },

                project,
            ]),
        ]);
        if (listPostVLHD.length > 0) {
            await functionProcessCount(listPostVLHD);
        }
        if (listPostVLTH.length > 0) {
            await functionProcessCount(listPostVLTH);
        }
        if (listPostVLTG.length > 0) {
            await functionProcessCount(listPostVLTG);
        }

        // let newAI = []

        // let candiCateID = req.body.candiCateID

        // let takeData = await axios({
        // method: "post",
        // url: "http://43.239.223.10:4001/recommendation_tin_ungvien",
        // data: {
        // site_job: "timviec365",
        // site_uv: "uvtimviec365",
        // new_id: candiCateID,
        // size: 20,
        // pagination: 1,
        // },
        // headers: { "Content-Type": "multipart/form-data" }
        // });
        // let listNewId = takeData.data.data.list_id.split(",")
        // for (let i = 0; i < listNewId.length; i++) {
        // listNewId[i] = Number(listNewId[i])
        // }

        // let findNew = await functions.getDatafind(NewTV365, { _id: { $in: listNewId } })
        // for (let i = 0; i < findNew.length; i++) {
        // newAI.push(findNew[i])
        // }

        // Lấy bài viết chân trang
        const dataSeo = await TblModules.findOne({
            module: 'https://timviec365.vn/',
        }).lean();

        return functions.success(res, 'Lấy danh sách tin đăng thành công', {
            VLHD: listPostVLHD,
            VLTH: listPostVLTH,
            VLTG: listPostVLTG,
            dataSeo,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//sửa bình luận tin tuyển dụng
exports.editComment = async(req, res, next) => {
    try {
        const cm_sender_idchat = req.user.data._id;
        const cm_new_id = req.body.cm_new_id;
        const cm_id = req.body.cm_id;
        const delete_file = req.body.delete_file;
        const cm_parent_id = req.body.cm_parent_id || 0;
        const cm_comment = req.body.cm_comment;
        const cm_tag = req.body.cm_tag;
        const cm_time = functions.getTimeNow();
        const File = req.files || null;
        let FileName = null;
        if (cm_id && cm_new_id && cm_comment) {
            let findNew = await NewTV365.findOne({ new_id: cm_new_id }, { new_id: 1 });
            if (findNew) {
                const findComment = await CommentPost.findOne({
                    cm_id: cm_id,
                    cm_new_id: cm_new_id,
                    cm_sender_idchat: cm_sender_idchat,
                });

                if (findComment) {
                    if (delete_file) {
                        await service.deleteFileNew(findComment.cm_time, findComment.cm_img);
                    }
                    if (File && File.FileName) {
                        let upload = await service.uploadCmt(
                            findComment.cm_img,
                            findComment.cm_time,
                            File.FileName, ['.jpeg', '.jpg', '.png'],
                            cm_time
                        );
                        if (!upload) {
                            return functions.setError(res, 'có lỗi trong quá trình tải ảnh');
                        }
                        FileName = upload;
                    }
                    await CommentPost.updateOne({
                        cm_id: cm_id,
                    }, {
                        cm_new_id: cm_new_id,
                        cm_parent_id: cm_parent_id,
                        cm_comment: cm_comment,
                        cm_time: cm_time,
                        cm_tag: cm_tag,
                        cm_img: FileName,
                    });
                    return functions.success(res, 'Sửa bình luận thành công');
                }
                return functions.setError(res, 'không tìm thấy bình luận cần sửa', 400);
            }
            return functions.setError(res, 'không tồn tại tin tuyển dụng này', 400);
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    } catch (e) {
        console.log('Đã có lỗi xảy ra khi sửa bình luận', e);
        return functions.setError(res, e.message);
    }
};

//Xoá tin tuyển dụng
exports.deleteComment = async(req, res, next) => {
    try {
        const cm_sender_idchat = req.user.data._id;
        const cm_id = req.body.cm_id;
        if (cm_id && cm_sender_idchat) {
            //tìm tất cả cm_id và cm_parent_id
            let [findComment, findChildComment] = await Promise.all([
                CommentPost.findOne({
                    cm_id: cm_id,
                    cm_sender_idchat: cm_sender_idchat,
                }),
                CommentPost.find({
                    cm_parent_id: cm_id,
                    cm_img: { $ne: null },
                }),
            ]);
            //xóa ảnh bình luận
            if (findComment) {
                service.deleteFileNew(findComment.cm_time, findComment.cm_img);
            }
            // xóa tất cả ảnh bình luận reply
            if (findChildComment) {
                await Promise.all(
                    findChildComment.map(async(element) => {
                        service.deleteFileNew(element.cm_time, element.cm_img);
                    })
                );
            }
            //xóa data trong base
            await CommentPost.deleteMany({
                $or: [{ cm_id: { $in: cm_id } }, { cm_parent_id: { $in: cm_id } }],
            });

            return functions.success(res, 'xóa bình luận thành công');
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ');
    } catch (e) {
        console.log('Đã có lỗi xảy ra khi xóa bình luận', e);
        return functions.setError(res, e.message);
    }
};

//Tìm kiếm ứng viên theo ngôn ngữ
exports.findByLanguage = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 12;
        let newAI = [];
        let pagination = req.body.pagination;
        let size = req.body.size;
        let site = req.body.site;
        let cv_city_id = req.body.cv_city_id; // Tỉnh thành, thành phố
        let keyword = req.body.keyword; // Từ khóa
        let cv_cate_id = req.body.cv_cate_id;
        let language = req.body.language;
        let name = req.body.name;
        let use_first_name = req.body.use_first_name;
        let use_birth_day = req.body.use_birth_day;
        let cv_money_id = req.body.cv_money_id;
        let hide_list_id = req.body.hide_list_id;

        let condition = {};
        if (site) condition.site = site;
        if (cv_city_id) condition.cv_city_id = cv_city_id;
        if (keyword) condition.keyword = keyword; // Từ khóa
        if (cv_cate_id) condition.cv_cate_id = cv_cate_id;
        if (language) condition.language = language;
        if (name) condition.name = name;
        if (use_first_name) condition.use_first_name = use_first_name;
        if (use_birth_day) condition.use_birth_day = use_birth_day;
        if (cv_money_id) condition.cv_money_id = cv_money_id;
        if (hide_list_id) condition.hide_list_id = hide_list_id;
        if (pagination) condition.pagination = pagination;
        if (size) condition.size = size;
        let totalCount = 0;
        let takeData = await axios({
            method: 'post',
            url: 'http://43.239.223.4:9221/search_uv',
            data: condition,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (takeData.data.data) {
            //lọc dữ liệu nhận về
            let listNewId = takeData.data.data.list_id.split(',');
            for (let i = 0; i < listNewId.length; i++) {
                listNewId[i] = Number(listNewId[i]);
            }
            //lấy danh sách tin theo ID nhận từ AI
            if (takeData.data.data.total > 0) {
                let findNew = await NewTV365.aggregate([
                    { $match: { new_id: { $in: listNewId } } },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'new_user_id',
                            foreignField: 'idTimViec365',
                            as: 'user',
                        },
                    },
                    {
                        $unwind: '$user',
                    },
                    {
                        $project: {
                            new_id: 1,
                            new_title: 1,
                            new_money: 1,
                            new_city: 1,
                            new_cat_id: 1,
                            new_create_time: 1,
                            new_update_time: 1,
                            new_view_count: 1,
                            new_alias: 1,
                            new_ghim: 1,
                            new_hot: 1,
                            new_cao: 1,
                            new_gap: 1,
                            new_nganh: 1,
                            new_active: 1,
                            new_han_nop: 1,
                            new_yeucau: 1,
                            new_quyenloi: 1,
                            new_bang_cap: 1,
                            nm_type: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            new_exp: 1,
                            nm_unit: 1,
                            nm_id: 1,
                            usc_id: '$user.idTimViec365',
                            usc_create_time: '$user.createdAt',
                            usc_company: '$user.userName',
                            usc_alias: '$user.alias',
                            usc_logo: '$user.avatarUser',
                            usc_time_login: '$user.time_login',
                            usc_star: '$user.inForCompany.timviec365.usc_star',
                            chat365_secret: '$user.chat365_secret',
                            usc_city: '$user.city',
                            chat365_id: '$user._id',
                            isOnline: '$user.isOnline',
                            saved: '',
                            applied: '',
                            new_badge: 1,
                        },
                    },
                ]);
                // Kiểm tra xem có đăng nhập hay không
                const user = await functions.getTokenUser(req, res, next);

                for (let i = 0; i < findNew.length; i++) {
                    const element = findNew[i];
                    let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                    element.usc_logo = avatarUser;
                    element.new_city = element.new_city.toString();
                    element.new_cat_id = element.new_cat_id.toString();
                    if (user.type == 0) {
                        const userID = user.idTimViec365;

                        //check ứng viên ứng tuyển hoặc lưu tin
                        const apply = await functions.getDatafindOne(ApplyForJob, {
                                nhs_use_id: userID,
                                nhs_new_id: element.new_id,
                                nhs_kq: { $ne: 10 },
                            }),
                            savePost = await functions.getDatafindOne(UserSavePost, {
                                use_id: userID,
                                new_id: element.new_id,
                            });

                        if (apply) element.applied = true;
                        if (savePost) element.saved = true;
                    }
                }
                totalCount = takeData.data.data.total;
                return functions.success(res, 'Get list is successfully', { findNew, totalCount });
            }
            return functions.setError(res, 'khong có dữ liệu');
        }
        return functions.setError(res, 'đã có lỗi với tìm kiếm bằng AI');
    } catch (e) {
        console.log('Đã có lỗi xảy ra khi tìm kiếm ứng viên theo ngôn ngữ', e);
        return functions.setError(res, e.message);
    }
};
const checkBase = async() => {
    let listNew = await PostsTV365.find({ new_check_grammar: 1 }).lean();
    let listNewId = [];
    for (let i = 0; i < listNew.length; i++) {
        listNewId.push(listNew[i].new_id);
    }
    console.log(listNewId.join(','));
};

exports.countApplyNews = async(req, res, next) => {
    try {
        const id_news = req.body.id_news;
        if (id_news) {
            const count = await ApplyForJob.countDocuments({ nhs_new_id: id_news });
            return functions.success(res, count);
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ');
        }
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

//tin tương tự cho app
exports.listSimulateNewForApp = async(req, res, next) => {
    try {
        const timeNow = Math.round(Date.now() / 1000);
        const new_id = Number(req.body.new_id);
        if (new_id) {
            const dataSimulateNew = await axios({
                method: 'post',
                url: 'http://43.239.223.21:7010/similar_news',
                data: {
                    site: 'timviec365',
                    new_id,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            let listSimulateNew = [];
            let listSimulateNew1 = [];
            let listSimulateNew2 = [];
            let listSimulateNew3 = [];
            let listSimulateNew4 = [];
            let listSimulateNew5 = [];
            let listSimulateNew6 = [];
            if (dataSimulateNew) {
                let { list_id_cat_city, list_id_cat_not_city, list_id } = dataSimulateNew.data;
                list_id_cat_city = list_id_cat_city.map(Number);
                list_id_cat_not_city = list_id_cat_not_city.map(Number);
                list_id = list_id.map(Number);
                const sort = {
                    $sort: {
                        new_vip_time: -1,
                        new_han_nop: -1,
                    },
                };
                const lookUser = {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                };
                const unwindUser = {
                    $unwind: '$user',
                };
                const lookCity = {
                    $lookup: {
                        from: 'City',
                        localField: 'new_city',
                        foreignField: '_id',
                        as: 'City',
                    },
                };
                const targetfilter = {
                    $project: {
                        new_vip_time: 1,
                        new_hot: 1,
                        new_gap: 1,
                        new_cao: 1,
                        new_ghim: 1,
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_alias: 1,
                        new_han_nop: 1,
                        nm_id: 1,
                        nm_type: 1,
                        nm_unit: 1,
                        nm_min_value: 1,
                        nm_max_value: 1,
                        new_money: 1,
                        new_exp: 1,
                        new_gioi_tinh: 1,
                        new_so_luong: 1,
                        new_bang_cap: 1,
                        new_cap_bac: 1,
                        new_hinh_thuc: 1,
                        new_cat_id: 1,
                        new_city: 1,
                        new_badge: 1,
                        new_active: 1,
                        new_update_time: 1,
                        name_city: '$City.name',
                        name_com: '$user.userName',
                        idchat: '$user._id',
                        usc_badge: '$user.inForCompany.timviec365.usc_badge',
                        usc_id_timviec: '$user.idTimViec365',
                        usc_alias: '$user.alias',
                        usc_time_login: '$user.time_login',
                        usc_create_time: '$user.createdAt',
                        usc_logo: '$user.avatarUser',
                        usc_star: '$user.inForCompany.timviec365.usc_star',
                        isOnline: '$user.isOnline',
                    },
                };
                const myFunctionGetNewMoneyStr = async(cond) => {
                    await Promise.all(
                        cond.map(async(element) => {
                            //xử lí hình ảnh
                            let avatarUser = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                            element.usc_logo = avatarUser;
                            //xử lí đường dẫn
                            let url = functions.renderAliasURL(element.new_id, element.new_alias, element.new_title);
                            element.url = url;
                            const new_city = element.new_city;
                            //xử lí đếm like và comment
                            const newID = element.new_id;
                            let [countLike, countComments, new_money_str, listWordReacted, countVote] =
                            await Promise.all([
                                service.inforLikeChild(element.new_id, 0),
                                CommentPost.countDocuments({
                                    cm_parent_id: 0,
                                    cm_new_id: Number(element.new_id),
                                }),
                                // xử lý mức lương
                                functions.new_money_tv(
                                    0,
                                    0,
                                    element.nm_unit,
                                    element.nm_min_value,
                                    element.nm_max_value,
                                    element.new_money
                                ),

                                // Từ khóa liên quan (wordReacted)
                                Keyword.aggregate([{
                                        $match: {
                                            key_name: { $ne: '' },
                                            key_301: '',
                                            key_cb_id: 0,
                                            key_city_id: { $in: new_city },
                                            key_cate_lq: { $in: element.new_cat_id },
                                            // key_name: {
                                            // $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                                            // },
                                        },
                                    },
                                    { $limit: 3 },
                                    {
                                        $project: {
                                            _id: 0,
                                            key_id: 1,
                                            key_cate_id: 1,
                                            key_city_id: 1,
                                            key_qh_id: 1,
                                            key_name: 1,
                                            key_cb_id: 1,
                                            key_type: 1,
                                        },
                                    },
                                ]),
                                // Xử lý đếm số sao đánh giá
                                SaveVote.aggregate([
                                    { $match: { id_be_vote: newID, type: 'new' } },
                                    {
                                        $group: {
                                            _id: null,
                                            sum: { $sum: '$star' },
                                            count: { $sum: 1 },
                                        },
                                    },
                                ]),
                            ]);
                            if (countLike) {
                                //xử lí đếm từng loại cảm xúc
                                let arr_count_like = countLike.map((vl_lk) => vl_lk.lk_type);
                                element.items_count_like = arr_count_like.reduce((acc, val) => {
                                    acc[val] = (acc[val] || 0) + 1;
                                    return acc;
                                }, {});
                                element.count_like = countLike.length;

                                const user = await functions.getTokenUser(req, res);
                                // Xử lý luồng người dùng đăng nhập
                                if (user) {
                                    const idchat = user._id; // id chat
                                    //ktra xem người dùng tương tác bài hay chưa
                                    let LikeYet = await LikePost.findOne({
                                        lk_new_id: Number(element.new_id),
                                        lk_user_idchat: Number(idchat),
                                        lk_type: { $lt: 8 },
                                        lk_for_comment: 0,
                                    });
                                    element.type_lk = LikeYet ? LikeYet.lk_type : 0;
                                }
                                element.listLike = countLike;
                            } else {
                                element.type_lk = 0;
                                element.count_like = 0;
                                element.listLike = countLike;
                            }

                            //Xử lí tên tỉnh thành cho tiện ích app chat
                            if (element.new_city != '' && element.new_city != null && element.new_city != 0) {
                                let array_name_city =
                                    typeof element.new_city == 'string' ?
                                    element.new_city.split(',') :
                                    element.new_city;
                                for (let t = 0; t < array_name_city.length; t++) {
                                    if (array_name_city[t] !== 0) {
                                        let cit = await City.findOne({ _id: array_name_city[t] }).select('name').lean();
                                        if (cit) array_name_city[t] = cit.name;
                                    }
                                }

                                element.new_name_cit = array_name_city.toString();
                            } else {
                                element.new_name_cit = 'Toàn quốc';
                            }
                            //Xử lí tên từ khóa cho app
                            if (listWordReacted) {
                                let array_kw =
                                    typeof listWordReacted == 'object' ?
                                    listWordReacted.map((item) => item.key_name) :
                                    '';

                                if (array_kw != ',,') element.listWordReacted = array_kw.toString();
                                else element.listWordReacted = '';
                            } else {
                                element.listWordReacted = '';
                            }
                            element.count_comments = countComments;
                            element.new_money_str = new_money_str;
                            // Xử lý đếm số sao đánh giá
                            if (countVote.length > 0) {
                                element.sum_star = countVote[0].sum;
                                element.count_star = countVote[0].count;
                            } else {
                                element.sum_star = 0;
                                element.count_star = 0;
                            }

                            element.resultCountVote = [];
                            for (let n = 1; n <= 5; n++) {
                                const result = await SaveVote.countDocuments({
                                    id_be_vote: newID,
                                    type: 'new',
                                    star: n,
                                });
                                element.resultCountVote.push(result);
                            }
                        })
                    );
                };
                listSimulateNew1 = await NewTV365.aggregate([{
                        $match: {
                            new_id: {
                                $in: list_id_cat_city,
                                $ne: new_id,
                            },
                            new_vip_time: {
                                $gte: timeNow,
                            },
                            $or: [{ new_hot: 1 }, { new_gap: 1 }, { new_cao: 1 }, { new_nganh: 1 }, { new_ghim: 1 }],
                        },
                    },
                    sort,
                    {
                        $limit: 12,
                    },
                    lookUser,
                    unwindUser,
                    lookCity,
                    targetfilter,
                ]);
                await myFunctionGetNewMoneyStr(listSimulateNew1);
                let numberNeed = 12 - listSimulateNew1.length;
                if (numberNeed > 0 && list_id_cat_city.length > 0) {
                    let listIdPin = listSimulateNew1.map((item) => item.new_id);
                    listSimulateNew2 = await NewTV365.aggregate([{
                            $match: {
                                new_id: {
                                    $nin: listIdPin,
                                    $in: list_id_cat_city,
                                    $ne: new_id,
                                },
                            },
                        },
                        sort,
                        {
                            $limit: numberNeed,
                        },
                        lookUser,
                        unwindUser,
                        lookCity,
                        targetfilter,
                    ]);
                    await myFunctionGetNewMoneyStr(listSimulateNew2);

                    numberNeed -= listSimulateNew2.length;
                    if (numberNeed > 0 && list_id_cat_not_city.length > 0) {
                        listSimulateNew3 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                    new_vip_time: {
                                        $gte: timeNow,
                                    },
                                    $or: [
                                        { new_hot: 1 },
                                        { new_gap: 1 },
                                        { new_cao: 1 },
                                        { new_ghim: 1 },
                                        { new_nganh: 1 },
                                    ],
                                },
                            },
                            sort,
                            {
                                $limit: numberNeed,
                            },
                            lookUser,
                            lookCity,
                            targetfilter,
                        ]);
                        await myFunctionGetNewMoneyStr(listSimulateNew3);
                    }
                    const listId4 = listSimulateNew3.map((item) => item.new_id);
                    numberNeed -= listSimulateNew3.length;
                    if (numberNeed > 0 && list_id_cat_not_city.length > 0) {
                        listSimulateNew4 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: listId4,
                                        $in: list_id_cat_not_city,
                                        $ne: new_id,
                                    },
                                },
                            },
                            sort,
                            {
                                $limit: numberNeed,
                            },
                            lookUser,
                            unwindUser,
                            lookCity,
                            targetfilter,
                        ]);
                        await myFunctionGetNewMoneyStr(listSimulateNew4);
                    }
                }
                if (numberNeed > 0 && list_id.length > 0) {
                    listSimulateNew5 = await NewTV365.aggregate([{
                            $match: {
                                new_id: {
                                    $nin: list_id_cat_city,
                                    $nin: list_id_cat_not_city,
                                    $in: list_id,
                                    $ne: new_id,
                                },
                                new_vip_time: {
                                    $gte: timeNow,
                                },
                                $or: [
                                    { new_hot: 1 },
                                    { new_gap: 1 },
                                    { new_cao: 1 },
                                    { new_ghim: 1 },
                                    { new_nganh: 1 },
                                ],
                            },
                        },
                        sort,
                        {
                            $limit: numberNeed,
                        },
                        lookUser,
                        unwindUser,
                        lookCity,
                        targetfilter,
                    ]);
                    await myFunctionGetNewMoneyStr(listSimulateNew5);

                    const listId5 = listSimulateNew5.map((item) => item.new_id);
                    numberNeed -= listSimulateNew5.length;
                    if (numberNeed > 0) {
                        listSimulateNew6 = await NewTV365.aggregate([{
                                $match: {
                                    new_id: {
                                        $nin: listId5,
                                        $in: list_id,
                                        $ne: new_id,
                                    },
                                },
                            },
                            sort,
                            {
                                $limit: numberNeed,
                            },
                            lookUser,
                            unwindUser,
                            lookCity,
                            targetfilter,
                        ]);
                        await myFunctionGetNewMoneyStr(listSimulateNew6);
                    }
                }

                listSimulateNew = [
                    ...listSimulateNew1,
                    ...listSimulateNew2,
                    ...listSimulateNew3,
                    ...listSimulateNew4,
                    ...listSimulateNew5,
                    ...listSimulateNew6,
                ];
            }
            return functions.success(res, 'Get list suggestNew for user successfully', {
                listSimulateNew,
            });
        } else return functions.setError(res, 'Mission the new_id');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// danh sách Like tin tuyển dụng
exports.listLike = async(req, res) => {
    try {
        const new_id = Number(req.body.new_id);
        const new_id_parent = Number(req.body.new_id_parent);
        if (new_id) {
            Data = await service.inforLikeChild(new_id, new_id_parent ? new_id_parent : 0);
            return functions.success(res, 'Thành công', { Data });
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};