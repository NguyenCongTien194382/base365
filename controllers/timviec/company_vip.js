const company = require('../../models/Timviec365/UserOnSite/Company/CompanyVip');
const functions = require('../../services/functions');
const service = require('../../services/timviec365/company_vip');

exports.home = async(req, res) => {
    try {
        const page = req.body.page || 1,
            pageSize = req.body.pageSize || 20,
            getAll = req.body.getAll;

        let list;
        if (!getAll) {
            list = await company.find({}, { id: 1, name_com: 1, banner: 1, logo: 1, meta_des: 1, alias: 1, keyword: 1 })
                .sort({ id: 1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
        } else {
            list = await company.find({}, { id: 1, name_com: 1, banner: 1, logo: 1, meta_des: 1, alias: 1, keyword: 1 })
                .sort({ name_com: 1 })
                .lean();
        }

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            element.banner = service.getUrlImage(element.banner);
            element.logo = service.getUrlImage(element.logo);
        }

        const count = await company.countDocuments();

        return functions.success(res, "Danh sách", { data: list, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.detail = async(req, res) => {
    try {
        const { alias } = req.body;
        if (alias) {
            const detail = await company.findOne({ alias: alias }).lean();
            if (detail) {
                detail.banner = service.getUrlImage(detail.banner);
                detail.logo = service.getUrlImage(detail.logo);
                detail.content = functions.renderCDNImage(detail.content);
                return functions.success(res, "Chi tiết công ty vip", { detail });
            }
            return functions.setError(res, "Công ty không tồn tại");
        }
        return functions.setError(res, "Chưa truyền alias");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.search = async(req, res) => {
    try {
        const { search } = req.body;
        const list = await company.find({ name_com: { $regex: search, $options: "i" } }, {
            id: 1,
            name_com: 1,
            alias: 1
        });
        return functions.success(res, "kết quả tìm kiếm", { data: list })
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}