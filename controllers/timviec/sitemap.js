const BieuMauNew = require('../../models/Timviec365/Blog/BieuMauNew');
const Blog = require("../../models/Timviec365/Blog/Posts");
const BoDeNew = require("../../models/Timviec365/Blog/BoDeNews");
const CategoryDes = require("../../models/Timviec365/CategoryDes");
const Keyword = require("../../models/Timviec365/UserOnSite/Company/Keywords");
const CategoryCompany = require("../../models/Timviec365/UserOnSite/Company/CategoryCompany");
const Users = require("../../models/Users");
const NewCompany = require("../../models/Timviec365/UserOnSite/Company/New");
const CategoryCV = require("../../models/Timviec365/CV/Category");
const Cv365LangCv = require("../../models/Timviec365/CV/CVLang");
const CategoryApplication = require("../../models/Timviec365/CV/ApplicationCategory");
const LetterCategory = require("../../models/Timviec365/CV/LetterCategory");
const Cv365 = require("../../models/Timviec365/CV/Cv365");
const Cv365Blog = require("../../models/Timviec365/CV/Blog");
const New365 = require("../../models/Timviec365/UserOnSite/Company/New");
const SslBlog = require("../../models/Timviec365/Blog/SslBlog");
const TblModules = require("../../models/Timviec365/TblModules");
const CategoryBlog = require("../../models/Timviec365/Blog/Category");
const NewAuthor = require("../../models/Timviec365/Blog/NewAuthor");
const KeywordSsl = require("../../models/Timviec365/KeyWordSSL");

const functions = require("../../services/functions");

// Sitemap biểu mẫu
exports.bieu_mau = async(req, res, next) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 250;
        const skip = (page - 1) * pageSize;

        const list = await BieuMauNew.find({ _id: { $nin: [241, 239, 17, 225, 83, 23, 31, 33, 14] } })
            .select("bmn_name bmn_id bmn_url bmn_time bmn_description")
            .skip(skip)
            .limit(pageSize)
            .lean();

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.bmn_id = element._id;
        }

        return functions.success(res, "Thành công", { list });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// Sitemap blog
