const functions = require('../../services/functions');
const CategoryCompany = require('../../models/Timviec365/UserOnSite/Company/CategoryCompany');
const Users = require('../../models/Users');
const TblModules = require('../../models/Timviec365/TblModules');
const Blog = require('../../models/Timviec365/Blog/Posts');
const TrangVangCategory = require('../../models/Timviec365/UserOnSite/Company/TrangVangCategory');

// Trang chủ
exports.home = async(req, res) => {
    try {
        const seo = await TblModules.findOne({ module: "https://timviec365.vn/trang-vang-doanh-nghiep.html" }).lean();

        // Cập nhật ảnh trên cdn
        seo.sapo = await functions.renderCDNImage(seo.sapo)


        return await functions.success(res, "Thông tin trang vàng", {
            data: seo
        });
    } catch (error) {
        functions.setError(res, error.message)
    }
}


// danh sách lĩnh vực ngành nghề
exports.getLV = async(req, res, next) => {
    try {
        const charid = req.body.charid;
        let condition = { city_tag: 0 };
        if (charid) {
            condition = { name_tag: { $regex: '^' + charid, $options: 'i' } };
        }

        const data = await CategoryCompany.find(condition).select("id name_tag city_tag parent_id").lean();
        return functions.success(res, 'Thành công', { data });

    } catch (err) {
        return functions.setError(res, err.message);
    };
};

exports.getLvDistinct = async(req, res) => {
    try {
        const list = await CategoryCompany.distinct('name_tag', { name_tag: { $ne: "" } }).lean();

        return functions.success(res, 'Thành công', { items: list });

    } catch (err) {
        return functions.setError(res, err.message);
    };
}

