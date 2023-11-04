const fnc = require("../../services/functions");
const CV = require("../../models/Timviec365/CV/Cv365");
const NewTV365 = require("../../models/Timviec365/UserOnSite/Company/New");
const AdminUser = require("../../models/Timviec365/Admin/AdminUser");
const AdminModule = require("../../models/Timviec365/Admin/Modules");
const Linh_Vuc = require("../../models/Timviec365/UserOnSite/Company/CategoryCompany");
const KeyWord = require("../../models/Timviec365/UserOnSite/Company/Keywords");
const serviceCandi = require('../../services/timviec365/candidate');

const CategoryBlog = require("../../models/Timviec365/Blog/Category");
const Blog = require("../../models/Timviec365/Blog/Posts");
const CategoryJob = require("../../models/Timviec365/CategoryJob");
const Users = require("../../models/Users");
const PointCompany = require("../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany");
const PointUsed = require("../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed");
const NgangDon = require("../../models/Timviec365/CV/ApplicationCategory");
const LetterCategory = require("../../models/Timviec365/CV/LetterCategory");

const CVCate = require("../../models/Timviec365/CV/Category");
const CVLang = require("../../models/Timviec365/CV/CVLang");
const SaveCvCandi = require("../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi");
const Application = require("../../models/Timviec365/CV/Application");
const ApplicationUV = require("../../models/Timviec365/CV/ApplicationUV");
const Letter = require("../../models/Timviec365/CV/Letter");
const LetterUV = require("../../models/Timviec365/CV/LetterUV");
const Resume = require("../../models/Timviec365/CV/Resume");
const ResumeUV = require("../../models/Timviec365/CV/ResumeUV");
const CVDesign = require("../../models/Timviec365/CV/CVDesign");
const CVGroup = require("../../models/Timviec365/CV/CVGroup");
const PriceList = require("../../models/Timviec365/PriceList/PriceList");
const CVSection = require("../../models/Timviec365/CV/CVSection");
const TagBlog = require("../../models/Timviec365/Blog/TagBlog");
const NewAuthor = require("../../models/Timviec365/Blog/NewAuthor");
const BoDe = require("../../models/Timviec365/Blog/BoDe");
const BoDeNews = require("../../models/Timviec365/Blog/BoDeNews");
const BoDeTag = require("../../models/Timviec365/Blog/BoDeTag");
const CategoryDes = require("../../models/Timviec365/CategoryDes");
const TblModules = require("../../models/Timviec365/TblModules");
const CommentPost = require("../../models/Timviec365/UserOnSite/CommentPost");
const LikePost = require("../../models/Timviec365/UserOnSite/LikePost");
const Cv365Like = require("../../models/Timviec365/CV/Like");
const Cv365TblModules = require("../../models/Timviec365/CV/TblModules");
const Cv365TblFooter = require("../../models/Timviec365/CV/TblFooter");
const BieuMau = require("../../models/Timviec365/Blog/BieuMau");
const BieuMauNew = require("../../models/Timviec365/Blog/BieuMauNew");
const BieuMauTag = require("../../models/Timviec365/Blog/BieuMauTag");
const TrangVangCategory = require("../../models/Timviec365/UserOnSite/Company/TrangVangCategory");
const KeyWordSSL = require("../../models/Timviec365/KeyWordSSL");
const ApplyForJob = require("../../models/Timviec365/UserOnSite/Candicate/ApplyForJob");
const PermissionNotify = require("../../models/Timviec365/PermissionNotify");
const Profile = require("../../models/Timviec365/UserOnSite/Candicate/Profile");
const UserSavePost = require("../../models/Timviec365/UserOnSite/Candicate/UserSavePost");
const Notification = require("../../models/Timviec365/Notification");
const SaveVote = require("../../models/Timviec365/SaveVote");
const TblHistoryViewd = require("../../models/Timviec365/UserOnSite/Candicate/TblHistoryViewed");
const HistoryNewPoint = require("../../models/Timviec365/HistoryNewPoint");
const Evaluate = require("../../models/Timviec365/Evaluate");
const CompanyStorage = require("../../models/Timviec365/UserOnSite/Company/Storage");
const SaveCandidate = require("../../models/Timviec365/UserOnSite/Company/SaveCandidate");
const Mail365 = require("../../models/Timviec365/Mail365/Mail365");
const CompanyVip = require("../../models/Timviec365/UserOnSite/Company/CompanyVip");
const admin_menu_order = require("../../models/Timviec365/Admin/AdminMenuOrder");
const admin_translate = require("../../models/Timviec365/Admin/AdminTranslate");
const admin_user_language = require("../../models/Timviec365/Admin/AdminUserLanguage");
const admin_user_right = require("../../models/Timviec365/Admin/AdminUserRight");
const tags = require("../../models/Timviec365/TblTags");
const tbl_danhmuc_mail = require("../../models/Timviec365/Mail365/Mail365Category");
const cv365blog = require("../../models/Timviec365/CV/Blog");
const cv365customhtml = require("../../models/Timviec365/CV/CustomHtml");
const tblfooter = require("../../models/Timviec365/TblFooter");
const salaryLevel = require("../../models/Timviec365/SalaryLevel");
const mailntd = require("../../models/Timviec365/Mail365/Mail365NTD");
const savemember = require("../../models/Timviec365/Mail365/SaveMember");
const Cv365HistoryPoint = require("../../models/Timviec365/CV/HistoryPoint");
const TblBaoLuu = require("../../models/Timviec365/UserOnSite/Company/TblBaoLuu");
const ManagerPointHistory = require("../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");

const HistoryLogin = require("../../models/Timviec365/UserOnSite/ManageHistory/HistoryLogin")
const HistoryPointPromotion = require("../../models/Timviec365/UserOnSite/ManageHistory/HistoryPointPromotion")
const SaveAccountVip = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveAccountVip")
const SaveExchangePoint = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePoint")
const SaveExchangePointBuy = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointBuy")
const SaveExchangePointMoney = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointMoney")
const SaveExchangePointOrder = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointOrder")
const SaveNextPage = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveNextPage")
const SaveSeeNewByEm = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewByEm")
const SaveSeeNewRequest = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewRequest")
const SaveSeeRequest = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeRequest")
const SaveShareSocialNew = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialNew")
const SaveShareSocialUser = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialUser")
const Order = require("../../models/Timviec365/Order")
const OrderDetails = require("../../models/Timviec365/OrderDetails")
const UserCompanyUnset = require("../../models/Timviec365/UserOnSite/Company/UserCompanyUnset");
const UserUnset = require("../../models/Timviec365/UserOnSite/Candicate/UserUnset");
const MdtdCvUvVsNew = require("../../models/Timviec365/MDTD/MdtdCvUvVsNew");

// Kết nối API
const axios = require("axios");
const fs = require("fs");

