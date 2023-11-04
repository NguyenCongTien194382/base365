const functions = require('../../services/functions');
const Mail365 = require('../../models/Timviec365/Mail365/Mail365');
const DanhMucMail365 = require('../../models/Timviec365/Mail365/Mail365Category');
const TblFooter = require('../../models/Timviec365/TblFooter');
const Mail365NTD = require('../../models/Timviec365/Mail365/Mail365NTD');
const M365SaveMember = require('../../models/Timviec365/Mail365/SaveMember');
const services = require('../../services/timviec365/mail365');
// api trang chủ
exports.home = async(req, res) => {
    const parent = req.body.parent || 1;
    const list = await DanhMucMail365.find({
            status: 1,
            parent: parent,
        }).select("id name alias")
        .limit(9)
        .lean();
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const listChild = await Mail365.find({
                status: 1,
                image: { $ne: '' },
                cid: element.id
            })
            .select("id image title alias")
            .sort({ id: -1 })
            .limit(2)
            .lean();
        for (let i = 0; i < listChild.length; i++) {
            const child = listChild[i];
            child.image = services.getUrlImage(child.image);
        }
        element.listChild = listChild;
    }
    const category = await DanhMucMail365.find({ status: 1, parent: { $ne: 0 } })
        .select("id name alias parent")
        .sort({ sort: -1 }).limit(15).lean();
    // console.log("home", req.body)
    return functions.success(res, 'Dữ liệu trang chủ', {
        data: list,
        category: category,
    });
}

exports.seo = async(req, res) => {
    const id = req.body.id;
    const seo = await TblFooter.findOne({ id: id }).lean();
    // console.log("seo", req.body)
    return functions.success(res, 'Dữ liệu trang chủ', { seo: seo });
}

exports.seo_category = async(req, res) => {
    const id = req.body.id;
    const parent = req.body.parent;
    let condition = { id: id };
    if (parent) {
        condition.parent = parent;
    }
    const seo = await DanhMucMail365.findOne(condition).lean();
    if (seo.content) {
        seo.content = functions.renderCDNImage(seo.content);
    }

    return functions.success(res, 'Dữ liệu trang chủ', { seo: seo });
}

// ds danh mục email trang chủ 
exports.getCategories = async(req, res, next) => {
    try {
        const type = req.body.type;
        let data;
        if (type == 'default') {
            data = await DanhMucMail365.find({ status: 1, parent: 0 }).sort({ sort: 1 }).lean();
        } else {
            data = await DanhMucMail365.find({ status: 1, parent: { $ne: 0 } }).sort({ sort: -1 }).limit(15).lean();
        }
        // console.log("getCategories", req.body);
        return functions.success(res, 'Thành công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// ds email theo mẫu
exports.findByCategory = async(req, res, next) => {
    try {
        const pageNumber = Number(req.body.pageNumber);
        const pageSize = Number(req.body.pageSize) || 12;
        const cateId = req.body.cateId;
        const skip = Number((pageNumber - 1) * pageSize);
        const data = await Mail365.find({ cid: cateId }).skip(skip).sort({ id: -1 }).limit(pageSize).lean();
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.review = services.getUrlImageReview(element.image);
            element.image = services.getUrlImage(element.image);
        }
        const count = await Mail365.countDocuments({ cid: cateId });
        return await functions.success(res, 'Thành công', { data, count });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// xem trước email
exports.preview = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await Mail365.findOne(_id).select('name image view');

        if (!data) return functions.setError(res, 'Không có dữ liệu', 404);

        await Mail365.updateOne(_id, { $set: { view: data.view + 1, } });
        return functions.success(res, 'Thành công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// chi tiết email
exports.detail = async(req, res, next) => {
    try {
        const user = req.user.data;
        const id = req.body.id;
        const data = await Mail365.findOne({
            id: id
        });

        if (data) {
            // await Mail365.updateOne(_id, { $set: { view: data.view + 1, } });
            return functions.success(res, 'Thành công', { data });
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

exports.save = async(req, res) => {
    try {
        const user = req.user.data;
        const { mid, html, html_send, guid } = req.body;
        const check = await Mail365NTD.findOne({
            usc_id: user.idTimViec365,
            mid: mid,
        });
        const data = {
            usc_id: user.idTimViec365,
            mid: mid,
            html: html,
            html_send: html_send,
            guid: guid
        };
        if (!check) {
            const item = await Mail365NTD.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean() || 0;
            data.id = Number(item.id) + 1;
            const newmail = new Mail365NTD(data);
            await newmail.save();
        } else {
            await Mail365NTD.updateOne({ id: check.id }, { $set: data });
        }
        return functions.success(res, 'Thành công');
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.save_member = async(req, res) => {
    try {
        const user = req.user.data;
        const { mid, names, emails } = req.body;
        const item = await M365SaveMember.findOne({
            usc_id: user.idTimViec365,
            mid: mid
        });
        let type;
        if (!item) {
            const item = new M365SaveMember({
                usc_id: user.idTimViec365,
                mid: mid,
                names: names,
                emails: emails
            });
            await item.save();
            type = "add";
        } else {
            await M365SaveMember.updateOne({
                usc_id: user.idTimViec365,
                mid: mid,
            }, {
                $set: {
                    names: names,
                    emails: emails
                }
            });
            type = "update";
        }
        return functions.success(res, "Thành công", {
            type: type
        });
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.list_save_member = async(req, res) => {
    try {
        const user = req.user.data;
        const { mid } = req.body;
        if (mid) {
            const list = await M365SaveMember.findOne({
                usc_id: user.idTimViec365,
                mid: mid
            });

            return functions.success(res, "Danh sách", { data: list });
        }
        return functions.setError(res, "Chưa truyền id");
    } catch (error) {
        console.log(error)
        return functions.setError(res, error);
    }
}

exports.detailUserMail = async(req, res) => {
    try {
        let user = req.user.data;
        let userid = user.idTimViec365;
        let id = req.body.id;
        if (userid && id) {
            let data = await Mail365NTD.aggregate([{
                $match: { usc_id: Number(userid), mid: Number(id) }
            }]);
            return await functions.success(res, 'Lấy thông tin thành công', { data });
        }
        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message)
    }
}

// cập nhập lượt download

exports.updateDownLoad = async(req, res) => {
    try {
        let user = req.user.data;
        let userid = user.idTimViec365;
        let idmail = req.body.id;
        if (userid && idmail) {
            let data = await Mail365.findOne({ id: Number(idmail) }, { download: 1 });
            if (data) {
                let tongdl = (data.download)
                let updownload = Number(tongdl + 1);
                let data2 = await Mail365.updateOne({ id: Number(idmail) }, { download: updownload })
                return await functions.success(res, 'Cập nhập thông tin thành công', { data2 });
            }
            return await functions.setError(res, 'Không tìm thấy mail');
        }
        return functions.setError(res, 'Thiếu trường truyền lên', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message)
    }
}