const Users = require('../../models/Users');
const blog = require('../../models/Timviec365/Blog/Posts');
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi'); // Cv đã lưu
const SaveAppli = require('../../models/Timviec365/CV/ApplicationUV'); // Đơn đã lưu
const HoSoUV = require('../../models/Timviec365/CV/ResumeUV'); // Sơ yếu lý lịch đã lưu
const LetterUV = require('../../models/Timviec365/CV/LetterUV'); // Thư xin việc đã lưu
const applyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const pointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const SaveCandidate = require('../../models/Timviec365/UserOnSite/Company/SaveCandidate');
const Category = require('../../models/Timviec365/CategoryJob');
const ImagesUser = require('../../models/Timviec365/UserOnSite/Candicate/ImagesUser');
const Tv365PointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');

const functions = require('../../services/functions');
const service = require('../../services/timviec365/candidate');


const functions = require('../../services/functions');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const Users = require('../../models/Users');
const ApplyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const UserSavePost = require('../../models/Timviec365/UserOnSite/Candicate/UserSavePost');
const Keyword = require('../../models/Timviec365/UserOnSite/Company/Keywords');
const Blog = require('../../models/Timviec365/Blog/Posts');
const Category = require('../../models/Timviec365/CategoryJob');
const SaveVote = require('../../models/Timviec365/SaveVote');
const TblHistoryViewed = require('../../models/Timviec365/UserOnSite/Candicate/TblHistoryViewed');
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const City = require('../../models/City');
const District = require('../../models/District');
// Service
const service = require('../../services/timviec365/new');
const serviceCompany = require('../../services/timviec365/company');