// hàm thêm dữ liệu vào bảng newTV365
exports.toolNewTV365 = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            const getData = await axios.get(
                    "https://timviec365.vn/api_nodejs/get_list_new.php?page=" + page
                ),
                lists = getData.data;
            if (lists.length > 0) {
                for (let i = 0; i < lists.length; i++) {
                    let item = lists[i];
                    let cityArray = item.new_city.split(",").map(Number);
                    let catArray = item.new_cat_id.split(",").map(Number);
                    let districtArray = item.new_qh_id.split(",").map(Number);
                    // let lvArray = item.new_lv.split(",").map(Number);
                    const newTV = new NewTV365({
                        new_id: item.new_id,
                        new_user_id: item.new_user_id,
                        new_title: item.new_title,
                        new_md5: item.new_md5,
                        new_alias: item.new_alias,
                        new_301: item.new_301,
                        new_cat_id: catArray,
                        new_real_cate: item.new_real_cate,
                        new_city: cityArray,
                        new_qh_id: districtArray,
                        new_addr: item.new_addr,
                        new_cap_bac: item.new_cap_bac,
                        new_exp: item.new_exp,
                        new_gioi_tinh: item.new_gioi_tinh,
                        new_bang_cap: item.new_bang_cap,
                        new_hinh_thuc: item.new_hinh_thuc,
                        new_do_tuoi: item.new_do_tuoi,
                        new_money: item.new_money,
                        new_create_time: new Date(item.new_create_time * 1000),
                        new_update_time: new Date(item.new_update_time * 1000),
                        new_han_nop: new Date(item.new_han_nop * 1000),
                        new_cate_time: item.new_cate_time != 0 ?
                            new Date(item.new_cate_time * 1000) : null,
                        new_user_redirect: item.new_user_redirect,
                        new_view_count: item.new_view_count,
                        new_renew: item.new_renew,
                        new_do: item.new_do,
                        new_over: item.new_over,
                        new_thuc: item.new_thuc,
                        new_order: item.new_order,
                        new_ut: item.new_ut,
                        new_hot: item.new_hot,
                        new_cao: item.new_cao,
                        new_ghim: item.new_ghim,
                        new_gap: item.new_gap,
                        send_vip: item.send_vip,
                        new_hide_admin: item.new_hide_admin,
                        send_vip: item.send_vip,
                        new_point: item.new_point,
                    });
                    await newTV.save().then().catch(err => {
                        console.log(err);
                    });
                }
                page += 1;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Thêm dữ liệu từ bảng new multi
exports.toolNewMultiTV365 = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            const getData = await axios.get(
                    "https://timviec365.vn/api_nodejs/get_list_new_multi.php?page=" + page
                ),
                lists = getData.data;
            if (lists.length > 0) {
                for (let i = 0; i < lists.length; i++) {
                    let item = lists[i];
                    let lvArray = item.new_lv != "" ? item.new_lv.split(",").map(String) : [];

                    await NewTV365.updateOne({ new_id: item.new_id }, {
                            $set: {
                                new_mota: item.new_mota,
                                new_yeucau: item.new_yeucau,
                                new_quyenloi: item.new_quyenloi,
                                new_ho_so: item.new_ho_so,
                                new_title_seo: item.new_title_seo,
                                new_des_seo: item.new_des_seo,
                                new_hoahong: item.new_hoahong,
                                new_tgtv: item.new_tgtv,
                                new_lv: lvArray,
                                new_bao_luu: item.new_bao_luu,
                                time_bao_luu: item.time_bao_luu,
                                no_jobposting: item.no_jobposting,
                                new_video: item.new_video,
                                new_video_type: item.new_video_type,
                                new_video_active: item.new_video_active,
                                new_images: item.new_images,
                            },
                        })
                        .then(() => {})
                        .catch((err) => {});
                }
                page += 1;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Thêm dữ liệu từ bảng new money
exports.toolNewMoney = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            const getData = await axios.get(
                    "https://timviec365.vn/api_nodejs/get_list_new_money.php?page=" + page
                ),
                lists = getData.data;
            if (lists.length > 0) {
                for (let i = 0; i < lists.length; i++) {
                    let item = lists[i];

                    await NewTV365.updateOne({ new_id: item.nm_new_id }, {
                            $set: {
                                nm_id: item.nm_id,
                                nm_type: item.nm_type,
                                nm_min_value: item.nm_min_value,
                                nm_max_value: item.nm_max_value,
                                nm_unit: item.nm_unit,
                            },
                        })
                        .then(() => {})
                        .catch((err) => {
                            console.log(err);
                        });
                }
                page += 1;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào bảng Keyword
exports.toolKeyword = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/api/get_keyword.php?page=" + page
            );
            listKey = data;
            if (listKey.length > 0) {
                for (let i = 0; i < listKey.length; i++) {
                    const element = listKey[i];
                    const decodedStringNdgy = Buffer.from(
                        element.key_ndgy,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    const decodedStringTeaser = Buffer.from(
                        element.key_teaser,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi

                    const key = new KeyWord({
                        key_id: element.key_id,
                        key_name: element.key_name,
                        key_lq: element.key_lq,
                        key_cate_id: element.key_cate_id,
                        key_city_id: element.key_city_id,
                        key_qh_id: element.key_qh_id,
                        key_cb_id: element.key_cb_id,
                        key_teaser: decodedStringTeaser,
                        key_type: element.key_type,
                        key_err: element.key_err,
                        key_qh_kcn: element.key_qh_kcn,
                        key_cate_lq: element.key_cate_lq,
                        key_tit: element.key_tit,
                        key_desc: element.key_desc,
                        key_key: element.key_key,
                        key_h1: element.key_h1,
                        key_time: element.key_time,
                        key_301: element.key_301,
                        key_index: element.key_index,
                        key_bao_ham: element.key_bao_ham,
                        key_tdgy: element.key_tdgy,
                        key_ndgy: decodedStringNdgy,
                    });
                    await key.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào bảng AdminUser
exports.toolAddAdminUSer = async(req, res, next) => {
    try {
        let data = await fnc.getDataAxios(
            "https://timviec365.vn/api/get_user_admin.php?page=1"
        );

        for (let i = 0; i < data.length; i++) {
            const admin = new AdminUser({
                adm_id: data[i].adm_id,
                adm_loginname: data[i].adm_loginname,
                adm_password: data[i].adm_password,
                adm_name: data[i].adm_name,
                adm_email: data[i].adm_email,
                adm_author: data[i].adm_author,
                adm_address: data[i].adm_address,
                adm_phone: data[i].adm_phone,
                adm_mobile: data[i].adm_mobile,
                adm_access_module: data[i].adm_access_module,
                adm_access_category: data[i].adm_access_category,
                adm_date: data[i].adm_date,
                adm_isadmin: data[i].adm_isadmin,
                adm_active: data[i].adm_active,
                lang_id: data[i].lang_id,
                adm_delete: data[i].adm_delete,
                adm_all_category: data[i].adm_all_category,
                adm_edit_all: data[i].adm_edit_all,
                admin_id: data[i].admin_id,
                adm_bophan: data[i].adm_bophan,
                adm_ntd: data[i].adm_ntd,
                emp_id: data[i].emp_id,
                adm_nhaplieu: data[i].adm_nhaplieu,
                adm_rank: data[i].adm_rank
            });
            await admin.save();
        }

        return fnc.success(res, "thêm thành công", data);
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

//hàm thêm dữ liệu của lĩnh vực
exports.toolLV = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/api/get_trang_vang.php?page=" + page
            );
            if (data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    const decodedStringConten = Buffer.from(
                        data[i].tag_content,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    const decodedStringNdgy = Buffer.from(
                        data[i].tag_ndgy,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    let lv = new Linh_Vuc({
                        id: data[i].id,
                        name_tag: data[i].name_tag,
                        city_tag: data[i].city_tag,
                        cate_id: data[i].cate_id,
                        parent_id: data[i].parent_id,
                        level_id: data[i].level_id,
                        keyword_tag: data[i].keyword_tag,
                        tag_content: decodedStringConten,
                        link_301: data[i].link_301,
                        tag_vlgy: data[i].tag_vlgy,
                        tag_ndgy: decodedStringNdgy,
                        tag_index: data[i].tag_index,
                    });
                    await lv.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu category blog
exports.toolCategoryBlog = async(req, res, next) => {
    try {
        let data = await fnc.getDataAxios(
            "https://timviec365.vn/api_nodejs/get_list_category_blog.php"
        );
        if (data.length > 0) {
            data.forEach(async(element) => {
                const category = new CategoryBlog({
                    _id: element.cat_id,
                    name: element.cat_name,
                    adminID: element.admin_id,
                    langID: element.lang_id,
                    title: element.cat_title,
                    keyword: element.cat_keyword,
                    nameRewrite: element.cat_name_rewrite,
                    link: element.cat_link,
                    picture: element.cat_picture,
                    type: element.cat_type,
                    form: element.cat_form,
                    description: element.cat_description,
                    parentID: element.cat_parent_id,
                    hasChild: element.cat_has_child,
                    order: element.cat_order,
                    active: element.cat_active,
                    show: element.cat_show,
                    home: element.cat_home,
                });
                await category.save();
            });
        }
        await fnc.success(res, "thành công", { data });
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// // insert CV
exports.toolCV = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        do {
            const data = await fnc.getDataAxios(
                "https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=" + page, {}
            );
            if (data.length > 0) {
                await data.forEach(async(element) => {
                    await CV.deleteOne({ _id: element.id });
                    const cv = new CV({
                        _id: element.id,
                        name: element.name,
                        alias: element.alias,
                        url_alias: element.url_alias,
                        url_canonical: element.url_canonical,
                        image: element.image,
                        price: element.price,
                        colors: element.colors,
                        view: element.view,
                        love: element.love,
                        download: element.download,
                        vip: element.vip,
                        cv_index: element.cv_index,
                        cid: element.cid,
                        content: element.content,
                        mota_cv: element.mota_cv,
                        html_vi: JSON.stringify(element.html_vi),
                        html_en: JSON.stringify(element.html_en),
                        html_jp: JSON.stringify(element.html_jp),
                        html_cn: JSON.stringify(element.html_cn),
                        html_kr: JSON.stringify(element.html_kr),
                        cate_id: element.cate_id,
                        lang_id: element.lang_id,
                        design_id: element.design_id,
                        exp: element.exp,
                        nhucau: element.nhucau,
                        meta_title: element.meta_title,
                        meta_key: element.meta_key,
                        meta_des: element.meta_des,
                        thutu: element.thutu,
                        full: element.full,
                        status: element.status,
                        cv_point: element.cv_point,
                    });
                    await CV.create(cv);
                });
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        return await fnc.success(res, "Thành công");
    } catch (err) {
        fnc.setError(res, err.message);
    }
};

// hàm thêm dữ liệu vào bảng ngành nghề viecj làm
exports.toolCategoryJob = async(req, res, next) => {
    try {
        let data = await fnc.getDataAxios(
            "https://timviec365.vn/api_nodejs/get_list_category.php"
        );
        let listCategory = data;
        if (listCategory.length > 0) {
            for (let i = 0; i < listCategory.length; i++) {
                const category = new CategoryJob({
                    cat_id: listCategory[i].cat_id,
                    cat_name: listCategory[i].cat_name,
                    cat_title: listCategory[i].cat_title,
                    cat_tags: data[i].cat_tags,
                    cat_description: listCategory[i].cat_description,
                    cat_keyword: data[i].cat_keyword,
                    cat_lq: data[i].cat_lq,
                    cat_mota: listCategory[i].cat_mota,
                    cat_parent_id: listCategory[i].cat_parent_id,
                    cat_count: listCategory[i].cat_count,
                    cat_count_vl: listCategory[i].cat_count_vl,
                    cat_order: listCategory[i].cat_order,
                    cat_active: listCategory[i].cat_active,
                    cat_hot: listCategory[i].cat_hot,
                    cat_ut: listCategory[i].cat_ut,
                    cat_only: listCategory[i].cat_only,
                    cat_except: listCategory[i].cat_except,
                    cat_tlq: listCategory[i].cat_tlq,
                    cat_tlq_uv: listCategory[i].cat_tlq_uv,
                    cat_name_new: listCategory[i].cat_name_new,
                    cat_order_show: listCategory[i].cat_order_show,
                });
                await category.save();
            }
        }
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào bảng blog
exports.toolBlog = async(req, res, next) => {
    try {
        const element = req.body;
        await Blog.deleteOne({ new_id: element.new_id });

        const blog = new Blog({
            new_id: element.new_id,
            admin_id: element.admin_id,
            new_title: element.new_title,
            new_mail: element.new_mail,
            new_title_rewrite: element.new_title_rewrite,
            new_301: element.new_301,
            new_canonical: element.new_canonical,
            new_picture: element.new_picture,
            new_teaser: element.new_teaser,
            new_description: element.new_description,
            new_tt: element.new_tt,
            new_des: element.new_des,
            new_keyword: element.new_keyword,
            new_video: element.new_video,
            new_category_id: element.new_category_id,
            new_category_cb: element.new_category_cb,
            new_date: element.new_date,
            new_date_last_edit: element.new_date_last_edit,
            new_admin_edit: element.new_admin_edit,
            new_order: element.new_order,
            new_hits: element.new_hits,
            new_active: element.new_active,
            new_cate_url: element.new_cate_url,
            new_hot: element.new_hot,
            new_new: element.new_new,
            new_view: element.new_view,
            new_url_lq: element.new_url_lq,
            new_tag_cate: element.new_tag_cate,
            new_vl: element.new_vl,
            new_tdgy: element.new_tdgy,
            new_ndgy: element.new_ndgy,
            new_audio: element.new_audio,
        });
        await blog.save();
        return fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.toolCVCategory = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_dm_nganhcv.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, "base64").toString(
                        "utf-8"
                    );

                    const cvCate = new CVCate({
                        _id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        meta_h1: data[i].meta_h1,
                        content,
                        cid: data[i].cid,
                        meta_title: data[i].meta_title,
                        meta_key: data[i].meta_key,
                        meta_des: data[i].meta_des,
                        meta_tt: data[i].meta_tt,
                        status: data[i].status,
                    });
                    await CVCate.create(cvCate);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVLang = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_dm_nn_cv.php?page=${page}`, {}
            );
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, "base64").toString(
                        "utf-8"
                    );

                    const cvLang = new CVLang({
                        id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        meta_h1: data[i].meta_h1,
                        content,
                        meta_title: data[i].meta_title,
                        meta_key: data[i].meta_key,
                        meta_des: data[i].meta_des,
                        meta_tt: data[i].meta_tt,
                        status: data[i].status,
                    });
                    await CVLang.create(cvLang);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVLang = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_dm_nn_cv.php?page=${page}`, {}
            );
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, "base64").toString(
                        "utf-8"
                    );

                    const cvLang = new CVLang({
                        id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        meta_h1: data[i].meta_h1,
                        content,
                        meta_title: data[i].meta_title,
                        meta_key: data[i].meta_key,
                        meta_des: data[i].meta_des,
                        meta_tt: data[i].meta_tt,
                        status: data[i].status,
                    });
                    await CVLang.create(cvLang);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVUV = async(req, res, next) => {
    try {
        // await SaveCvCandi.deleteMany();
        return fnc.success(res, "Thành công");
        let page = 1;
        let result = true;
        do {
            // const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_cv_ungvien.php?page=${page}`, {});
            const getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_cv_ungvien.php?page=" + page);
            const data = getData.data;

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new SaveCvCandi({
                        id: element.id,
                        uid: element.uid,
                        cvid: element.cvid,
                        lang: element.lang,
                        html: JSON.stringify(element.html),
                        name_img: element.name_img,
                        time_edit: element.time_edit,
                        cv: element.cv,
                        status: element.status,
                        delete_cv: element.delete_cv,
                        delete_time: element.delete_time,
                        height_cv: element.height_cv,
                        scan: element.scan,
                        state: element.state,

                    });
                    await item.save().then().catch(error => {});
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
};

exports.toolApplication = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_donxinviec.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html_vi = JSON.stringify(data[i].html_vi);
                    const html_en = JSON.stringify(data[i].html_en);
                    const html_cn = JSON.stringify(data[i].html_cn);
                    const html_jp = JSON.stringify(data[i].html_jp);
                    const html_kr = JSON.stringify(data[i].html_kr);

                    const application = new Application({
                        _id: data[i].id,
                        name: data[i].name,
                        name_sub: data[i].name_sub,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: data[i].price,
                        view: data[i].view,
                        love: data[i].love,
                        download: data[i].download,
                        colors: data[i].colors,
                        cate_id: data[i].cate_id,
                        exp: data[i].exp,
                        nhucau: data[i].nhucau,
                        tid: data[i].tid,
                        status: data[i].status,
                        vip: data[i].vip,
                        html_vi,
                        html_en,
                        html_cn,
                        html_jp,
                        html_kr,
                    });
                    await Application.create(application);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolApplicationUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_don_ungvien.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = Buffer.from(data[i].html, "base64").toString("utf-8");

                    const applicationUV = new ApplicationUV({
                        id: data[i].id,
                        uid: data[i].uid,
                        tid: data[i].tid,
                        status: data[i].status,
                        lang: data[i].lang,
                        html,
                        name_img: data[i].name_img,
                    });
                    await ApplicationUV.create(applicationUV);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolResumeUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_hoso_ungvien.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);

                    const resumeUV = new ResumeUV({
                        id: data[i].id,
                        uid: data[i].uid,
                        tid: data[i].tid,
                        status: data[i].status,
                        lang: data[i].lang,
                        html,
                        name_img: data[i].name_img,
                    });
                    await ResumeUV.create(resumeUV);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolLetterUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_thu_ungvien.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);

                    const letterUV = new LetterUV({
                        id: data[i].id,
                        uid: data[i].uid,
                        tid: data[i].tid,
                        status: data[i].status,
                        lang: data[i].lang,
                        html,
                        name_img: data[i].name_img,
                    });
                    await LetterUV.create(letterUV);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolLetter = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_thu.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html_vi = JSON.stringify(data[i].html_vi);
                    const html_en = JSON.stringify(data[i].html_en);
                    const html_cn = JSON.stringify(data[i].html_cn);
                    const html_jp = JSON.stringify(data[i].html_jp);
                    const html_kr = JSON.stringify(data[i].html_kr);

                    const letter = new Letter({
                        _id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: data[i].price,
                        colors: data[i].colors,
                        view: data[i].view,
                        love: data[i].love,
                        download: data[i].download,
                        vip: data[i].vip,
                        cate_id: data[i].cate_id,
                        exp: data[i].exp,
                        nhucau: data[i].nhucau,
                        status: data[i].status,
                        html_vi,
                        html_en,
                        html_cn,
                        html_jp,
                        html_kr,
                    });
                    await Letter.create(letter);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolResume = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_hoso.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);

                    const resume = new Resume({
                        _id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: data[i].price,
                        view: data[i].view,
                        love: data[i].love,
                        download: data[i].download,
                        html,
                        colors: data[i].colors,
                        status: data[i].status,
                        cate_id: data[i].cate_id,
                        vip: data[i].vip
                    });
                    await Resume.create(resume);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVDesign = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_dm_thietkecv.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, "base64").toString(
                        "utf-8"
                    );

                    const cvDesign = new CVDesign({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        metaH1: data[i].meta_h1,
                        content,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        metaTt: data[i].meta_tt,
                        status: +data[i].status,
                    });
                    await CVDesign.create(cvDesign);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVGroup = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_danhmuc_cv.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const cvGroup = new CVGroup({
                        _id: +data[i].id,
                        name: data[i].name,
                        shortName: data[i].short_name,
                        alias: data[i].alias,
                        image: data[i].image,
                        sapo: data[i].sapo,
                        content: data[i].content,
                        menu: +data[i].menu,
                        sort: +data[i].sort,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        status: +data[i].status,
                    });
                    await CVGroup.create(cvGroup);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolPriceList = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/api/get_bang_gia.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const benefits = Buffer.from(data[i].bg_quyenloi, "base64").toString(
                        "utf-8"
                    );
                    let incentive1 = "";
                    let incentive2 = "";
                    let incentive3 = "";
                    if (data[i].bg_uudai1 != "") {
                        incentive1 = Buffer.from(data[i].bg_uudai1, "base64").toString(
                            "utf-8"
                        );
                    }
                    if (data[i].bg_uudai2 != "") {
                        incentive2 = Buffer.from(data[i].bg_uudai2, "base64").toString(
                            "utf-8"
                        );
                    }
                    if (data[i].bg_uudai3 != "") {
                        incentive3 = Buffer.from(data[i].bg_uudai3, "base64").toString(
                            "utf-8"
                        );
                    }

                    const priceList = new PriceList({
                        bg_id: data[i].bg_id,
                        bg_tuan: data[i].bg_tuan,
                        bg_gia: data[i].bg_gia,
                        bg_chiet_khau: data[i].bg_chiet_khau,
                        bg_thanh_tien: data[i].bg_thanh_tien,
                        bg_handung: data[i].bg_handung,
                        bg_the: data[i].bg_the,
                        bg_vat: data[i].bg_vat,
                        bg_quyenloi: benefits,
                        bg_uudai1: incentive1,
                        bg_uudai2: incentive2,
                        bg_uudai3: incentive3,
                        bg_cm1: data[i].bg_cm1,
                        bg_cm2: data[i].bg_cm2,
                        bg_cm3: data[i].bg_cm3,
                        bg_cm_logo: data[i].bg_cm_logo,
                        bg_show: data[i].bg_show,
                        bg_tk: data[i].bg_tk,
                        bg_do: data[i].bg_do,
                        bg_hp: data[i].bg_hp,
                        bg_type: data[i].bg_type,
                        bg_ql_hd: data[i].bg_ql_hd,
                        bg_ud_hd: data[i].bg_ud_hd,
                        api_crm: data[i].api_crm,
                    });
                    await PriceList.create(priceList);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVSection = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(
                `https://timviec365.vn/cv365/api_nodejs/get_tbl_chuyenmuc.php?page=${page}`, {}
            );

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, "base64").toString(
                        "utf-8"
                    );

                    const cvSection = new CVSection({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        content,
                        image: data[i].image,
                        parent: +data[i].parent,
                        menu: +data[i].menu,
                        sort: +data[i].sort,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        status: +data[i].status,
                    });
                    await CVSection.create(cvSection);
                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

// hàm thêm dữ liệu vào kho ảnh
exports.toolListImg = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/api/get_usc_images.php?page=" + page, {}
            );
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const image_list = data[i].list_img.split(",");
                    const videoList = data[i].list_video.split(",");
                    const resultImg = [];
                    const resultVideo = [];
                    let id_counter = 1;

                    for (let j = 0; j < image_list.length; j++) {
                        const image_name = image_list[i];

                        const image_object = {
                            id: id_counter,
                            name: image_name,
                            type: 1,
                            size: data[i].arr_img[j].size,
                        };

                        resultImg.push(image_object);
                        id_counter++;
                    }
                    for (let j = 0; j < videoList.length; j++) {
                        const videoName = videoList[i];

                        const videoObject = {
                            id: id_counter,
                            name: videoName,
                            type: 1,
                            size: data[i].arr_video[j].size,
                        };

                        resultVideo.push(videoObject);
                        id_counter++;
                    }

                    await Users.updateOne({ idTimViec365: data[i].usc_id, type: 1 }, {
                        $set: {
                            "inForCompany.comVideos": resultImg,
                            "inForCompany.comImages": resultVideo,
                        },
                    });
                }
                page += 1;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào điểm company
exports.toolPointUse = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/api/get_tbl_point_used.php?page=" + page
            );
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    await PointUsed.deleteOne({
                        usc_id: listKey[i].usc_id,
                        used_day: listKey[i].used_day
                    })
                    const key = new PointUsed({
                        usc_id: listKey[i].usc_id,
                        use_id: listKey[i].use_id,
                        point: listKey[i].point,
                        type: listKey[i].type,
                        type_err: listKey[i].type_err,
                        note_uv: listKey[i].note_uv,
                        used_day: listKey[i].used_day,
                        return_point: listKey[i].return_point,
                        admin_id: listKey[i].admin_id,
                        ip_user: listKey[i].ip_user,
                    });
                    await key.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào điểm company
exports.toolPoinCompany = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/api/get_tbl_point_company.php?page=" + page
            );
            listKey = data;
            if (listKey.length > 0) {
                for (let i = 0; i < listKey.length; i++) {
                    await PointCompany.deleteOne({ usc_id: listKey[i].usc_id });
                    const key = new PointCompany({
                        usc_id: listKey[i].usc_id,
                        point: listKey[i].point,
                        point_usc: listKey[i].point_usc,
                        point_bao_luu: listKey[i].point_bao_luu,
                        chu_thich_bao_luu: listKey[i].chu_thich_bao_luu,
                        day_reset_point: listKey[i].day_reset_point,
                        ngay_reset_diem_ve_0: listKey[i].ngay_reset_diem_ve_0,
                    });
                    await key.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào điểm company
exports.toolPoinCompany1 = async(req, res, next) => {
    try {
        console.log(req.body);
        await PointCompany.deleteOne({ usc_id: Number(req.body.usc_id) });
        let data = {
            usc_id: Number(req.body.usc_id),
            point: req.body.point,
            point_usc: req.body.point_usc,
            point_bao_luu: req.body.point_bao_luu,
            chu_thich_bao_luu: req.body.chu_thich_bao_luu,
            day_reset_point: req.body.day_reset_point,
            ngay_reset_diem_ve_0: req.body.ngay_reset_diem_ve_0,
        };
        const key = new PointCompany(data);
        await key.save();
        await fnc.success(res, "thành công");
    } catch (error) {
        // console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào ngành đơn
exports.toolNganhDon = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/cv365/api_nodejs/get_dm_nganhdon.php?page=" +
                page
            );
            listKey = data;
            if (listKey.length > 0) {
                for (let i = 0; i < listKey.length; i++) {
                    const decodedStringTeaser = Buffer.from(
                        listKey[i].content,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    const key = new NgangDon({
                        _id: listKey[i].id,
                        name: listKey[i].name,
                        alias: listKey[i].alias,
                        meta_h1: listKey[i].meta_h1,
                        content: decodedStringTeaser,
                        cid: listKey[i].cid,
                        meta_title: listKey[i].meta_title,
                        meta_key: listKey[i].meta_key,
                        meta_des: listKey[i].meta_des,
                        meta_tt: listKey[i].meta_tt,
                        status: listKey[i].status,
                    });
                    await key.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// hàm thêm dữ liệu vào ngành thư
exports.toolNganhThu = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios(
                "https://timviec365.vn/cv365/api_nodejs/get_dm_nganhthu.php?page=" +
                page
            );
            listKey = data;
            if (listKey.length > 0) {
                for (let i = 0; i < listKey.length; i++) {
                    const decodedStringTeaser = Buffer.from(
                        listKey[i].content,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    const key = new LetterCategory({
                        _id: listKey[i].id,
                        name: listKey[i].name,
                        alias: listKey[i].alias,
                        meta_h1: listKey[i].meta_h1,
                        content: decodedStringTeaser,
                        cid: listKey[i].cid,
                        meta_title: listKey[i].meta_title,
                        meta_key: listKey[i].meta_key,
                        meta_des: listKey[i].meta_des,
                        meta_tt: listKey[i].meta_tt,
                        status: listKey[i].status,
                    });
                    await key.save();
                }
                page++;
                console.log(page);
            } else result = false;
        } while (result);
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Quét dữ liệu blog
exports.toolTagBlog = async(req, res) => {
    try {
        let result = true,
            page = 1;

        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_tag_blog.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new TagBlog({
                        _id: element.tag_id,
                        tag_key: element.tag_key,
                        tag_url: element.tag_url,
                        tag_count: element.tag_count,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Quét dữ liệu của tác giả
exports.toolNewAuthor = async(req, res) => {
    try {
        let result = true,
            page = 1;

        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_new_author.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const decodedStringTeaser = Buffer.from(
                        element.author_content,
                        "base64"
                    ).toString("utf-8"); // Giải mã chuỗi
                    const item = new NewAuthor({
                        _id: element.id,
                        author_type: element.author_type,
                        adm_id: element.adm_id,
                        author_content: decodedStringTeaser,
                        author_img: element.author_img,
                        mxh_vk: element.mxh_vk,
                        mxh_trello: element.mxh_trello,
                        mxh_medium: element.mxh_medium,
                        mxh_behance: element.mxh_behance,
                        mxh_twitter: element.mxh_twitter,
                        mxh_instagram: element.mxh_instagram,
                        mxh_facebook: element.mxh_facebook,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Quét dữ liệu của câu hỏi tuyển dụng
exports.CateInterViewQuestion = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_bo_de.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BoDe({
                        _id: element.bd_id,
                        bd_cate: element.bd_cate,
                        bd_order: element.bd_order,
                        bd_footer_order: element.bd_footer_order,
                        bd_description: element.bd_description,
                        bd_keyword: element.bd_keyword,
                        bd_title: element.bd_title,
                        bd_mota: element.bd_mota,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Quét dữ liệu của bài viết câu hỏi tuyển dụng
exports.new_bo_de = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_bo_de_new.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BoDeNews({
                        _id: element.bdn_id,
                        bdn_name: element.bdn_name,
                        bdn_301: element.bdn_301,
                        bdn_title: element.bdn_title,
                        bdn_url: element.bdn_url,
                        bdn_cate_id: element.bdn_cate_id,
                        bdn_tag_id: element.bdn_tag_id,
                        bdn_avatar: element.bdn_avatar,
                        bdn_picture_web: element.bdn_picture_web,
                        bdn_picture_web2: element.bdn_picture_web2,
                        bdn_link_web: element.bdn_link_web,
                        bdn_teaser: element.bdn_teaser,
                        bdn_sapo: element.bdn_sapo,
                        bdn_description: element.bdn_description,
                        bdn_view: element.bdn_view,
                        bdn_time: element.bdn_time,
                        bdn_dg: element.bdn_dg,
                        bdn_cate_url: element.bdn_cate_url,
                        bdn_point_dg: element.bdn_point_dg,
                        bdn_admin_edit: element.bdn_admin_edit,
                        bdn_audio: element.bdn_audio,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

// Quét dữ liệu của bài viết câu hỏi tuyển dụng
exports.bieu_mau_tag = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_bo_de_tag.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BoDeTag({
                        _id: element.bmt_id,
                        bmt_name: element.bmt_name,
                        bmt_301: element.bmt_301,
                        bmt_title: element.bmt_title,
                        bmt_des: element.bmt_des,
                        bmt_key: element.bmt_key,
                        bmt_active: element.bmt_active,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.category_des = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_category_des.php?page=" +
                page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new CategoryDes({
                        _id: element.id,
                        cate_id: element.cate_id,
                        city_id: element.city_id,
                        cate_des: element.cate_des,
                        cate_h1: element.cate_h1,
                        cate_tt: element.cate_tt,
                        cate_tt1: element.cate_tt1,
                        cate_descri: element.cate_descri,
                        cate_tdgy: element.cate_tdgy,
                        cate_ndgy: element.cate_ndgy,
                        cate_key: element.cate_key,
                        cate_time: element.cate_time,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.tbl_modules = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_tbl_modules.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new TblModules({
                        _id: element.id,
                        title: element.title,
                        h1: element.h1,
                        sapo: element.sapo,
                        module: element.module,
                        meta_title: element.meta_title,
                        meta_des: element.meta_des,
                        meta_key: element.meta_key,
                        time_edit: element.time_edit,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.commentPost = async(req, res) => {
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.likePost = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get(
                "https://timviec365.vn/api_nodejs/get_list_like.php?page=" + page
            );
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new LikePost({
                        lk_id: element.lk_id,
                        lk_for_url: element.lk_for_url,
                        lk_new_id: element.new_id,
                        lk_type: element.lk_type,
                        lk_for_comment: element.lk_for_comment,
                        lk_user_idchat: element.lk_user_idchat,
                        lk_ip: element.lk_ip,
                        lk_time: element.lk_time,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Cv365Like = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_cv_like.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new Cv365Like({
                        uid: element.uid,
                        id: element.id,
                        status: element.status,
                        type: element.type
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Cv365TblModules = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_modules.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new Cv365TblModules({
                        _id: element.id,
                        title: element.title,
                        sapo: element.sapo,
                        module: element.module,
                        meta_title: element.meta_title,
                        meta_des: element.meta_des,
                        meta_key: element.meta_key,
                        list_bv: element.list_bv,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Cv365TblFooter = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_footer.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new Cv365TblFooter({
                        _id: element.id,
                        name: element.name,
                        content: element.content,
                        content_thu: element.content_thu,
                        content_don: element.content_don,
                        content_soyeu: element.content_soyeu,
                        content_cv365: element.content_cv365,
                        diachi: element.diachi,
                        email: element.email,
                        face: element.face,
                        google: element.google,
                        yoube: element.yoube,
                        logo: element.logo,
                        meta_title: element.meta_title,
                        meta_key: element.meta_key,
                        meta_des: element.meta_des,
                        meta_footer: element.meta_footer,
                        anatic: element.anatic,
                        map: element.map,
                        status: element.status,
                        meta_estimate: element.meta_estimate,
                        meta_descestimate: element.meta_descestimate,
                        meta_titleestimate: element.meta_titleestimate,
                        estimateh1: element.estimateh1,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.bieumau = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_bieu_mau.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BieuMau({
                        _id: element.bm_id,
                        bm_cate: element.bm_cate,
                        bm_order: element.bm_order,
                        bm_footer_order: element.bm_footer_order,
                        bm_description: element.bm_description,
                        bm_h1: element.bm_h1,
                        bm_keyword: element.bm_keyword,
                        bm_title: element.bm_title,
                        bm_mota: element.bm_mota
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.BieuMauNew = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_bieu_mau_new.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BieuMauNew({
                        _id: element.bmn_id,
                        bmn_name: element.bmn_name,
                        bmn_title: element.bmn_title,
                        bmn_url: element.bmn_url,
                        bmn_301: element.bmn_301,
                        bmn_cate_id: element.bmn_cate_id,
                        bmn_tag_id: element.bmn_tag_id,
                        bmn_avatar: element.bmn_avatar,
                        bmn_teaser: element.bmn_teaser,
                        bmn_description: element.bmn_description,
                        bmn_sapo: element.bmn_sapo,
                        bmn_ghim: element.bmn_ghim,
                        bmn_view: element.bmn_view,
                        bmn_time: new Date(element.bmn_time * 1000),
                        bmn_time_edit: new Date(element.bmn_time_edit * 1000),
                        bmn_file: element.bmn_file,
                        bmn_dg: element.bmn_dg,
                        bmn_cate_url: element.bmn_cate_url,
                        bmn_point_dg: element.bmn_point_dg,
                        bmn_admin_edit: element.bmn_admin_edit,
                        bmn_audio: element.bmn_audio,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.BieuMauTag = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_bieu_mau_tag.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new BieuMauTag({
                        _id: element.bmt_id,
                        bmt_name: element.bmt_name,
                        bmt_301: element.bmt_301,
                        bmt_title: element.bmt_title,
                        bmt_des: element.bmt_des,
                        bmt_key: element.bmt_key,
                        bmt_active: element.bmt_active
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.TrangVangCategory = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_trang_vang_category.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new TrangVangCategory({
                        id: element.id,
                        name_cate: element.name_cate,
                        parent_id: element.parent_id,
                        img_cate: element.img_cate
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.KeyWordSSL = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_ssl_key.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    // const decodekey_ssl_teaser = Buffer.from(element.key_ssl_teaser, "base64").toString(
                    //     "utf-8"
                    // );
                    // const decodekey_ndgy = Buffer.from(element.key_ndgy, "base64").toString(
                    //     "utf-8"
                    // );
                    const item = new KeyWordSSL({
                        key_ssl_id: element.key_ssl_id,
                        key_ssl_name: element.key_ssl_name,
                        key_ssl_teaser: element.key_ssl_teaser,
                        key_ssl_nn: element.key_ssl_nn,
                        key_ssl_tt: element.key_ssl_tt,
                        key_ssl_301: element.key_ssl_301,
                        key_ssl_index: element.key_ssl_index,
                        key_tdgy: element.key_tdgy,
                        key_ndgy: element.key_ndgy,
                        key_time: element.key_time,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.ApplyForJob = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_nop_ho_so.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    await ApplyForJob.deleteOne({ nhs_id: element.nhs_id });
                    const item = new ApplyForJob({
                        nhs_id: element.nhs_id,
                        nhs_use_id: element.nhs_use_id,
                        nhs_new_id: element.nhs_new_id,
                        nhs_com_id: element.nhs_com_id,
                        nhs_time: element.nhs_time,
                        nhs_active: element.nhs_active,
                        nhs_kq: element.nhs_kq,
                        nhs_time_pv: element.nhs_time_pv,
                        nhs_time_tvs: element.nhs_time_tvs,
                        nhs_time_tve: element.nhs_time_tve,
                        nhs_text: element.nhs_text,
                        nhs_cv: element.nhs_cv,
                        check_ut: element.check_ut,
                        nhs_utuyen_sai: element.nhs_utuyen_sai,
                        nhs_thuungtuyen: element.nhs_thuungtuyen,
                        nhs_xn_uts: element.nhs_xn_uts,
                        new_seen: element.new_seen,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.ApplyForJob1 = async(req, res) => {
    try {
        const element = req.body;
        await ApplyForJob.deleteOne({ nhs_id: element.nhs_id });
        const item = new ApplyForJob({
            nhs_id: element.nhs_id,
            nhs_use_id: element.nhs_use_id,
            nhs_new_id: element.nhs_new_id,
            nhs_com_id: element.nhs_com_id,
            nhs_time: element.nhs_time,
            nhs_active: element.nhs_active,
            nhs_kq: element.nhs_kq,
            nhs_time_pv: element.nhs_time_pv,
            nhs_time_tvs: element.nhs_time_tvs,
            nhs_time_tve: element.nhs_time_tve,
            nhs_text: element.nhs_text,
            nhs_cv: element.nhs_cv,
            check_ut: element.check_ut,
            nhs_utuyen_sai: element.nhs_utuyen_sai,
            nhs_thuungtuyen: element.nhs_thuungtuyen,
            nhs_xn_uts: element.nhs_xn_uts,
            new_seen: element.new_seen,
        });

        await item
            .save()
            .then()
            .catch((err) => {
                console.log(err);
            });
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.PermissionNotify = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_permission.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new PermissionNotify({
                        pn_id: element.pn_id,
                        pn_usc_id: element.pn_usc_id,
                        pn_use_id: element.pn_use_id,
                        pn_id_chat: element.pn_id_chat,
                        pn_id_new: element.pn_id_new,
                        pn_type: element.pn_type,
                        pn_type_noti: element.pn_type_noti,
                        setup_noti: element.setup_noti,
                        pn_created_at: element.pn_created_at
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Profile = async(req, res) => {
    try {
        const element = req.body;

        // await Profile.deleteOne({ hs_id: element.hs_id });
        // let findUser = await Users.findOne({ idTimViec365: Number(element.hs_use_id) }).lean();
        // if (findUser) {
        //     const item = new Profile({
        //         hs_id: element.hs_id,
        //         hs_use_id: element.hs_use_id,
        //         hs_name: element.hs_name,
        //         hs_link: element.hs_link,
        //         hs_cvid: element.hs_cvid,
        //         hs_create_time: element.hs_create_time,
        //         hs_active: element.hs_active,
        //         hs_link_hide: element.hs_link_hide,
        //         is_scan: element.is_scan,
        //         hs_link_error: element.hs_link_error,
        //         state: element.state,
        //         mdtd_state: element.mdtd_state,
        //         scan_cv: element.scan_cv,
        //     });

        //     await item
        //         .save()
        //         .then()
        //         .catch((err) => {
        //             console.log(err);
        //         });
        //     if (element.hs_link) {
        //         let dir = `${process.env.storage_tv365}/pictures/cv/${fnc.convertDate(findUser.createdAt,true)}`;
        //         if (!fs.existsSync(dir)) {
        //             fs.mkdirSync(dir, { recursive: true });
        //         }

        //         const outputPath = `${dir}/${element.hs_link}`;
        //         let link_file_hs = `https://timviec365.vn/pictures/cv/${fnc.convertDate(findUser.createdAt,true)}/${element.hs_link}`;
        //         if (!fs.existsSync(outputPath)) {
        //             fnc.downloadFile(link_file_hs, outputPath);
        //         }
        //     }
        //     return fnc.success(res, "thành công");
        // }
        return fnc.setError(res, "Không tồn tại user");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.UserSavePost = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api/get_luu_viec_lam.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new UserSavePost({
                        id: element.id,
                        use_id: element.use_id,
                        new_id: element.new_id,
                        save_time: element.save_time
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Notification = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_notification.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new Notification({
                        not_id: element.not_id,
                        usc_id: element.usc_id,
                        use_id: element.use_id,
                        new_id: element.new_id,
                        not_time: element.not_time,
                        not_active: element.not_active,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.SaveVote = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_tbl_save_vote.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new SaveVote({
                        id: element.id,
                        userId: element.userId,
                        user_type_vote: element.user_type_vote,
                        star: element.star,
                        id_be_vote: element.id_be_vote,
                        type: element.type,
                        creater_be_vote: element.creater_be_vote,
                        type_create: element.type_create,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.TblHistoryViewd = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tbl_history_viewed.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new TblHistoryViewd({
                        id: element.id,
                        id_uv: element.id_uv,
                        id_new: element.id_new,
                        time_view: element.time_view,
                        time_out: element.time_out
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.HistoryNewPoint = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_history_new_point.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    await HistoryNewPoint.deleteOne({ nh_id: element.nh_id });
                    const item = new HistoryNewPoint({
                        nh_id: element.nh_id,
                        nh_new_id: element.nh_new_id,
                        nh_point: element.nh_point,
                        nh_type_point: element.nh_type_point,
                        nh_created_at: element.nh_created_at
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Evaluate = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tbl_bao_xau.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new Evaluate({
                        id: element.id,
                        usc_id: element.usc_id,
                        use_id: element.use_id,
                        bx_uv: element.bx_uv,
                        bx_ntd: element.bx_ntd,
                        time_create: element.time_create,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.CompanyStorage = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_storage.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new CompanyStorage({
                        id_usc_img: element.id_usc_img,
                        usc_id: element.usc_id,
                        image: element.image,
                        video: element.video,
                        time_created: element.time_created,
                        time_update: element.time_update,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.checkRegistry = async(req, res) => {
    const Registry = require('winreg');

    const key = new Registry({
        hive: Registry.HKCR, // Chọn hive (ví dụ: HKCU, HKLM, HKCR)
        key: '\\chat365' // Đường dẫn khóa Registry
    });

    key.keyExists((err, exists) => {
        if (err) {
            console.error('Lỗi khi kiểm tra khóa Registry:', err.message);
            return fnc.success(res, "Lỗi khi kiểm tra khóa Registry:" + err.message);
        }

        if (exists) {
            console.log('Khóa Registry tồn tại');
            return fnc.success(res, "Khóa Registry tồn tại");
        } else {
            console.log('Khóa Registry không tồn tại');
            return fnc.setError(res, "Khóa Registry không tồn tại");
        }
    });
}

exports.SaveCandidate = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_tbl_save_uv.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    await SaveCandidate.deleteOne({ id: element.id });
                    const item = new SaveCandidate({
                        id: element.id,
                        usc_id: element.usc_id,
                        use_id: element.use_id,
                        save_time: element.save_time
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.Mail365 = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_mail365.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new Mail365({
                        id: element.id,
                        title: element.title,
                        alias: element.alias,
                        image: element.image,
                        colors: element.colors,
                        cid: element.cid,
                        html: JSON.stringify(element.html),
                        view: element.view,
                        love: element.love,
                        download: element.download,
                        status: element.status
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.admin_module = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_modules.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new AdminModule({
                        mod_id: element.mod_id,
                        mod_name: element.mod_name,
                        mod_path: element.mod_path,
                        mod_listname: element.mod_listname,
                        mod_listfile: element.mod_listfile,
                        mod_order: element.mod_order,
                        mod_help: element.mod_help,
                        lang_id: element.lang_id,
                        mod_checkloca: element.mod_checkloca
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.CompanyVip = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_company_vip.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new CompanyVip({
                        id: element.id,
                        name_com: element.name_com,
                        alias: element.alias,
                        banner: element.banner,
                        logo: element.logo,
                        images: element.images,
                        tieu_de: element.tieu_de,
                        content: element.content,
                        introduction: element.introduction,
                        map: element.map,
                        ct_301: element.ct_301,
                        address: element.introduction,
                        meta_title: element.meta_title,
                        meta_des: element.meta_des,
                        meta_key: element.meta_key,
                        meta_h1: element.meta_h1,
                        keyword: element.keyword,
                        new_tdgy: element.new_tdgy,
                        new_ndgy: element.new_ndgy,
                        admin_id: element.admin_id,
                        time_edit: element.time_edit,
                        status: element.status,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.admin_menu_order = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_admin_menu_order.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new admin_menu_order({
                        amo_admin: element.amo_admin,
                        amo_module: element.amo_module,
                        amo_order: element.amo_order
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.admin_translate = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/admin_translate.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new admin_translate({
                        tra_keyword: element.tra_keyword,
                        tra_text: element.tra_text,
                        lang_id: element.lang_id,
                        tra_source: element.tra_source
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.admin_user_language = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/admin_user_language.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new admin_user_language({
                        aul_admin_id: element.aul_admin_id,
                        aul_lang_id: element.aul_lang_id,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.admin_user_right = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/admin_user_right.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new admin_user_right({
                        adu_admin_id: element.adu_admin_id,
                        adu_admin_module_id: element.adu_admin_module_id,
                        adu_add: element.adu_add,
                        adu_edit: element.adu_edit,
                        adu_delete: element.adu_delete,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.tags = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tags.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new tags({
                        tag_id: element.tag_id,
                        tag_keyword: element.tag_keyword,
                        tag_link: element.tag_link,
                        tag_link_active: element.tag_link_active,
                        tag_chinh: element.tag_chinh,
                        tag_city: element.tag_city,
                        tag_chinh: element.tag_active,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};


exports.tbl_danhmuc_mail = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_dmmail365.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const item = new tbl_danhmuc_mail({
                        id: element.id,
                        name: element.name,
                        alias: element.alias,
                        parent: element.parent,
                        sort: element.sort,
                        meta_title: element.meta_title,
                        meta_key: element.meta_key,
                        meta_des: element.meta_des,
                        content: element.content,
                        status: element.status,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.cv365blog = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_baiviet.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new cv365blog({
                        id: element.id,
                        title: element.title,
                        alias: element.alias,
                        link_301: element.link_301,
                        link_canonical: element.link_canonical,
                        cid: element.cid,
                        cate_blog: element.cate_blog,
                        cate_cb: element.cate_cb,
                        image: element.image,
                        file: element.file,
                        created_day: element.created_day,
                        sapo: element.sapo,
                        content: Buffer.from(element.content, "base64").toString("utf-8"),
                        view: element.view,
                        vip: element.vip,
                        status: element.status,
                        uid: element.uid,
                        meta_title: element.meta_title,
                        meta_key: element.meta_key,
                        meta_des: element.meta_des,
                        tin_lq: element.tin_lq,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.cv365customhtml = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_tbl_customhtml.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new cv365customhtml({
                        id: element.id,
                        name: element.name,
                        html: Buffer.from(element.html, "base64").toString("utf-8"),
                        sort: element.sort,
                        status: element.status
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.tblfooter = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tbl_footer.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new tblfooter({
                        id: element.id,
                        name: element.name,
                        content: element.content,
                        content_thu: element.content_thu,
                        diachi: element.diachi,
                        email: element.email,
                        face: element.face,
                        google: element.google,
                        yoube: element.yoube,
                        logo: element.logo,
                        meta_title: element.meta_title,
                        meta_key: element.meta_key,
                        meta_des: element.meta_des,
                        meta_footer: element.meta_footer,
                        anatic: element.anatic,
                        map: element.map,
                        status: element.status,
                        meta_estimate: element.meta_estimate,
                        meta_descestimate: element.meta_descestimate,
                        meta_titleestimate: element.meta_titleestimate,
                        estimateh1: element.estimateh1,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.salarylevel = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/salarylevel.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new salaryLevel({
                        salarylevelid: element.salarylevelid,
                        Tile: element.Tile,
                        Order: element.Order,
                        CreateDate: element.CreateDate
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.mailntd = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tbl_mail_ntd.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new mailntd({
                        id: element.id,
                        usc_id: element.usc_id,
                        mid: element.mid,
                        html: element.html,
                        html_send: element.html_send,
                        status: element.status,
                        guid: element.guid,
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.savemember = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/api_nodejs/tbl_save_member.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new savemember({
                        usc_id: element.usc_id,
                        mid: element.mid,
                        names: element.names,
                        emails: element.emails
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.cv_history_point = async(req, res) => {
    try {
        let result = true,
            page = 1;
        do {
            let getData = await axios.get("https://timviec365.vn/cv365/api_nodejs/get_cv_history_point.php?page=" + page);
            const data = getData.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const item = new Cv365HistoryPoint({
                        chp_id: element.chp_id,
                        chp_cv_id: element.chp_cv_id,
                        chp_cate_id: element.chp_cate_id,
                        chp_point: element.chp_point,
                        chp_created_at: element.chp_created_at
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
        await fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
};

exports.tbl_cv_uv = async(req, res) => {
    try {
        const request = req.body;
        await SaveCvCandi.deleteOne({ id: request.id });
        let findUser = await Users.findOne({ idTimViec365: request.uid, type: { $ne: 1 } }).lean();
        if (findUser) {
            console.log('loading cv');
            const item = new SaveCvCandi({
                id: request.id,
                uid: request.uid,
                cvid: request.cvid,
                lang: request.lang,
                html: Buffer.from(request.html, "base64").toString("utf-8"), // Giải mã chuỗi
                name_img: request.name_img,
                time_edit: request.time_edit,
                cv: request.cv,
                status: request.status,
                delete_cv: request.delete_cv,
                height_cv: request.height_cv,
                scan: request.scan,
                state: request.state,
            });
            await item.save();
            return fnc.success(res, "thành công");
            // let link_img = `http://timviec365/cv365/upload/ungvien/uv_${request.uid}/${request.name_img}.png`,
            //     link_img_h = `http://timviec365/cv365/upload/ungvien/uv_${request.uid}/${request.name_img}_h.png`;

            // let dir = `${process.env.storage_tv365}/pictures/cv/${fnc.convertDate(findUser.createdAt,true)}`;
            // // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            // if (!fs.existsSync(dir)) {
            //     fs.mkdirSync(dir, { recursive: true });
            // }
            // const outputPath = `${dir}/${request.name_img}.png`;
            // const outputPathHide = `${dir}/${request.name_img}_h.png`;
            // await fnc.downloadFile(link_img, outputPath);
            // await fnc.downloadFile(link_img_h, outputPathHide);
            // console.log(outputPath);
            // console.log(outputPathHide);

            //Render ảnh cv, không sử dụng ảnh gửi lên
            // let cvid = request.cvid,
            //     userId = request.uid;
            // const storage = process.env.PORT_QLC;
            // const domain = "https://timviec365.vn";
            // let linkImg = `${domain}/cv365/site/xem_cv_nodejs_no_hide/${cvid}/${userId}`,
            //     linkImgHide = `${domain}/cv365/site/xem_cv_nodejs_hide/${cvid}/${userId}`;
            // let dir = `${process.env.storage_tv365}/pictures/cv/${fnc.convertDate(findUser.createdAt,true)}`;
            // if (!fs.existsSync(dir)) {
            //     fs.mkdirSync(dir, { recursive: true });
            // }

            // const outputPath = `${dir}/${request.name_img}.png`;
            // const outputPathHide = `${dir}/${request.name_img}_h.png`;
            // if (!fs.existsSync(outputPath)) {
            //     const resImage = await fnc.renderImageFromUrl(linkImg);
            //     const resImageHide = await fnc.renderImageFromUrl(linkImgHide);
            //     if (!resImage.result) {
            //         return fnc.setError(res, resImage.message, 500);
            //     }
            //     if (!resImageHide.result) {
            //         return fnc.setError(res, resImageHide.message, 500);
            //     }
            //     let base64String = resImage.file,
            //         base64StringHide = resImageHide.file;

            //     // Giải mã chuỗi Base64 thành dữ liệu nhị phân
            //     const imageBuffer = Buffer.from(base64String, "base64");
            //     const imageBufferHide = Buffer.from(base64StringHide, "base64");

            //     // Ghi dữ liệu nhị phân vào tệp ảnh

            //     await fs.writeFile(outputPath, imageBuffer, (error) => {
            //         if (error) {
            //             return functions.setError(res, "Lỗi khi ghi tệp ảnh");
            //         }
            //     });

            //     await fs.writeFile(outputPathHide, imageBufferHide, (error) => {
            //         if (error) {
            //             return functions.setError(res, "Lỗi khi ghi tệp ảnh");
            //         }
            //     });
            // }
            // const percents = await serviceCandi.percentHTHS(request.uid);
            // await Users.updateOne({ idTimViec365: request.uid, type: { $ne: 1 } }, {
            //     $set: {
            //         "inForPerson.candidate.percents": percents
            //     }
            // });
            // return fnc.success(res, "thành công");
        }
        return fnc.setError(res, "Failed");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, "Failed");
    }
}


exports.normalizeExchangePointHistory = async(req, res) => {
    try {
        let history = await ManagerPointHistory.find({});

        function num(value) {
            if (!value) return 0;
            return Number(value);
        }

        for (let i = 0; i < history.length; i++) {
            let doc = history[i];
            let fields = ["point_time_active", "point_see", "point_use_point", "point_share_social_new", "point_share_social_url", "point_share_social_user", "point_vote", "point_next_page", "point_see_em_apply", "point_vip", "point_TiaSet", "point_comment", "point_ntd_comment", "point_be_seen_by_em", "point_content_new"]
            let total = 0;
            fields.forEach(field => {
                total += num(doc[field]);
            })
            if (doc.point_to_change === 0) {
                doc.sum = total;
                doc.point_to_change = doc.sum;
            } else if (doc.point_to_change === doc.sum) {
                doc.sum = total;
                doc.point_to_change = total;
            }
            await doc.save();
        }

        return fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        await fnc.setError(res, "Failed");
    }
}

exports.normalizePriceList = async(req, res) => {
    try {
        let priceListings = await PriceList.find({ bg_type: { $in: ["1", "4", "5", "6"] } });
        let stringMap = new Map();
        for (let i = 0; i < 100; i++) {
            stringMap.set(`${i} tuần`, i * 7 * 24 * 60 * 60);
        }
        for (let i = 0; i < priceListings.length; i++) {
            let doc = priceListings[i];
            doc.bg_vip_duration = stringMap.get(doc.bg_handung);
            await doc.save();
            console.log(i);
        }
        return fnc.success(res, "thành công");
    } catch (error) {
        console.log(error);
        await fnc.setError(res, "Failed");
    }
}


exports.dailyScanExpiredVipNews = async(req, res) => {
    try {
        let now = fnc.getTimeNow();
        let allNews = await NewTV365.find({
            $or: [
                { new_vip_time: { $gt: 0, $lt: now } },
                { new_cate_time: { $gt: 0, $lt: now } },
            ]
        });
        let promises = [];
        for (let i = 0; i < allNews.length; i++) {
            let doc = allNews[i];
            if (doc.new_vip_time < now) {
                doc.new_hot = 0;
                doc.new_cao = 0;
                doc.new_gap = 0;
                doc.new_vip_time = 0;
            }
            if (doc.new_cate_time < now) {
                doc.new_nganh = 0;
                doc.new_cate_time = 0;
            }
            promises.push(doc.save());
        }
        await Promise.all(promises);
        return fnc.success(res, `Update thành công [${promises.length}] tin hết hạn!`);
    } catch (error) {
        console.log(error);
        await fnc.setError(res, "Failed");
    }
}

exports.tbl_bao_luu = async(req, res) => {
    try {
        const request = req.body;
        const item = new TblBaoLuu({
            id_ntd_bl: request.id_ntd_bl,
            goi_bl: request.goi_bl,
            so_luong_tin_bl: request.so_luong_tin_bl,
            time_su_dung_bl: request.time_su_dung_bl,
            so_tin_tang_bl: request.so_tin_tang_bl,
            point_bl: request.point_bl,
            han_bao_luu: request.han_bao_luu,
        });
        await item.save();
        return fnc.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return fnc.setError(res, "Failed");
    }
}

exports.manage_point_history = async(req, res) => {
    try {
        const request = req.body;

        const item = new ManagerPointHistory({
            id: request.id,
            userId: request.userId,
            type: request.type,
            point_time_active: request.point_time_active,
            point_see: request.point_see,
            point_use_point: request.point_use_point,
            point_share_social_new: request.point_share_social_new,
            point_share_social_url: request.point_share_social_url,
            point_share_social_user: request.point_share_social_user,
            point_vote: request.point_vote,
            point_next_page: request.point_next_page,
            point_see_em_apply: request.point_see_em_apply,
            point_vip: request.point_vip,
            point_TiaSet: request.point_TiaSet,
            point_comment: request.point_comment,
            point_ntd_comment: request.point_ntd_comment,
            point_be_seen_by_em: request.point_be_seen_by_em,
            point_content_new: request.point_content_new,
            percent_content_new: request.percent_content_new,
            point_to_change: request.point_to_change,
            sum: request.sum,
        });
        await item.save();
        return fnc.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return fnc.setError(res, "Failed");
    }
}


exports.toolHistoryLogin = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await HistoryLogin.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét")
    }
}

exports.toolSaveAccountVip = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveAccountVip.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveExchangePoint = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveExchangePoint.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveExchangePointBuy = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveExchangePointBuy.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveExchangePointOrder = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveExchangePointOrder.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveNextPage = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveNextPage.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveSeeNewByEm = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveSeeNewByEm.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolSaveSeeRequest = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveSeeRequest.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveShareSocialNew = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveShareSocialNew.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolSaveShareSocialUser = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveShareSocialUser.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolSaveVote = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await SaveVote.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolPointUsed = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await PointUsed.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolHistoryPointPromotion = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await HistoryPointPromotion.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolOrder = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await Order.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolOrderDetails = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await OrderDetails.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolPriceLists = async(req, res) => {
    try {
        let { list } = req.body;
        if (!list || !list.length) return fnc.success(res, "Không có data")
        await PriceList.insertMany(list)
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.toolUserCompanyUnset = async(req, res) => {
    try {
        let { _id, email, phone, nameCompany, city, district, address, errTime, regis } = req.body;
        if (!_id) return fnc.success(res, "Không có data");
        await UserCompanyUnset.deleteOne({ _id });
        let data = { _id, email, phone, nameCompany, city, district, address, errTime: Number(errTime), regis: Number(regis) }
        let user = new UserCompanyUnset(data);
        await user.save()
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}
exports.toolUserUnset = async(req, res) => {
    try {
        let { id, use_mail, use_phone_tk, use_email_lienhe, use_first_name, use_pass, use_phone, use_city, use_qh, use_addr, use_cv_tittle, use_cv_city, use_cv_cate, use_create_time, use_link, use_active, use_delete, type, emp_id, error, u_regis, list_notify } = req.body;
        if (!id) return fnc.success(res, "Không có data");
        await UserUnset.deleteOne({ id });
        let data = { id, use_mail, use_phone_tk, use_email_lienhe, use_first_name, use_pass, use_phone, use_city, use_qh, use_addr, use_cv_tittle, use_cv_city, use_cv_cate, use_create_time, use_link, use_active, use_delete, type, emp_id, error, u_regis, list_notify }
        let user = new UserUnset(data);
        await user.save()
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, "Lỗi quét", 500)
    }
}

exports.MdtdCvUvVsNew = async(req, res) => {
    try {
        const request = req.body;
        await MdtdCvUvVsNew.deleteOne({ id: request.id });
        const item = new MdtdCvUvVsNew({
            id: request.id,
            idUser: request.idUser,
            idNew: request.idNew,
            point: request.point,
            time: request.time,
        });
        await item.save();
        return fnc.success(res, "Thành công")
    } catch (error) {
        console.log(error);
        return fnc.success(res, error.message)
    }
}