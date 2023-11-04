const TV365Tags = require('../../../models/Timviec365/TblTags')

const functions = require('../../../services/functions')
const fs = require('fs');

// Lấy danh sách 
exports.listTagAuto = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page?Number(page):1
        pageSize = pageSize?Number(pageSize):30
        const id = req.body.id?req.body.id:''
        const name = req.body.name?req.body.name:''
        const listTag = TV365Tags.aggregate([
            {
                $addFields: {
                    tag_id_string: {$toString: '$tag_id'},

                }
            },
            {
                $match: {
                    'tag_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'tag_keyword': {
                        $regex: name,
                        $options: 'i'
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    'tag_id': '$tag_id',
                    'tag_keyword': '$tag_keyword',
                    'tag_link': '$tag_link',
                }
            },
            {
                $sort: {'tag_id': -1}
            },
            {
                $skip: (page-1)*pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalTag = TV365Tags.aggregate([
            {
                $addFields: {
                    tag_id_string: {$toString: '$tag_id'},

                }
            },
            {
                $match: {
                    'tag_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'tag_keyword': {
                        $regex: name,
                        $options: 'i'
                    },
                }
            },
            {
                $count: 'total'
            }
        ])
        const [list,total] = await Promise.all([listTag, totalTag])
        return await functions.success(res, "Danh sách", { list: list?list:[], total: total[0]?total[0]['total']:0});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Thêm 
exports.addTagAuto = async (req, res) => {
    try {
        const tag_keyword = req.body.tag_keyword?req.body.tag_keyword:''
        const tag_link = req.body.tag_link?req.body.tag_link:''

        const tag_id = await functions.getMaxIdByField(TV365Tags, 'tag_id')
        const tag = new TV365Tags({
            tag_id,
            tag_keyword,
            tag_link,
        })
        await tag.save()
        return await functions.success(res, "Thành công", {data: tag});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Sửa 
exports.editTagAuto = async (req, res) => {
    try {
        if(!req.body.id) return functions.setError(res, 'Thiếu dữ liệu truyền lên')
        const id = Number(req.body.id)
        const tag_keyword = req.body.tag_keyword?req.body.tag_keyword:''
        const tag_link = req.body.tag_link?req.body.tag_link:''

        const tag = await TV365Tags.findOne({tag_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        await TV365Tags.updateOne({tag_id: id}, {
            tag_keyword,
            tag_link,
        })
        return await functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Detal
exports.detailTagAuto = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await TV365Tags.findOne({tag_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        return functions.success(res, "Thao tác thành công", {tag})
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Delete
exports.deleteTagAuto = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await TV365Tags.findOne({tag_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        await TV365Tags.deleteOne({tag_id: id})
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}