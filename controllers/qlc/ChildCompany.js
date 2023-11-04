const Users = require("../../models/Users")
const functions = require("../../services/functions")
const fnc = require("../../services/qlc/functions")
const md5 = require('md5');
//tìm danh sách công ty 
exports.getListCompany = async(req, res) => {
    try {
        const com_id = Number(req.user.data.com_id),
            type = req.user.data.type;
        if (type == 1) {
            // const data = await Users.find({ "inForCompany.cds.com_parent_id": com_id }).select('userName avatarUser idQLC com_id phone address email');
            const data = await Users.aggregate([{
                $match: { "inForCompany.cds.com_parent_id": com_id }
            }, {
                $project: {
                    _id: 0,
                    com_id: "$idQLC",
                    com_parent_id: "$inForCompany.cds.com_parent_id",
                    com_name: "$userName",
                    com_email: "$email",
                    com_phone_tk: "$phoneTK",
                    id_way_timekeeping: "$inForCompany.cds.id_way_timekeeping",
                    com_phone: "$phone",
                    com_logo: "$avatarUser",
                    com_address: "$address",
                    com_create_time: "$createdAt",
                }
            }]);

            const count = await Users.countDocuments({ "inForCompany.cds.com_parent_id": com_id })

            return functions.success(res, 'Lấy thành công', { totalItems: count, items: data });
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (err) {
        return functions.setError(res, err.message)
    }
};

//tạo công ty con
exports.createCompany = async(req, res) => {
    try {

        const com_id = req.user.data.com_id,
            type = req.user.data.type;

        const { com_parent_id, com_name, com_phone, com_email, com_address } = req.body;
        let File = req.files || null;
        let avatarUser = null;
        let now = functions.getTimeNow();
        if (type == 1) {

            if (com_name && com_phone && com_email && com_address) {
                const maxID = await functions.getMaxUserID("company");
                let _id = maxID._id,
                    data = {
                        _id: _id,
                        userName: com_name,
                        email: com_email,
                        alias: functions.renderAlias(com_name),
                        type: 1,
                        idQLC: maxID._idQLC,
                        idTimViec365: maxID._idTV365,
                        idRaoNhanh365: maxID._idRN365,
                        phone: com_phone,
                        address: com_address,
                        createdAt: now,
                        updatedAt: now,
                        fromWeb: "quanlychung",
                        role: 1,
                        password: md5('quanlychung365'),
                        chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                        "inForCompany.cds.com_parent_id": com_parent_id ? com_parent_id : com_id,
                    };

                if (com_parent_id) {
                    const check_com_parent = await Users.findOne({ idQLC: com_id, type: 1 }).lean();
                    if (!check_com_parent) {
                        return functions.setError(res, "Công ty mẹ không tồn tại");
                    }
                }

                if (File && File.avatarUser) {
                    //  const namefiles = req.files.avatarUser.originalFilename;
                    let upload = await fnc.uploadAvaComQLC(File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    data.avatarUser = upload
                }
                const company = new Users(data);
                await company.save()
                return functions.success(res, "Tạo thành công");
            }
            return functions.setError(res, "Thiếu thông tin truyền lên");

        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
// sửa công ty con 
exports.editCompany = async(req, res) => {
    try {
        const type = req.user.data.type
            // const com_id = req.user.data.com_id
        let com_id = req.body.com_id
        if (type == 1) {
            const { userName, phone, emailContact, address } = req.body;
            const company = await functions.getDatafindOne(Users, { idQLC: com_id, type: 1 });
            if (company) {
                await functions.getDatafindOneAndUpdate(Users, { idQLC: com_id, type: 1 }, {
                    userName: userName,
                    phone: phone,
                    emailContact: emailContact,
                    address: address,
                })
                return functions.success(res, "Chỉnh sửa thành công", { company })
            }
            return functions.setError(res, "không tìm thấy công ty ", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};