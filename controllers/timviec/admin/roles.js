const TV365AdminRoleI = require('../../../models/Timviec365/Admin/AdminRoles/AdminRoleI')
const TV365AdminRoleII = require('../../../models/Timviec365/Admin/AdminRoles/AdminRoleII')
const TV365AdminRoleIII = require('../../../models/Timviec365/Admin/AdminRoles/AdminRoleIII')
const TV365Decentralization = require('../../../models/Timviec365/Admin/AdminRoles/decentralization')
const functions = require("../../../services/functions");
const roleServices = require("../../../services/timviec365/admin/roleServices");



const getRoles = async(req, res) => {
    const data1 = await TV365AdminRoleI.find({})
    const data2 = await TV365AdminRoleII.find({})
    const data3 = await TV365AdminRoleIII.find({})
    return res.status(200).json({
        data: {
            roleI: data1,
            roleII: data2,
            roleIII: data3
        }
    })
}

const addRole1 = async(req, res) => {
    const data = req.body;
    try {
        let maxId = await functions.getMaxID(TV365AdminRoleI);
        if (!maxId) {
            maxId = 0;
        }
        let _id = Number(maxId) + 1;
        const roleI = await TV365AdminRoleI.create({
            // _id: null,
            _id: _id,
            name: data.content,
            order: data.order,
        })
        return res.status(200).json({
            status: 'success',
            roleI,
        });
    } catch (error) {
        return res.status(404).send(error.message);
    }
}
const addRole2 = async(req, res) => {
    const data = req.body;
    try {
        let maxId = await functions.getMaxID(TV365AdminRoleII);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const roleII = await TV365AdminRoleII.create({
            _id: _id,
            name: data.content,
            order: data.order,
            parent_id: data.parent_id,
        })
        return res.status(200).json({
            status: 'success',
            roleII,
        });
    } catch (error) {
        return res.status(404).send(error.message);
    }
}
const addRole3 = async(req, res) => {
    const data = req.body;
    try {
        let maxId = await functions.getMaxID(TV365AdminRoleIII);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const roleIII = await TV365AdminRoleIII.create({
            _id: _id,
            name: data.content,
            order: data.order,
            parent_id: data.parent_id,
        })
        return res.status(200).json({
            status: 'success',
            roleIII,
        });
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

const updateRole = async(req, res) => {
    const data = req.body;
    try {
        const findRoleId = TV365AdminRoleIII.findOne({ _id: data.id });
        if (findRoleId) {
            await TV365AdminRoleIII.updateOne({ _id: data.id }, { path: data.path })
            return res.status(200).send('role updated successfully')
        } else {
            return res.status(404).send('Can not find role!');
        }
    } catch (error) {
        return res.status(404).send(error.message);
    }
}


// Lấy ra quyền các cấp của admin
const getAllRoles = async(req, res) => {
    const data = req.body
    try {
        const roles = await TV365AdminRoleI.aggregate([{
                $sort: { order: 1 },
            },
            {
                $lookup: {
                    from: 'TV365AdminRoleII',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'roleII',
                },
            },
            {
                $unwind: {
                    path: '$roleII',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'TV365AdminRoleIII',
                    localField: 'roleII._id',
                    foreignField: 'parent_id',
                    as: 'roleII.roleIII',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    order: { $first: '$order' },
                    roleII: { $push: '$roleII' },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    order: 1,
                    roleII: {
                        _id: 1,
                        name: 1,
                        order: 1,
                        parent_id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        roleIII: 1,
                    },
                },
            },
        ]);

        return functions.success(res, "Danh sách quyền admin", {
            data: {
                roleI: roles
            }
        });
    } catch (error) {
        return functions.success(res, 'Không tìm thấy quyền admin');
    }
}


// Lấy ra các thông số quyền của người dùng thông qua Collection TV365Decentralization, sau đó dùng data trả về của hàm này truyền vào hàm getUserRoles
const getDetailsRole = async(req, res) => {
    const data = req.body;
    try {
        user = await TV365Decentralization.findOne({ userId: data.userId })
        if (user) {
            const detailsRole = await TV365Decentralization.findOne({ userId: data.userId }).select({
                userId: 1,
                roleI: 1,
                roleII: 1,
                roleIII: 1,
                _id: 0
            })
            return res.status(200).json({ data: detailsRole })
        } else {
            return res.status(404).send(error.message);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Lấy ra quyền của người dùng
const getUserRoles = async(req, res) => {
    const data = req.body;
    try {

        user = await TV365Decentralization.findOne({ userId: Number(data.userId) });
        let dataRole = {};
        if (user) {
            const detailsRole = await TV365Decentralization.findOne({ userId: data.userId }).select({
                userId: 1,
                roleI: 1,
                roleII: 1,
                roleIII: 1,
                _id: 0
            })

            roleI = detailsRole.roleI;
            roleII = detailsRole.roleII;
            roleIII = detailsRole.roleIII;
            dataRole = { roleI, roleII, roleIII };
        } else {
            return res.status(404).send('Can not find user');
        }

        // Tạo một mảng để lưu trữ các bản ghi roleI
        const userRoles = [];

        // Tìm tất cả các bản ghi của TV365AdminRoleI có _id trong roleI
        const roleIRecords = await TV365AdminRoleI.find({ _id: { $in: roleI } });

        // Lặp qua tất cả các bản ghi TV365AdminRoleI
        for (const roleIRecord of roleIRecords) {
            // Tạo một đối tượng roleI mới với các thuộc tính từ roleIRecord
            const roleIObject = {
                _id: roleIRecord._id,
                name: roleIRecord.name,
                order: roleIRecord.order,
                roleII: [], // Mảng để lưu trữ các bản ghi roleII
            };

            // Tìm tất cả các bản ghi của TV365AdminRoleII có parent_id tương ứng với _id của roleIRecord
            const roleIIRecords = await TV365AdminRoleII.find({ parent_id: roleIRecord._id });

            // Lặp qua tất cả các bản ghi TV365AdminRoleII
            for (const roleIIRecord of roleIIRecords) {
                // Kiểm tra xem _id của roleIIRecord có nằm trong danh sách roleII không
                if (roleII.includes(roleIIRecord._id)) {
                    // Nếu có, thì thêm roleIIRecord vào mảng roleII của roleIObject

                    // Tạo một đối tượng roleII mới với các thuộc tính từ roleIIRecord
                    const roleIIObject = {
                        _id: roleIIRecord._id,
                        name: roleIIRecord.name,
                        order: roleIIRecord.order,
                        parent_id: roleIIRecord.parent_id,
                        roleIII: [], // Mảng để lưu trữ các bản ghi roleIII
                    };
                    // Tìm tất cả các bản ghi của TV365AdminRoleIII có parent_id tương ứng với _id của roleIIRecord
                    const roleIIIRecords = await TV365AdminRoleIII.find({
                        parent_id: Number(roleIIRecord._id),
                        _id: { $in: roleIII }, // Lọc theo roleIII: [1, 2, 82, 83]
                    });

                    // Lặp qua tất cả các bản ghi TV365AdminRoleIII
                    for (const roleIIIRecord of roleIIIRecords) {
                        // Tạo một đối tượng roleIII mới với các thuộc tính từ roleIIIRecord
                        const roleIIIObject = {
                            _id: roleIIIRecord._id,
                            name: roleIIIRecord.name,
                            order: roleIIIRecord.order,
                            parent_id: roleIIIRecord.parent_id,
                            createdAt: roleIIIRecord.createdAt,
                            updatedAt: roleIIIRecord.updatedAt,
                            path: roleIIIRecord.path,
                        };

                        // Thêm roleIIIObject vào mảng roleIII của roleIIObject
                        roleIIObject.roleIII.push(roleIIIObject);
                    }

                    // Thêm roleIIObject vào mảng roleII của roleIObject
                    roleIObject.roleII.push(roleIIObject);
                }
            }

            // Thêm roleIObject vào mảng userRoles
            userRoles.push(roleIObject);
        }

        return functions.success(res, "Danh sách quyền admin", {
            data: {
                roleI: userRoles,
                dataRole: dataRole
            }
        });
    } catch (error) {
        console.log(error);
        return functions.success(res, 'Không tìm thấy quyền admin');
    }
};


// Thêm mới người dùng cùng với quyền
const addDecentralization = async(req, res) => {
    const data = req.body;
    try {
        await TV365Decentralization.create({
            userId: data.userId,
            roleI: data.roleI,
            roleII: data.roleII,
            roleIII: data.roleIII
        })
        return res.status(200).send('Success')
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Thêm sửa các quyền của người dùng trong Collection quản lý phân quyền
const addRoles = async(req, res) => {
    const data = req.body;

    roleI = roleServices.stringToNumberArray(data.roleI);
    roleII = roleServices.stringToNumberArray(data.roleII);
    roleIII = roleServices.stringToNumberArray(data.roleIII);
    try {
        const userId = data.userId;

        // Tìm bản ghi có userId tương ứng
        const existingUser = await TV365Decentralization.findOne({ userId });

        if (existingUser) {
            // Sử dụng addToSet để thêm giá trị mới vào mảng mà không ghi đè lên nó
            let update = {}
            if (roleI) {
                update.roleI = roleI;
            }
            if (roleII) {
                update.roleII = roleII;
            }
            if (roleIII) {
                update.roleIII = roleIII;
            }
            // Lưu bản ghi đã cập nhật
            await TV365Decentralization.updateOne({ userId }, {
                $set: update
            });
        } else {
            // Nếu userId chưa tồn tại, tạo mới bản ghi
            await TV365Decentralization.create({
                userId: data.userId,
                roleI: roleI,
                roleII: roleII,
                roleIII: roleIII,
            });
        }
        const detailsRole = await TV365Decentralization.findOne({ userId: data.userId }).select({
            userId: 1,
            roleI: 1,
            roleII: 1,
            roleIII: 1,
            _id: 0
        })
        return functions.success(res, "Thêm quyền admin thành công", {
            data: detailsRole
        });
    } catch (error) {
        return functions.success(res, 'Không thể thêm quyền admin');
    }
}


const deleteDetailsRole = async(req, res) => {
    const data = req.body;
    roleI = roleServices.stringToNumberArray(data.roleI);
    roleII = roleServices.stringToNumberArray(data.roleII);
    roleIII = roleServices.stringToNumberArray(data.roleIII);
    try {
        // Tìm bản ghi cụ thể với userId đã cho
        const user = await TV365Decentralization.findOne({ userId: data.userId });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Xóa các giá trị trong roleI đã chỉ định từ mảng roleI
        if (roleI && roleI.length > 0) {
            user.roleI = user.roleI.filter(role => !roleI.includes(role));
        }

        // Xóa các giá trị trong roleII đã chỉ định từ mảng roleII
        if (roleII && roleII.length > 0) {
            user.roleII = user.roleII.filter(role => !roleII.includes(role));
        }

        // Xóa các giá trị trong roleIII đã chỉ định từ mảng roleIII
        if (roleIII && roleIII.length > 0) {
            user.roleIII = user.roleIII.filter(role => !roleIII.includes(role));
        }

        // Lưu lại bản ghi
        await user.save();

        const detailsRole = await TV365Decentralization.findOne({ userId: data.userId }).select({
            userId: 1,
            roleI: 1,
            roleII: 1,
            roleIII: 1,
            _id: 0
        })
        return functions.success(res, "Xóa quyền admin thành công", {
            data: detailsRole
        });
    } catch (error) {
        return functions.success(res, 'Không thể xóa quyền admin');
    }
};


const CUDRoles = async(req, res) => {
    const data = req.body;

    roleI = roleServices.stringToNumberArray(data.roleI);
    roleII = roleServices.stringToNumberArray(data.roleII);
    roleIII = roleServices.stringToNumberArray(data.roleIII);
    try {
        const userId = data.userId;

        // Tìm bản ghi có userId tương ứng
        const existingUser = await TV365Decentralization.findOne({ userId });

        if (existingUser) {
            // Sử dụng addToSet để thêm giá trị mới vào mảng mà không ghi đè lên nó
            if (roleI) {
                existingUser.roleI = roleI;
            }
            if (roleII) {
                existingUser.roleII = roleII;
            }
            if (roleIII) {
                existingUser.roleIII = roleIII;
            }

            // Lưu bản ghi đã cập nhật
            await existingUser.save();
        } else {
            // Nếu userId chưa tồn tại, tạo mới bản ghi
            await TV365Decentralization.create({
                userId: data.userId,
                roleI: roleI,
                roleII: roleII,
                roleIII: roleIII,
            });
        }
        const detailsRole = await TV365Decentralization.findOne({ userId: data.userId }).select({
            userId: 1,
            roleI: 1,
            roleII: 1,
            roleIII: 1,
            _id: 0
        })
        return functions.success(res, "Thêm quyền admin thành công", {
            data: detailsRole
        });
    } catch (error) {
        return functions.success(res, 'Không thể thêm quyền admin');
    }
}




module.exports = {
    getRoles,
    addRole1,
    addRole2,
    addRole3,
    updateRole,
    getAllRoles,
    getUserRoles,
    addDecentralization,
    addRoles,
    getDetailsRole,
    deleteDetailsRole,
    CUDRoles,
};