exports.blog = async(req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 250;
        const skip = (page - 1) * pageSize;

        const list = await Blog.find({
                new_id: { $nin: [1731, 1751, 2248, 2327, 1973, 2622, 2164, 1795, 157, 3071, 2514, 1780, 1953, 1976, 1994, 2050, 2231, 2246, 2290, 1762] },
                new_301: '',
                new_active: 1,
            })
            .select("new_id new_title new_title_rewrite new_description new_date new_date_last_edit new_new")
            .sort({ new_new: 1, new_id: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        return functions.success(res, "Thành công", { list });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

exports.cau_hoi_phong_van = async(req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 250;
        const skip = (page - 1) * pageSize;

        const list = await BoDeNew.find({ _id: { $ne: 0 } })
            .select("bdn_name bdn_url bdn_time bdn_description")
            .skip(skip)
            .limit(pageSize)
            .lean();

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.bdn_id = element._id;
        }
        return functions.success(res, "Thành công", { list });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

exports.categories_sitemap_job = async(req, res) => {
    try {
        const list = await CategoryDes.find({
            cate_id: { $ne: 0 },
            city_id: 0,
        }, { cate_time: 1, cate_id: 1 });
        return functions.success(res, 'Thành công', { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.city_sitemap_job = async(req, res) => {
    try {
        const list = await CategoryDes.find({
            cate_id: 0,
            city_id: { $ne: 0 },
        }, {
            cate_time: 1,
            city_id: 1
        });

        return functions.success(res, 'Thành công', { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.city_cate_sitemap_job = async(req, res) => {
    try {
        const list = await CategoryDes.find({
            cate_id: { $ne: 0 },
            city_id: { $ne: 0 },
        }, { cate_time: 1, cate_id: 1, city_id: 1 });

        return functions.success(res, 'Thành công', { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.keyword = async(req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 250;
        const skip = (page - 1) * pageSize;

        const list = await Keyword.aggregate([
            { $match: { key_301: "" } },
            {
                $project: {
                    "key_id": 1,
                    "key_name": 1,
                    "key_lq": 1,
                    "key_cate_id": 1,
                    "key_city_id": 1,
                    "key_qh_id": 1,
                    "key_cb_id": 1,
                    "key_type": 1,
                    "key_err": 1,
                    "key_qh_kcn": 1,
                    "key_cate_lq": 1,
                    "key_tit": 1,
                    "key_desc": 1,
                    "key_key": 1,
                    "key_h1": 1,
                    "key_time": 1,
                    "key_301": 1,
                    "key_index": 1,
                    "key_bao_ham": 1,
                }
            }
        ]);
        return functions.success(res, 'Thành công', { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.category_company = async(req, res) => {
    try {
        const list = await CategoryCompany.aggregate([
            { $match: { tag_index: 1 } },
            {
                $project: {
                    "id": 1,
                    "name_tag": 1,
                    "city_tag": 1,
                    "cate_id": 1,
                    "parent_id": 1,
                    "level_id": 1,
                    "keyword_tag": 1,
                    "tag_index": 1
                }
            }
        ]);

        return functions.success(res, 'Thành công', { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.company = async(req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = Number(req.body.pageSize) || 49000;
        const skip = (page - 1) * pageSize;

        const list = await Users.aggregate([{
                $match: {
                    idTimViec365: { $ne: 0 },
                    type: 1,
                    fromWeb: "timviec365",
                    "inForCompany.timviec365.usc_redirect": "",
                }
            },
            { $skip: skip },
            { $limit: pageSize },
            {
                $project: {
                    usc_id: "$idTimViec365",
                    usc_update_time: "$updatedAt",
                    usc_company: "$userName",
                    usc_alias: "$alias",
                }
            }
        ]);
        let result = [];

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const checkNew = await NewCompany.countDocuments({
                new_active: 1,
                new_301: "",
                new_md5: { $ne: 1 },
                new_user_id: Number(element.usc_id)
            });
            if (checkNew > 0) {
                result.push(element);
            }
        }
        return functions.success(res, "thành công", { list: result });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.dm_nganhcv = async(req, res) => {
    try {
        const list = await CategoryCV.find({ status: 1 }, { _id: 1, alias: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.dm_nn_cv = async(req, res) => {
    try {
        const list = await Cv365LangCv.find({ status: 1 }, { id: 1, alias: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.dm_nganhdon = async(req, res) => {
    try {
        const list = await CategoryApplication.find({ status: 1 }, { _id: 1, alias: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.dm_nganhthu = async(req, res) => {
    try {
        const list = await LetterCategory.find({ status: 1 }, { _id: 1, alias: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.tbl_cv = async(req, res) => {
    try {
        const list = await Cv365.find({ cv_index: 1 }, { _id: 1, alias: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.tbl_baiviet_cv = async(req, res) => {
    try {
        const list = await Cv365Blog.find({ status: 1, link_301: '' }, { id: 1, alias: 1, created_day: 1, content: 1, link_301: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.job = async(req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 49000;
        const skip = (page - 1) * pageSize;
        const list = await New365.find({ new_301: '', new_active: 1 }, { new_id: 1, new_title: 1, new_alias: 1, new_update_time: 1 }).skip(skip).limit(pageSize);
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.ssl = async(req, res) => {
    try {
        const list = await SslBlog.find();
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.tbl_module = async(req, res) => {
    try {
        const list = await TblModules.find({ _id: { $in: [1, 11, 19] } }, { _id: 1, time_edit: 1 });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.categories_multi = async(req, res) => {
    try {
        const list = await CategoryBlog.aggregate([{
                $match: { parentID: 0 }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    cat_id: "$_id",
                    cat_link: "$link",
                    cat_name_rewrite: "$nameRewrite"
                }
            }
        ]);
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.news_author = async(req, res) => {
    try {
        const list = await NewAuthor.find();
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.trang_vang = async(req, res) => {
    try {
        const type = req.body.type || 1;
        let list;
        if (type == 1) {
            list = await CategoryCompany.find({
                parent_id: 0,
                name_tag: { $ne: "" },
                tag_index: { $ne: 0 }
            }, {
                city_tag: 1,
                name_tag: 1,
                id: 1
            });
        } else {
            list = await CategoryCompany.find({
                $or: [
                    { parent_id: { $ne: 0 } },
                    { name_tag: "" }
                ],
                tag_index: { $ne: 0 }
            }, {
                city_tag: 1,
                name_tag: 1,
                id: 1
            });
        }
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.keyword_ssl = async(req, res) => {
    try {
        const list = await KeywordSsl.find({ key_ssl_301: '', key_ssl_index: 1, key_ssl_nn: 0 }, {
            "key_ssl_id": 1,
            "key_ssl_name": 1,
            "key_ssl_nn": 1,
            "key_ssl_tt": 1,
            "key_ssl_301": 1,
            "key_ssl_index": 1,
            "key_tdgy": 1,
            "key_ndgy": 1,
            "key_time": 1
        });
        return functions.success(res, "thành công", { list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}