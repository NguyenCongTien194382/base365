const Keyword = require('../../../models/Timviec365/UserOnSite/Company/Keywords')
const City = require('../../../models/City')
const District = require('../../../models/District')

const functions = require('../../../services/functions')
const fs = require('fs');

// Lấy danh sách quản lý tag
exports.listTagManager = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page?Number(page):1
        pageSize = pageSize?Number(pageSize):30
        const id = req.body.id?req.body.id:''
        const name = req.body.name?req.body.name:''
        const city = req.body.city?Number(req.body.city):null
        const district = req.body.district?Number(req.body.district):null
        const listTag = Keyword.aggregate([
            {
                $addFields: {
                    key_id_string: {$toString: '$key_id'},

                }
            },
            {
                $match: {
                    'key_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'key_name': {
                        $regex: name,
                        $options: 'i'
                    },
                    $expr: {
                        $and: [
                            {
                                $cond: {
                                    if: { $eq: [city, null] },
                                    then: true,
                                    else: { $eq: ["$key_city_id", city] }
                                },
                            },
                            {
                                $cond: {
                                    if: { $eq: [district, null] },
                                    then: true,
                                    else: { $eq: ["$key_qh_id", district] }
                                }
                            }
                        ]
                    },
                }
            },
            {
                $lookup: {
                    from: 'CategoryJob',
                    localField: 'key_cate_id',
                    foreignField: 'cat_id',
                    as: 'cate'
                }
            },
            {$unwind: {
                path: '$cate',
                preserveNullAndEmptyArrays: true
            }},
            {
                $lookup: {
                    from: 'CategoryJob',
                    localField: 'key_cate_lq',
                    foreignField: 'cat_id',
                    as: 'catelq'
                }
            },
            {$unwind: {
                path: '$catelq',
                preserveNullAndEmptyArrays: true
            }},
            {
                $lookup: {
                    from: 'City',
                    localField: 'key_city_id',
                    foreignField: '_id',
                    as: 'city'
                }
            },
            {$unwind: {
                path: '$city',
                preserveNullAndEmptyArrays: true
            }},
            {
                $lookup: {
                    from: 'District',
                    localField: 'key_qh_id',
                    foreignField: '_id',
                    as: 'qh'
                }
            },
            {$unwind: {
                path: '$qh',
                preserveNullAndEmptyArrays: true
            }},
            {
                $project: {
                    _id: 0,
                    'key_id': '$key_id',
                    'key_name': '$key_name',
                    'key_cate_id': '$key_cate_id',
                    'key_cate_name': '$cate.cat_name',
                    'key_city_id': '$key_city_id',
                    'key_city_name': '$city.name',
                    'key_qh_id': '$key_qh_id',
                    'key_qh_name': '$qh.name',
                    'key_cb_id': '$key_cb_id',
                    'key_teaser': '$key_teaser',
                    'key_cate_lq': '$key_cate_lq',
                    'key_cate_lq_name': '$catelq.cat_name',
                    'key_index': '$key_index',
                    'key_type': '$key_type',
                    'key_err': '$key_err',
                }
            },
            {
                $sort: {'key_id': -1}
            },
            {
                $skip: (page-1)*pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalTag = Keyword.aggregate([
            {
                $addFields: {
                    key_id_string: {$toString: '$key_id'},

                }
            },
            {
                $match: {
                    'key_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'key_name': {
                        $regex: name,
                        $options: 'i'
                    },
                    $expr: {
                        $and: [
                            {
                                $cond: {
                                    if: { $eq: [city, null] },
                                    then: true,
                                    else: { $eq: ["$key_city_id", city] }
                                },
                            },
                            {
                                $cond: {
                                    if: { $eq: [district, null] },
                                    then: true,
                                    else: { $eq: ["$key_qh_id", district] }
                                }
                            }
                        ]
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
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách thành phố
exports.listCity = async(req, res) => {
    try {
        const list = await City.find({},'name').lean()
        return await functions.success(res, "Danh sách", { list: list?list:[]});
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách quận huyện
exports.listDistrict = async(req, res) => {
    try {
        const list = await District.find({},'name').lean()
        return await functions.success(res, "Danh sách", { list: list?list:[]});
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm quản lý tag
exports.addTagManager = async (req, res) => {
    try {
        const key_type = req.body.key_type?req.body.key_type:0
        const key_cate_id = req.body.key_cate_id?req.body.key_cate_id:0
        const key_city_id = req.body.key_city_id?req.body.key_city_id:0
        const key_qh_id = req.body.key_qh_id?req.body.key_qh_id:0
        const key_qh_kcn = req.body.key_qh_kcn?req.body.key_qh_kcn:0
        const key_cate_lq = req.body.key_cate_lq?req.body.key_cate_lq:0
        const key_cb_id = req.body.key_cb_id?req.body.key_cb_id:0
        const key_name = req.body.key_name?req.body.key_name:''
        const key_lq = req.body.key_lq?req.body.key_lq:''
        const key_teaser = req.body.key_teaser?req.body.key_teaser:''
        const key_tit = req.body.key_tit?req.body.key_tit:''
        const key_desc = req.body.key_desc?req.body.key_desc:''
        const key_key = req.body.key_key?req.body.key_key:''
        const key_h1 = req.body.key_h1?req.body.key_h1:''
        const key_err = req.body.key_err?req.body.key_err:0
        const key_tdgy = req.body.key_tdgy?req.body.key_tdgy:''
        const key_ndgy = req.body.key_ndgy?req.body.key_ndgy:''

        const now = functions.getTimeNow()
        const key_id = await functions.getMaxIdByField(Keyword, 'key_id')
        const dupKeyword = await Keyword.findOne({
            key_cate_id,
            key_type,
            key_city_id,
            key_qh_id,
            key_cb_id,
            key_name,
        })
        if(dupKeyword) return functions.setError(res, 'Nội dung bị trùng')
        const keyword = new Keyword({
            key_id,
            key_type,
            key_cate_id,
            key_city_id,
            key_qh_id,
            key_qh_kcn,
            key_cate_lq,
            key_cb_id,
            key_name,
            key_lq,
            key_teaser,
            key_tit,
            key_desc,
            key_key,
            key_h1,
            key_err,
            key_tdgy,
            key_ndgy,
            key_301: '',
            key_time: now,
        })
        await keyword.save()
        return await functions.success(res, "Thành công", {data: keyword});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// sửa quản lý tag
exports.editTagManager = async (req, res) => {
    try {
        if(!req.body.id) return functions.setError(res, 'Thiếu dữ liệu truyền lên')
        const id = Number(req.body.id)
        const key_type = req.body.key_type?req.body.key_type:0
        const key_cate_id = req.body.key_cate_id?req.body.key_cate_id:0
        const key_city_id = req.body.key_city_id?req.body.key_city_id:0
        const key_qh_id = req.body.key_qh_id?req.body.key_qh_id:0
        const key_qh_kcn = req.body.key_qh_kcn?req.body.key_qh_kcn:0
        const key_cate_lq = req.body.key_cate_lq?req.body.key_cate_lq:0
        const key_cb_id = req.body.key_cb_id?req.body.key_cb_id:0
        const key_name = req.body.key_name?req.body.key_name:''
        const key_lq = req.body.key_lq?req.body.key_lq:''
        const key_teaser = req.body.key_teaser?req.body.key_teaser:''
        const key_tit = req.body.key_tit?req.body.key_tit:''
        const key_desc = req.body.key_desc?req.body.key_desc:''
        const key_key = req.body.key_key?req.body.key_key:''
        const key_h1 = req.body.key_h1?req.body.key_h1:''
        const key_err = req.body.key_err?req.body.key_err:0
        const key_tdgy = req.body.key_tdgy?req.body.key_tdgy:''
        const key_ndgy = req.body.key_ndgy?req.body.key_ndgy:''

        const now = functions.getTimeNow()
        const dupKeywordPromise = Keyword.findOne({
            key_id: {$ne: id},
            key_cate_id,
            key_type,
            key_city_id,
            key_qh_id,
            key_cb_id,
            key_name,
        })
        const keywordPromise = Keyword.findOne({key_id: id})
        const [dupKeyword, keyword] = await Promise.all([dupKeywordPromise,keywordPromise])
        if(!keyword) return functions.setError(res, 'Không tìm thấy thông tin')
        if(dupKeyword) return functions.setError(res, 'Nội dung bị trùng')
        await Keyword.updateOne({key_id: id}, {
            key_type,
            key_cate_id,
            key_city_id,
            key_qh_id,
            key_qh_kcn,
            key_cate_lq,
            key_cb_id,
            key_name,
            key_lq,
            key_teaser,
            key_tit,
            key_desc,
            key_key,
            key_h1,
            key_err,
            key_tdgy,
            key_ndgy,
        })
        return await functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// index
exports.indexTagManager = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const keyword = await Keyword.findOne({key_id: id})
        if(!keyword) return functions.setError(res, "Không tìm thấy thông tin keyword");
        if(keyword.key_index===1) await Keyword.updateOne({key_id: id},{key_index: 0})
        if(!keyword.key_index) await Keyword.updateOne({key_id: id},{key_index: 1})
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// detal
exports.detailTagManager = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const keyword = await Keyword.findOne({key_id: id})
        if(!keyword) return functions.setError(res, 'Không tìm thấy thông tin')
        return functions.success(res, "Thao tác thành công", {keyword})
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// delete
exports.deleteTagManager = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const keyword = await Keyword.findOne({key_id: id})
        if(!keyword) return functions.setError(res, 'Không tìm thấy thông tin')
        await Keyword.deleteOne({key_id: id})
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}