exports.yp_list_company = async(req, res) => {
    try {
        const request = req.body,
            tagid = request.tagid,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10;
        if (tagid) {
            const item = await CategoryCompany.findOne({
                id: tagid,
                $or: [
                    { parent_id: { $ne: 0 } },
                    { name_tag: '' }
                ]
            }).lean();
            if (item) {
                const condition = {
                    "inForCompany.tagLinhVuc": { $ne: null },
                    idTimViec365: { $gt: 694 },
                    city: item.city_tag,
                    type: 1,
                    fromWeb: "timviec365.vn"
                };
                // Lấy danh sách công ty
                const lists = await Users.find(condition).sort({ updatedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();

                // Lấy tổng
                const count = await Users.countDocuments(condition);

                // Lấy từ khóa liên quan
                const list_reated = await CategoryCompany.find({
                    id: { $ne: item.id },
                    name_tag: { $regex: item.name_tag },
                    city_tag: 0,
                    parent_id: { $ne: 0 }
                }).select("id city_tag name_tag").limit(20);

                // Địa điểm liên quan
                const list_city_reated = await CategoryCompany.find({
                    id: { $ne: item.id },
                    name_tag: { $regex: item.name_tag },
                    city_tag: { $ne: 0 },
                }).select("id city_tag name_tag").limit(20);

                // Blog liên quan
                let conditionBlog = {
                    new_new: 0,
                    new_301: "",
                }

                if (item.name_tag != "") {
                    conditionBlog.new_title = { $regex: item.name_tag }
                }

                const blog = await Blog.find(conditionBlog)
                    .select("new_title_rewrite new_id new_picture new_title")
                    .sort({ new_id: -1 })
                    .limit(4)
                    .lean();

                return await functions.success(res, "Lấy thông tin thành công", {
                    data: { item, lists, count, list_reated, list_city_reated, blog }
                });
            }
            return await functions.setError(res, "Không tồn tại");
        }
        return await functions.setError(res, "Không đủ tham số");
    } catch (error) {
        return await functions.setError(res, error.message);
    }
}

exports.yp_list_cate = async(req, res) => {
    try {
        const request = req.body,
            tagid = request.tagid,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10;
        if (tagid) {
            const item = await CategoryCompany.findOne({
                id: tagid,
                parent_id: 0,
                name_tag: { $ne: "" }
            }).lean();

            if (item) {
                // Danh sách công ty
                const company = [];
                // const company = await Users.aggregate([{
                //         $match: {
                //             $or: [
                //                 { "inForCompany.description": { $regex: item.name_tag, $options: "i" } },
                //                 { "userName": { $regex: item.name_tag, $options: "i" } },
                //                 { "inForCompany.timviec365.usc_lv": { $regex: item.name_tag, $options: "i" } },
                //             ],
                //             userName: { $ne: "" },
                //             idTimViec365: { $gt: 694 },
                //             "inForCompany.timviec365.usc_redirect": { $ne: "" }
                //         }
                //     },
                //     {
                //         $sort: { updatedAt: -1 }
                //     },
                //     { $skip: (page - 1) * pageSize },
                //     { $limit: pageSize },
                //     {
                //         $project: {
                //             usc_id: "$idTimViec365",
                //             usc_company: "$userName",
                //             usc_logo: "$avatarUser",
                //             usc_alias: "alias",
                //             usc_create_time: "$createdAt"
                //         }
                //     }
                // ]);


                // Lấy danh mục tiêu điểm
                const dm_td = await CategoryCompany.find({
                    parent_id: item.id
                }).sort({ id: -1 }).limit(12);

                // Lấy liên kết nhanh
                const lkn = await TrangVangCategory.find({
                    parent_id: item.id
                }).lean();

                for (let i = 0; i < lkn.length; i++) {
                    const element = lkn[i];
                    element.listChild = await CategoryCompany.find({
                        cate_id: element.id
                    }).lean();
                }
                let array_keyword = [];
                const array_name_tag = item.name_tag.split(' ');
                for (let j = 0; j < array_name_tag.length; j++) {
                    const element = array_name_tag[j];
                    array_keyword.push({ name_tag: { $regex: element, $options: "i" } });
                }

                // Lấy từ khóa liên quan
                const list_reated = await CategoryCompany.find({
                    id: { $ne: item.id },
                    $or: array_keyword,
                    city_tag: 0,
                    parent_id: { $ne: 0 }
                }).select("id city_tag name_tag").limit(20);

                // Địa điểm liên quan
                const list_city_reated = await CategoryCompany.find({
                    id: { $ne: item.id },
                    $or: array_keyword,
                    city_tag: { $ne: 0 }
                }).select("id city_tag name_tag").limit(20);

                // Blog liên quan
                let conditionBlog = {
                    new_new: 0,
                    new_301: "",
                }

                if (item.name_tag != "") {
                    conditionBlog.new_title = { $regex: item.name_tag, $options: "i" }
                }

                const blog = await Blog.find(conditionBlog)
                    .select("new_title_rewrite new_id new_picture new_title")
                    .sort({ new_id: -1 })
                    .limit(4)
                    .lean();

                return functions.success(res, "Lấy thông tin thành công", {
                    company: company,
                    trangvang: item,
                    tv_nntieudiem: dm_td,
                    tv_lknhanh: lkn,
                    key_lienquan: list_reated,
                    diadiem_lienquan: list_city_reated
                });
            }
            return functions.setError(res, "Không tồn tại");
        }
        return functions.setError(res, "Không đủ tham số");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// tìm kiếm công ty theo điều kiện
exports.findCompany = async(req, res, next) => {
    try {
        const request = req.body,
            keyword = request.keyword,
            city = Number(request.diadiem),
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10,
            skip = (page - 1) * pageSize;
        // if (keyword || Number(city)) {
        // Lấy công ty tương ứng
        let pipeline = [];

        if (keyword) {

            pipeline.push({
                $match: {
                    $text: { $search: keyword },
                    // score: { $meta: 'textScore' }
                    // userName: { $regex: keyword, $options: 'i' }
                    // $or: [
                    //     { "inForCompany.description": { $regex: keyword, $options: "i" } },
                    //     { "userName": { $regex: keyword, $options: "i" } },
                    //     { "inForCompany.timviec365.usc_lv": { $regex: keyword, $options: "i" } },
                    // ]
                },
            });
            pipeline.push({ $sort: { score: { $meta: 'textScore' } } });
        }

        pipeline.push({
            $match: {
                userName: { $ne: '' },
                idTimViec365: { $gt: 694 },
                'inForCompany.timviec365.usc_redirect': '',
                type: 1,
                ...(city ? { city: Number(city) } : {}),
            },
        }, { $skip: skip }, { $limit: pageSize }, {
            $project: {
                usc_id: '$idTimViec365',
                usc_company: '$userName',
                usc_logo: '$avatarUser',
                usc_alias: '$alias',
                usc_create_time: '$createdAt',
                usc_size: '$inForCompany.timviec365.usc_size',
                usc_address: '$address',
                usc_company_info: '$inForCompany.description',
                usc_lv: '$inForCompany.timviec365.usc_lv',
                usc_phone: '$phoneTK'
            },
        });
        let count = 0;
        const lists = await Users.aggregate(pipeline);

        // Lấy tổng
        if (keyword) {
            count = await Users.countDocuments({
                // $or: [
                //     { "inForCompany.description": { $regex: keyword, $options: "i" } },
                //     { "userName": { $regex: keyword, $options: "i" } },
                //     { "inForCompany.timviec365.usc_lv": { $regex: keyword, $options: "i" } },
                // ],
                userName: { $ne: '', $regex: keyword, $options: 'i' },
                idTimViec365: { $gt: 694 },
                'inForCompany.timviec365.usc_redirect': '',
                type: 1,
                ...(city ? { city: Number(city) } : {}),
            });
        } else {
            count = await Users.countDocuments({
                userName: { $ne: '' },
                idTimViec365: { $gt: 694 },
                'inForCompany.timviec365.usc_redirect': '',
                type: 1,
                ...(city ? { city: Number(city) } : {}),
            });
        }
        let array_keyword = [];
        if (keyword) {
            const array_name_tag = keyword.split(' ');
            for (let j = 0; j < array_name_tag.length; j++) {
                const element = array_name_tag[j];
                array_keyword.push({ name_tag: { $regex: element } });
            }
            // Lấy từ khóa liên quan
            const list_reated = await CategoryCompany.find({
                    // id: { $ne: item.id },
                    $or: array_keyword,
                    city_tag: 0,
                    parent_id: { $ne: 0 },
                })
                .select('id city_tag name_tag')
                .limit(20)
                .lean();

            // Địa điểm liên quan
            const list_city_reated = await CategoryCompany.find({
                    // id: { $ne: item.id },
                    $or: array_keyword,
                    city_tag: { $ne: 0 },
                })
                .select('id city_tag name_tag')
                .limit(20)
                .lean();

            // // Blog liên quan
            let conditionBlog = {
                new_new: 0,
                new_301: '',
            };

            conditionBlog.new_title = { $regex: keyword };

            const blog = await Blog.find(conditionBlog)
                .select('new_title_rewrite new_id new_picture new_title')
                .sort({ new_id: -1 })
                .limit(4)
                .lean();

            for (let k = 0; k < blog.length; k++) {
                const element = blog[k];
                element.new_picture = functions.getPictureBlogTv365(
                    element.new_picture
                );
            }

            return functions.success(res, 'Lấy thông tin thành công', {
                company: lists,
                count: count,
                key_lienquan: list_reated,
                diadiem_lienquan: list_city_reated,
                news_lienquan: blog,
            });
        } else {
            // Lấy từ khóa liên quan
            const list_reated = await CategoryCompany.find({
                    // id: { $ne: item.id },

                    city_tag: 0,
                    parent_id: { $ne: 0 },
                })
                .select('id city_tag name_tag')
                .limit(20)
                .lean();

            // Địa điểm liên quan
            const list_city_reated = await CategoryCompany.find({
                    // id: { $ne: item.id },

                    city_tag: { $ne: 0 },
                })
                .select('id city_tag name_tag')
                .limit(20)
                .lean();

            // // Blog liên quan
            let conditionBlog = {
                new_new: 0,
                new_301: '',
            };

            const blog = await Blog.find(conditionBlog)
                .select('new_title_rewrite new_id new_picture new_title')
                .sort({ new_id: -1 })
                .limit(4)
                .lean();

            for (let k = 0; k < blog.length; k++) {
                const element = blog[k];
                element.new_picture = functions.getPictureBlogTv365(
                    element.new_picture
                );
            }

            return functions.success(res, 'Lấy thông tin thành công', {
                company: lists,
                count: count,
                key_lienquan: list_reated,
                diadiem_lienquan: list_city_reated,
                news_lienquan: blog,
            });
        }
        return functions.setError(res, 'Không tồn tại');
        // }
        // return functions.setError(res, "Không đủ tham số");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};