//hiển thị thông tin chi tiết ứng viên theo 3 cách đăng kí
const infoCandidate = async(userId, idTimViec365) => {
    try {
        if (req.body.iduser) {
            const app = 0;
            const useraggre = await Users.aggregate([{
                    $match: {
                        idTimViec365: userId,
                        type: { $ne: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        use_id: '$idTimViec365',
                        use_email: '$email',
                        use_phone_tk: '$phoneTK',
                        use_phone: '$phone',
                        use_first_name: '$userName',
                        use_update_time: '$updatedAt',
                        use_create_time: '$createdAt',
                        use_logo: '$avatarUser',
                        use_email_lienhe: '$emailContact',
                        use_gioi_tinh: '$inForPerson.account.gender',
                        use_birth_day: '$inForPerson.account.birthday',
                        use_city: '$city',
                        use_quanhuyen: '$district',
                        use_address: '$address',
                        use_hon_nhan: '$inForPerson.account.married',
                        use_view: '$inForPerson.candidate.use_view',
                        use_authentic: '$authentic',
                        cv_user_id: '$idTimViec365',
                        cv_title: '$inForPerson.candidate.cv_title',
                        cv_exp: '$inForPerson.account.experience',
                        cv_muctieu: '$inForPerson.candidate.cv_muctieu',
                        cv_giai_thuong: '$inForPerson.candidate.cv_giai_thuong',
                        cv_hoat_dong: '$inForPerson.candidate.cv_hoat_dong',
                        cv_so_thich: '$inForPerson.candidate.cv_so_thich',
                        cv_cate_id: '$inForPerson.candidate.cv_cate_id',
                        cv_city_id: '$inForPerson.candidate.cv_city_id',
                        cv_district_id: '$inForPerson.candidate.cv_district_id',
                        cv_address: '$inForPerson.candidate.cv_address',
                        cv_capbac_id: '$inForPerson.candidate.cv_capbac_id',
                        cv_money_id: '$inForPerson.candidate.cv_money_id',
                        cv_loaihinh_id: '$inForPerson.candidate.cv_loaihinh_id',
                        cv_kynang: '$inForPerson.candidate.cv_kynang',
                        cv_tc_name: '$inForPerson.candidate.cv_tc_name',
                        cv_tc_cv: '$inForPerson.candidate.cv_tc_cv',
                        cv_tc_phone: '$inForPerson.candidate.cv_tc_phone',
                        cv_tc_email: '$inForPerson.candidate.cv_tc_email',
                        cv_tc_company: '$inForPerson.candidate.cv_tc_company',
                        cv_video: '$inForPerson.candidate.cv_video',
                        cv_video_type: '$inForPerson.candidate.cv_video_type',
                        cv_hocvan: '$inForPerson.account.education',
                        um_type: '$inForPerson.candidate.um_type',
                        um_min_value: '$inForPerson.candidate.um_min_value',
                        um_max_value: '$inForPerson.candidate.um_max_value',
                        um_unit: '$inForPerson.candidate.um_unit',
                        muc_luong: '$inForPerson.candidate.muc_luong',
                        profileDegree: '$inForPerson.candidate.profileDegree',
                        profileNgoaiNgu: '$inForPerson.candidate.profileNgoaiNgu',
                        profileExperience: '$inForPerson.candidate.profileExperience',
                        user_xac_thuc: '$otp',
                        use_show: '$inForPerson.candidate.use_show',
                        chat365_id: '$_id',
                        candidate: '$inForPerson.candidate',
                        id_qlc: '$idQLC',
                        percents: '$percents',
                        use_badge: '$inForPerson.candidate.use_badge',
                        anhsao_badge: '$inForPerson.candidate.anhsao_badge',
                        cv_district_id: '$inForPerson.candidate.cv_district_id',
                        cv_address: '$inForPerson.candidate.cv_address',
                    },
                },
            ]);

            if (useraggre.length > 0) {
                let userInfo = useraggre[0],
                    // Thông tin bằng cấp
                    bang_cap = userInfo.profileDegree ?
                    userInfo.profileDegree : [],
                    // Thông tin ngoại ngữ
                    ngoai_ngu = userInfo.profileNgoaiNgu ?
                    userInfo.profileNgoaiNgu : [],
                    // Thông tin kinh nghiệm
                    kinh_nghiem = userInfo.profileExperience ?
                    userInfo.profileExperience : [];
                // cập nhật use_view 
                userInfo["use_view"] = await Tv365PointUsed.countDocuments({ use_id: userId })
                    // Cập nhật đường dẫn ảnh đại diện
                userInfo.use_logo = functions.getImageUv(
                    userInfo.use_create_time,
                    userInfo.use_logo
                );

                if (userInfo.cv_city_id) {
                    userInfo.cv_city_id = userInfo.cv_city_id.toString();
                }
                const cv_cate_id = userInfo.cv_cate_id;
                if (userInfo.cv_cate_id) {
                    userInfo.cv_cate_id = userInfo.cv_cate_id.toString();
                }

                const getCvInfor = await SaveCvCandi.findOne({
                    uid: userInfo.use_id,
                    cv: 1,
                }).sort({ _id: -1 });

                userInfo.name_img = getCvInfor ?
                    functions.imageCv(
                        userInfo.use_create_time,
                        getCvInfor.name_img
                    ) :
                    '';
                userInfo.name_img_hide = getCvInfor ?
                    functions.imageCv(
                        userInfo.use_create_time,
                        getCvInfor.name_img_hide ?
                        getCvInfor.name_img_hide :
                        getCvInfor.name_img + '_h'
                    ) :
                    '';

                // Kiểm tra xem công việc mong muốn trên cv có đang giống công việc mong muốn khi nhập vào không
                if (getCvInfor) {
                    //console.log("getCvInfor", getCvInfor.html);
                    const html_cv = JSON.parse(JSON.stringify(getCvInfor.html));
                    if (html_cv.position) {
                        const position_in_cv = html_cv.position.trim();
                        const cv_title_candidate = userInfo.cv_title.trim();
                        if (position_in_cv.toLowerCase() != cv_title_candidate.toLowerCase()) {
                            userInfo.cv_title = position_in_cv;
                            await Users.updateOne({ _id: userInfo.chat365_id }, {
                                $set: {
                                    "inForPerson.candidate.cv_title": position_in_cv
                                }
                            });
                        }
                    }
                }


                // Cập nhật đường dẫn video
                if (userInfo.cv_video && userInfo.cv_video_type == 1) {
                    userInfo.cv_video = service.getUrlVideo(
                        userInfo.use_create_time,
                        userInfo.cv_video
                    );
                }

                const getFileUpLoad = await Profile.findOne({
                    hs_link: { $ne: '' },
                    hs_use_id: userInfo.use_id,
                }).sort({ hs_active: -1, hs_id: -1 });

                let fileUpLoad = '';
                if (getFileUpLoad) {
                    fileUpLoad = {
                        hs_link: getFileUpLoad.hs_link,
                        hs_link_hide: getFileUpLoad.hs_link_hide ? (!getFileUpLoad.hs_link_hide.includes('storage.timviec365') ? `https://anh.timviec365.vn/${getFileUpLoad.hs_link_hide}` : getFileUpLoad.hs_link_hide) : "",
                        hs_link_full: service.getUrlProfile(
                            getFileUpLoad.hs_create_time,
                            getFileUpLoad.hs_link
                        ),
                    };
                }
                userInfo.fileUpLoad = fileUpLoad;

                let don_xin_viec, thu_xin_viec, syll;
                let list_cv = [];

                let checkStatus,
                    statusSaveCandi = false;
                let list_apply = [];
                if ((req.user && req.user.data.type == 1) || req.body.com_id) {
                    let companyId = req.user ?
                        req.user.data.idTimViec365 :
                        req.body.com_id;
                    let checkApplyForJob = await functions.getDatafindOne(
                        applyForJob, {
                            nhs_use_id: userId,
                            nhs_com_id: companyId,
                            nhs_kq: { $nin: [10, 11, 12, 14] },
                        }
                    );
                    let checkPoint = await functions.getDatafindOne(pointUsed, {
                        usc_id: companyId,
                        use_id: userId,
                        return_point: 0,
                    });

                    // Nếu ứng viên đó được sử dụng điểm để chat
                    userInfo.type_chat = (checkPoint && (checkPoint.type_chat != null || checkPoint.point > 1)) ? true : false;

                    const checkSaveCandi = await functions.getDatafindOne(
                        SaveCandidate, { usc_id: companyId, use_id: userId }
                    );

                    if (checkSaveCandi) {
                        statusSaveCandi = true;
                    }

                    if (app || checkApplyForJob ||
                        (checkPoint &&
                            // luồng cũ: NTD mất 1 điểm để xem thông tin ứng viên     
                            ((checkPoint.point == 1 && checkPoint.type_chat == null) ||
                                // Luồng mới: NTD mất từ 2 điểm trở lên mới có thể xem thông tin ứng viên     
                                (checkPoint.type_chat == 2) || idTimViec365 == userInfo.use_id) ||
                            idTimViec365 == userInfo.use_id)) {
                        checkStatus = true;
                        don_xin_viec = await SaveAppli.findOne({ uid: userId }, { name_img: 1 })
                            .sort({ id: -1 })
                            .limit(1)
                            .lean();
                        thu_xin_viec = await LetterUV.findOne({ uid: userId }, { name_img: 1 })
                            .sort({ id: -1 })
                            .limit(1)
                            .lean();
                        syll = await HoSoUV.findOne({ uid: userId }, { name_img: 1 })
                            .sort({ id: -1 })
                            .limit(1)
                            .lean();
                        list_cv = await SaveCvCandi.find({
                                uid: userId,
                                delete_cv: 0,
                            })
                            .select('cvid uid name_img name_img_hide')
                            .sort({ cv: -1, time_edit: -1 })
                            .limit(3)
                            .lean();
                    } else {
                        userInfo.use_phone_tk = 'Click để xem liên hệ';
                        userInfo.use_phone = 'Click để xem liên hệ';
                        userInfo.use_email = 'Click để xem liên hệ';
                        userInfo.use_email_lienhe = 'Click để xem liên hệ';
                        checkStatus = false;
                        list_cv = await SaveCvCandi.find({
                                uid: userId,
                                delete_cv: 0,
                                cv: 1,
                            })
                            .select('name_img name_img_hide')
                            .sort({ cv: -1, time_edit: -1 })
                            .lean();
                    }
                } else if (req.user && req.user.data.idTimViec365 == userId) {
                    checkStatus = true;
                    if (!userInfo.candidate) {
                        await service.updateCandidate(userInfo.chat365_id);
                    }
                } else {
                    userInfo.use_phone_tk = 'đăng nhập để xem sdt đăng kí';
                    userInfo.use_phone = 'đăng nhập để xem sdt';
                    userInfo.use_email = 'đăng nhập để xem email';
                    userInfo.use_email_lienhe =
                        'đăng nhập để xem email liên hệ';
                    checkStatus = false;
                }

                // Xử lý link cv
                if (list_cv.length > 0) {
                    for (key in list_cv) {
                        list_cv[key].name_img_hide = functions.imageCv(
                            userInfo.use_create_time,
                            list_cv[key].name_img_hide ?
                            list_cv[key].name_img_hide :
                            list_cv[key].name_img + '_h'
                        );
                        list_cv[key].name_img = functions.imageCv(
                            userInfo.use_create_time,
                            list_cv[key].name_img
                        );
                    }
                }

                // Blog
                let listBlog = [];
                if (cv_cate_id && cv_cate_id.length > 0 && cv_cate_id != 0) {
                    const qr_tlq = await Category.findOne({
                            cat_id: cv_cate_id[0],
                        })
                        .select('cat_tlq_uv')
                        .lean();
                    if (qr_tlq && qr_tlq.cat_tlq_uv) {
                        const cat_tlq_uv = qr_tlq.cat_tlq_uv
                            .split(',')
                            .map(Number);
                        listBlog = await blog
                            .find({ new_id: { $in: cat_tlq_uv } }, {
                                new_id: 1,
                                new_title: 1,
                                new_title_rewrite: 1,
                                new_picture: 1,
                            })
                            .lean();
                        for (let b = 0; b < listBlog.length; b++) {
                            const element = listBlog[b];
                            element.new_picture = functions.getPictureBlogTv365(
                                element.new_picture
                            );
                        }
                    }
                }

                let imagesCandi = await ImagesUser.find({
                    img_user_id: userId,
                }).lean();
                imagesCandi.forEach((value, i) => {
                    imagesCandi[i].link = functions.imageUV(
                        userInfo.use_create_time,
                        value.img
                    );
                });

                return true
            }
            return false
        }
        return false
    } catch (e) {
        console.log(e);
        return false
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

                return true
            }
            return false
        }
        return false
    } catch (error) {
        console.log(error);
        return false
    }
};



infoCandidate(1206782, 0);