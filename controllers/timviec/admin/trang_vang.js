const fs = require('fs');
const services = require('../../../services/timviec365/company');
const functions = require('../../../services/functions');
const CategoryCompany = require('../../../models/Timviec365/UserOnSite/Company/CategoryCompany')
const TrangVangCategory = require('../../../models/Timviec365/UserOnSite/Company/TrangVangCategory')
const City = require('../../../models/City')
const services_cate = require('../../../services/timviec365/admin/trang_vang')
    //Thêm mới tag
exports.addTag = async(req, res) => {
    try {
        const data = req.body;
        const { name_tag } = data;
        const { city_tag, tag_content, parent_id, tag_vlgy, tag_ndgy, } = data;
        let MaxIdTag = await CategoryCompany.findOne({}).sort({ id: -1 }).select('id').lean();
        if (name_tag == undefined || name_tag == "") {
            return functions.setError(res, "Missing data", 400);
        }

        let new_tag = {
            id: MaxIdTag.id + 1,
            name_tag: name_tag,
            level_id: 1,
            tag_index: 0,
            city_tag: 0,
            cate_id: 0,
            parent_id: 0,
            keyword_tag: "",
            link_301: "",
            tag_content: "",
            tag_vlgy: "",
            tag_ndgy: ""
        };


        if (city_tag) new_tag.city_tag = city_tag;
        if (tag_content) new_tag.tag_content = tag_content;
        if (parent_id) new_tag.parent_id = parent_id;
        if (tag_vlgy) new_tag.tag_vlgy = tag_vlgy;
        if (tag_ndgy) new_tag.tag_ndgy = tag_ndgy;

        new_tag = new CategoryCompany(new_tag);
        await new_tag.save();

        return functions.success(res, 'Thêm mới thành công', { new_tag });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Lấy danh sách tag
exports.getListTag = async(req, res) => {
    try {
        const data = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let { cate_id, parent_id, name_tag } = data;

        cate_id = Number(req.body.cate_id);
        parent_id = Number(req.body.parent_id);

        condition = {
            name_tag: { $ne: '' },
            link_301: ""
        };
        if (name_tag) {
            condition.name_tag = { $regex: new RegExp(name_tag, 'i') }
        }
        if (cate_id) {
            condition.cate_id = cate_id;
        }
        if (parent_id) {
            condition.parent_id = parent_id;
        }
        const list_tag = await CategoryCompany.aggregate([{
                $sort: { id: -1 }
            },
            {
                $match: condition
            },
            {
                $lookup: {
                    from: "TrangVangCategory",
                    localField: "cate_id",
                    foreignField: "id",
                    as: "category",
                    pipeline: [
                        { $sort: { id: -1 } },
                        {
                            $project: {
                                name_cate: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "City",
                    localField: "city_tag",
                    foreignField: "_id",
                    as: "city",
                    pipeline: [
                        { $sort: { _id: -1 } },
                        {
                            $project: {
                                name: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$city",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "CategoryCompany",
                    localField: "parent_id",
                    foreignField: "id",
                    as: "parent",
                    pipeline: [
                        { $sort: { id: -1 } },
                        { $match: { parent_id: 0 } },
                        {
                            $project: {
                                name_tag: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$parent",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    id: 1,
                    name_tag: 1,
                    level_id: 1,
                    tag_index: 1,
                    name_parent: "$parent.name_tag",
                    city: "$city.name",
                    name_cate: "$category.name_cate",
                    parent_id: 1,
                }
            }
        ])

        const count = await CategoryCompany.countDocuments(condition);
        return functions.success(res, 'Lấy danh sách thành công', { list_tag, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Lấy danh mục
exports.getListMenuTag = async(req, res) => {
    try {
        condition = { parent_id: 0 };
        const list_menu_tag = await CategoryCompany.aggregate([{
                $sort: { id: -1 }
            },
            {
                $match: condition
            },
            {
                $project: {
                    id: 1,
                    name_tag: 1,
                }
            }
        ])

        const count = await CategoryCompany.countDocuments(condition);
        return functions.success(res, 'Lấy danh sách danh mục thành công', { list_menu_tag, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Chỉnh sửa tag
exports.editTag = async(req, res) => {
    try {
        const data = req.body;
        const { name_tag } = data;
        const { city_tag, tag_content, parent_id, tag_vlgy, tag_ndgy, cate_id } = data;
        const id = Number(req.body.id);
        //Check điều kiện đầu vào
        if (
            name_tag == undefined || name_tag == "" || isNaN(id)
        ) {
            return functions.setError(res, "Missing data", 400);
        }

        // Check danh mục blog tồn tại
        let edit_tag = {}

        edit_tag = await CategoryCompany.findOne({ id: id });
        if (edit_tag == null) {
            return functions.setError(res, "Không tìm thấy tag", 400);
        }

        //Cập nhật danh mục blog
        edit_tag.name_tag = name_tag;

        if (city_tag) edit_tag.city_tag = Number(city_tag);
        if (tag_content) edit_tag.tag_content = tag_content;
        if (parent_id) edit_tag.parent_id = Number(parent_id);
        if (tag_vlgy) edit_tag.tag_vlgy = tag_vlgy;
        if (tag_ndgy) edit_tag.tag_ndgy = tag_ndgy;
        if (cate_id) {
            edit_tag.cate_id = Number(cate_id);
            edit_tag.level_id = 2;
        }

        edit_tag = new CategoryCompany(edit_tag);
        await edit_tag.save();

        return functions.success(res, 'Chỉnh sửa thành công', { edit_tag });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Chi tiết tag
exports.getDetailTag = async(req, res) => {
    try {
        let detail_tag = {}
        const id = Number(req.body.id);
        if (id) {
            detail_tag = await CategoryCompany.findOne({ id: id });
        } else {
            return functions.setError(res, "Missing data", 400);
        }
        return functions.success(res, 'Lấy thông tin tag thành công', { detail_tag });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Đánh index cho tag
//Active danh mục blog
exports.indexTag = async(req, res) => {
    try {
        let id = req.body.id;
        let tag_index = req.body.tag_index;
        if (!id || !tag_index) {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
        if (isNaN(Number(id)) || isNaN(Number(tag_index))) {
            return functions.setError(res, 'Thông tin truyền lên sai định dạng', 400);
        }

        if (Number(tag_index) == 0 || Number(tag_index) == 1) {
            await CategoryCompany.updateOne({ id: Number(id) }, { tag_index: Number(tag_index) });
        } else {
            return functions.setError(res, 'Index không đúng', 400);
        }

        return functions.success(res, 'Cập nhật index tag thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Thêm mới liên kết nhanh
exports.addTrangVangCate = async(req, res) => {
    try {
        const data = req.body;
        const { name_cate } = data;
        const { parent_id } = data;
        const file = req.files.img_cate;
        let MaxIdCate = await TrangVangCategory.findOne({}).sort({ id: -1 }).select('id').lean();
        if (name_cate == undefined || name_cate == "") {
            return functions.setError(res, "Missing data", 400);
        }

        let new_cate = {
            id: MaxIdCate.id + 1,
            name_cate: name_cate,
        };


        if (parent_id) new_cate.parent_id = parent_id;
        if (parent_id) new_cate.parent_id = parent_id;
        if (file) {
            if (file.size > 0) {
                let cate_file = services_cate.uploadImageCate(file);
                new_cate.img_cate = cate_file.file_name;
            }
        }

        new_cate = new TrangVangCategory(new_cate);
        await new_cate.save();

        return functions.success(res, 'Thêm mới thành công', { new_cate });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Lấy danh sách liên kết nhanh
exports.getListTrangVangCate = async(req, res) => {
    try {
        const data = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        const { id, name_cate, parent_id } = data;
        condition = {};

        if (id) condition.id = Number(id);
        if (name_cate) condition.name_cate = { $regex: new RegExp(name_cate, 'i') };
        if (parent_id) condition.parent_id = Number(parent_id);

        const list_cate = await TrangVangCategory.aggregate([{
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: "CategoryCompany",
                    localField: "parent_id",
                    foreignField: "id",
                    as: "parent",
                    pipeline: [
                        { $sort: { id: -1 } },
                        { $match: { parent_id: 0 } },
                        {
                            $project: {
                                name_tag: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$parent",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $match: condition
            },
            {
                $project: {
                    id: 1,
                    name_cate: 1,
                    parent_id: 1,
                    name_tag: "$parent.name_tag",
                    img_cate: 1,
                }
            }
        ])

        list_cate.map(item => {
            if (item.img_cate) {
                item.img_cate = services_cate.getImageCate(item.img_cate);
            }
            return item;
        })

        const count = await TrangVangCategory.countDocuments(condition);
        return functions.success(res, 'Lấy danh sách thành công', { list_cate, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Chỉnh sửa liên kết nhanh
exports.editTrangVangCate = async(req, res) => {
    try {
        const data = req.body;
        let { id } = data;
        let { name_cate, parent_id } = data;
        id = Number(req.body.id);
        let file = req.files.img_cate;
        //Check điều kiện đầu vào
        if (
            name_cate == undefined || name_cate == "" || isNaN(id)
        ) {
            return functions.setError(res, "Missing data", 400);
        }

        // Check danh mục blog tồn tại
        let edit_cate = {}

        edit_cate = await TrangVangCategory.findOne({ id: id });
        if (edit_cate == null) {
            return functions.setError(res, "Không tìm thấy liên kết", 400);
        }

        //Cập nhật danh mục blog
        edit_cate.name_cate = name_cate;

        if (parent_id) edit_cate.parent_id = parent_id;
        if (file) {
            if (file.size > 0) {
                const delete_check = services_cate.deleteImageCate(edit_cate.img_cate);
                if (delete_check == false) {
                    functions.setError(res, "Có lỗi xảy ra khi cập nhật file ảnh tác giả", 400);
                }
                let cate_file = services_cate.uploadImageCate(file);
                edit_cate.img_cate = cate_file.file_name;
            }
        }

        edit_cate = new TrangVangCategory(edit_cate);
        await edit_cate.save();

        return functions.success(res, 'Chỉnh sửa thành công', { edit_cate });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Lấy chi tiết liên kết nhanh
exports.getDetailTrangVangCate = async(req, res) => {
    try {
        let detail_cate = {}
        const id = Number(req.body.id);
        if (id) {
            detail_cate = await TrangVangCategory.findOne({ id: id });
        } else {
            return functions.setError(res, "Missing data", 400);
        }
        if (detail_cate.img_cate) {
            detail_cate.img_cate = services_cate.getImageCate(detail_cate.img_cate);
        }
        return functions.success(res, 'Lấy chi tiết liên kết nhanh thành công', { detail_cate });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};