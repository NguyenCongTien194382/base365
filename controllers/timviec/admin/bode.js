const functions = require('../../../services/functions');
const functionsBD = require('../../../services/timviec365/admin/bode');
BoDe = require('../../../models/Timviec365/Blog/BoDe');
BoDeTag = require('../../../models/Timviec365/Blog/BoDeTag');
BoDeNew = require('../../../models/Timviec365/Blog/BoDeNews');
TagBlog = require('../../../models/Timviec365/Blog/TagBlog');
const fs = require('fs');
const path = require('path');


exports.tagAllBD = async(req, res) => {
    try {
        const listNews = await BoDeTag.find({}).sort({ _id: -1 }).lean();
        const count = await BoDeTag.countDocuments();
        return await functions.success(res, 'Danh sách Tag', {
            data: {
                listNews,
                count,
            },
        });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};
// Lấy danh sách tag câu hỏi tuyển dụng
exports.tagBD = async(req, res) => {
        try {
            let page = req.body.page || 1;
            let pageSize = req.body.pageSize || 30;
            const bmt_name = req.body.bmt_name ? req.body.bmt_name : ''
            page = page ? Number(page) : 1
            pageSize = pageSize ? Number(pageSize) : 30
            const listBM = BoDeTag.find({
                bmt_name: { $regex: bmt_name, $options: 'i' }
            }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
            const totalBM = BoDeTag.find().count()
            const [
                list,
                total,
            ] = await Promise.all([listBM, totalBM])
            return await functions.success(res, "Thông tin danh mục câu hỏi tuyển dụng", { list: list ? list : [], total });
        } catch (error) {
            return functions.setError(res, error.message);
        }
    }
    // Thêm mới tag
exports.addTagBD = async(req, res) => {
        try {
            if (!req.body.bmt_name)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = await functions.getMaxIdByField(BoDeTag, '_id')
            const {
                bmt_name,
                bmt_active,

            } = req.body
            await new BoDeTag({
                _id: id,
                bmt_name,
                bmt_active,
            }).save()
            return functions.success(res, "Thêm thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Sửa tag
exports.editTagBD = async(req, res) => {
        try {
            if (!req.body.bmt_name || !req.body.id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.id)
            const {
                bmt_name,
                bmt_title,
                bmt_des,
                bmt_key,
                bmt_active,
            } = req.body
            const tag = await BoDeTag.findOne({ _id: id })
            if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
            await BoDeTag.updateOne({ _id: id }, {
                bmt_name,
                bmt_title,
                bmt_des,
                bmt_key,
                bmt_active,
            })
            return functions.success(res, "Sửa thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Active tag
exports.activeTagBD = async(req, res) => {
        try {
            if (req.body.id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.id)
            const tag = await BoDeTag.findOne({ _id: id }, { bmt_active: 1 })
            if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
            if (tag.bmt_active == 1) {
                await BoDeTag.updateOne({ _id: id }, {
                    bmt_active: 0,
                })
            } else {
                await BoDeTag.updateOne({ _id: id }, {
                    bmt_active: 1,
                })
            }
            return functions.success(res, "Thao tác thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Xóa tag
exports.deleteTagBD = async(req, res) => {
        try {
            if (!req.body.id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.id)
            const tag = await BoDeTag.findOne({ _id: id })
            if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
            await BoDeTag.deleteOne({ _id: id })
            return functions.success(res, "Xóa thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // chi tiết tag
exports.detailTagBD = async(req, res) => {
        try {
            if (!req.body.id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.id)
            const tag = await BoDeTag.findOne({ _id: id }).lean()
            if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag")
            return functions.success(res, "Chi tiết tag", { tag })
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Lấy danh sách danh mục câu hỏi tuyển dụng
exports.bodecate = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        const keywords = req.body.keywords ? req.body.keywords : ''
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const listCate = BoDe.find({
            bd_cate: { $regex: keywords, $options: 'i' }
        }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
        const count = BoDe.find().count()
        const [list, total] = await Promise.all([listCate, count])
        return await functions.success(res, "Thông tin danh mục bộ đề", { list: list ? list : [], total: total ? total : total });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
exports.detailDMBD = async(req, res) => {
    try {
        let id = req.body.id;
        if (id) {
            let checkdata = await BoDe.findOne({ _id: id })
            if (checkdata) {
                const [list] = await BoDe.aggregate([
                    { $match: { _id: Number(id) } },
                    {
                        $project: {
                            bd_id: "$_id",
                            bd_cate: "$bd_cate",
                            bd_order: "$bd_order",
                            bd_footer_order: "$bd_footer_order",
                            bd_description: "$bd_description",
                            bd_keyword: "$bd_keyword",
                            bd_title: "$bd_title",
                            bd_mota: "$bd_mota",
                        }
                    }
                ]);
                return functions.success(res, "Chi tiết danh mục câu hỏi tuyển dụng", {
                    data: {
                        list
                    }
                });
            } else {
                return functions.success(res, 'Không tìm thấy chi tiết danh mục câu hỏi tuyển dụng');
            }
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};
// Thêm mới danh mục
exports.addCateBD = async(req, res) => {
        try {
            if (!req.body.bd_cate || !req.body.bd_order || !req.body.bd_footer_order)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = await functions.getMaxIdByField(BoDe, '_id')
            const {
                bd_cate,
                bd_order,
                bd_footer_order,
                bd_title,
                bd_description,
                bd_keyword,
                bd_mota,
            } = req.body
            await new BoDe({
                _id: id,
                bd_cate,
                bd_order,
                bd_footer_order,
                bd_title,
                bd_description,
                bd_keyword,
                bd_mota,
            }).save()
            return functions.success(res, "Thêm câu hỏi tuyển dụng thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Sửa danh mục
exports.editCateBD = async(req, res) => {
        try {
            if (!req.body.bd_cate || !req.body.bd_order || !req.body.bd_footer_order || !req.body.bd_id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.bd_id)
            const {
                bd_cate,
                bd_order,
                bd_footer_order,
                bd_title,
                bd_description,
                bd_keyword,
                bd_mota,
            } = req.body
            const cate = await BoDe.findOne({ _id: id })
            if (!cate) return functions.setError(res, "Không tìm thấy thông tin danh mục");
            await BoDe.updateOne({ _id: id }, {
                bd_cate,
                bd_order,
                bd_footer_order,
                bd_title,
                bd_description,
                bd_keyword,
                bd_mota,
            })
            return functions.success(res, "Sửa câu hỏi tuyển dụng thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Xóa danh mục
exports.deleteCateBD = async(req, res) => {
        try {
            if (!req.body.bd_id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.bd_id)
            const cate = await BoDe.findOne({ _id: id })
            if (!cate) return functions.setError(res, "Không tìm thấy thông tin danh mục");
            await BoDe.deleteOne({ _id: id })
            return functions.success(res, "Xóa câu hỏi tuyển dụng thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Lấy danh sách câu hỏi tuyển dụng
exports.BoDe = async(req, res) => {
        try {
            let page = req.body.page || 1
            let pageSize = req.body.pageSize || 30
            const bdn_name = req.body.bdn_name ? req.body.bdn_name : ''
            page = page ? Number(page) : 1
            pageSize = pageSize ? Number(pageSize) : 30
            const listBM = BoDeNew.find({
                bdn_name: { $regex: bdn_name, $options: 'i' }
            }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
            const totalBM = BoDeNew.find().count()
            const [
                list,
                total,
            ] = await Promise.all([listBM, totalBM])
            await list.forEach(value => {
                value['bdn_avatar'] = functionsBD.getImageBD(value['bdn_avatar'])
            })
            return await functions.success(res, "Thông tin câu hỏi tuyển dụng", { list: list ? list : [], total });
        } catch (error) {
            return functions.setError(res, error.message);
        }
    }
    // Thêm mới 
exports.addBD = async(req, res) => {
        try {
            if (!req.body.bdn_name || !req.body.bdn_cate_id || !req.body.bdn_tag_id || !req.body.bdn_teaser || !req.body.bdn_sapo)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = await functions.getMaxIdByField(BoDeNew, '_id');
            const {
                bdn_name,
                bdn_title,
                bdn_url,
                bdn_cate_id,
                bdn_tag_id,
                bdn_link_web,
                bdn_teaser,
                bdn_sapo,
                bdn_description,
                bdn_view,
                bdn_dg,
                bdn_cate_url,
                bdn_point_dg,
                bdn_admin_edit,
                bdn_audio,
            } = req.body
            const size = req.files.bdn_avatar.size / 1024
            const bdn_time = Math.floor(Date.now() / 1000);
            if ((req.files.bdn_avatar.type === 'image/jpeg' || req.files.bdn_avatar.type === 'image/png' || req.files.bdn_avatar.type === 'image/jpg') && size < 300000) {
                var filenameAVT = req.files.bdn_avatar;
                var bdn_avatar = functionsBD.uploadImageBD(filenameAVT);
            } else {
                return functions.setError(res, 'Chỉ được chọn ảnh đại diện có kích thước nhỏ hơn 300000Kb')
            }
            // var filenamePTW = req.files.bdn_picture_web;
            // var filenamePTW2 = req.files.bdn_picture_web2;
            // var bdn_picture_web = functionsBD.uploadImageBD(filenamePTW);
            // var bdn_picture_web2 = functionsBD.uploadImageBD(filenamePTW2);
            await new BoDeNew({
                _id: id,
                bdn_name: bdn_name,
                bdn_title: bdn_title,
                bdn_url: bdn_url,
                bdn_cate_id: bdn_cate_id,
                bdn_tag_id: bdn_tag_id,
                bdn_avatar: bdn_avatar.file_name,
                // bdn_picture_web: bdn_picture_web,
                // bdn_picture_web2: bdn_picture_web2,
                bdn_link_web: bdn_link_web,
                bdn_teaser: bdn_teaser,
                bdn_sapo: bdn_sapo,
                bdn_description: bdn_description,
                bdn_view: bdn_view,
                bdn_dg: bdn_dg,
                bdn_time: bdn_time,
                bdn_cate_url: bdn_cate_url,
                bdn_point_dg: bdn_point_dg,
                bdn_admin_edit: bdn_admin_edit,
                bdn_audio: bdn_audio,
            }).save()
            return functions.success(res, "Thêm thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Sửa
exports.editBD = async(req, res) => {
        try {
            if (!req.body.bdn_name || !req.body.bdn_cate_id || !req.body.bdn_tag_id || !req.body.bdn_teaser || !req.body.bdn_sapo || !req.body.bdn_id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.bdn_id)
            const {
                bdn_name,
                bdn_title,
                bdn_url,
                bdn_cate_id,
                bdn_tag_id,
                bdn_link_web,
                bdn_teaser,
                bdn_sapo,
                bdn_description,
                bdn_view,
                bdn_dg,
                bdn_cate_url,
                bdn_point_dg,
                bdn_admin_edit,
                bdn_audio,
            } = req.body
            const size = req.files.bdn_avatar.size / 1024
            if ((req.files.bdn_avatar.type === 'image/jpeg' || req.files.bdn_avatar.type === 'image/png' || req.files.bdn_avatar.type === 'image/jpg') && size < 300000) {
                var filenameAVT = req.files.bdn_avatar;
                var bdn_avatar = functionsBD.uploadImageBD(filenameAVT);
            } else {
                return functions.setError(res, 'Chỉ được chọn ảnh đại diện có kích thước nhỏ hơn 300000Kb')
            }
            // var filenamePTW = req.files.bdn_picture_web;
            // var filenamePTW2 = req.files.bdn_picture_web2;
            // var bdn_picture_web = functionsBD.uploadImageBD(filenamePTW);
            // var bdn_picture_web2 = functionsBD.uploadImageBD(filenamePTW2);
            await BoDeNew.updateOne({ _id: id }, {
                _id: id,
                bdn_name: bdn_name,
                bdn_title: bdn_title,
                bdn_url: bdn_url,
                bdn_cate_id: bdn_cate_id,
                bdn_tag_id: bdn_tag_id,
                bdn_avatar: bdn_avatar.file_name,
                // bdn_picture_web: bdn_picture_web,
                // bdn_picture_web2: bdn_picture_web2,
                bdn_link_web: bdn_link_web,
                bdn_teaser: bdn_teaser,
                bdn_sapo: bdn_sapo,
                bdn_description: bdn_description,
                bdn_view: bdn_view,
                bdn_dg: bdn_dg,
                bdn_cate_url: bdn_cate_url,
                bdn_point_dg: bdn_point_dg,
                bdn_admin_edit: bdn_admin_edit,
                bdn_audio: bdn_audio,
            })
            return functions.success(res, "Sửa câu hỏi tuyển dụng thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // Xóa Câu hỏi tuyển dụng
exports.deleteBD = async(req, res) => {
        try {
            if (!req.body.bdn_id)
                return functions.setError(res, "Thiếu dữ liệu truyền lên");
            const id = Number(req.body.bdn_id)
            const form = await BoDeNew.findOne({ _id: id })
            if (!form) return functions.setError(res, "Không tìm thấy thông tin Câu hỏi tuyển dụng");
            await BoDeNew.deleteOne({ _id: id })
            return functions.success(res, "Xóa thành công")
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message);
        }
    }
    // chi tiết Câu hỏi tuyển dụng
exports.detailBD = async(req, res) => {
    try {
        if (!req.body.bdn_id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.bdn_id)
        const form = await BoDeNew.findOne({ _id: id }).lean()
        if (!form) return functions.setError(res, "Không tìm thấy thông tin Câu hỏi tuyển dụng")
        return functions.success(res, "Chi tiết Câu hỏi tuyển dụng", { form })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

exports.allListDMBD = async(req, res) => {
    try {
        const listNews = await BoDe.find({}).sort({ _id: -1 }).lean();
        const count = await BoDe.countDocuments();
        return await functions.success(res, 'Danh sách Tất cả danh mục câu hỏi tuyển dụng', {
            data: {
                listNews,
                count,
            },
        });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};