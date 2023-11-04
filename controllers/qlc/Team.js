const Team = require('../../models/qlc/Team');
const functions = require("../../services/functions");
const Users = require("../../models/Users")

//tìm kiếm danh sách tổ

exports.list = async(req, res) => {
    try {
        let com_id = req.body.com_id;
        let dep_id = req.body.dep_id;
        let team_id = req.body.team_id;
        if (com_id) {
            const page = req.body.page || 1,
                pageSize = req.body.pageSize || 10;
            let condition = { com_id: Number(com_id) };
            if (team_id) condition.team_id = Number(team_id);
            if (dep_id) condition.dep_id = Number(dep_id);

            // data = await Team.find(condition).select(' team_id com_id teamName dep_id createdAt ').sort({ team_id: -1 }).lean();
            const data = await Team.aggregate([
                { $match: condition },
                { $sort: { team_id: -1 } },
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "QLC_Deparments",
                        foreignField: "dep_id",
                        localField: "dep_id",
                        as: "deparment",
                    }
                },
                { $unwind: "$deparment" },
                {
                    $project: {
                        _id: 0,
                        team_id: 1,
                        team_name: 1,
                        dep_id: "$deparment.dep_id",
                        dep_name: "$deparment.dep_name",
                    }
                }
            ]);

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                element.total_emp = await Users.countDocuments({
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.team_id": element.team_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active"
                });
                const manager = await Users.findOne({
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.team_id": element.team_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active",
                    "inForPerson.employee.position_id": 13,
                }, { userName: 1 });
                element.manager = (manager) ? manager.userName : "";

                const deputy = await Users.findOne({
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.dep_id": element.dep_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active",
                    "inForPerson.employee.position_id": 12,
                }, { userName: 1 });
                element.deputy = (deputy) ? deputy.userName : "";
            }

            return functions.success(res, 'Lấy thành công', { data });
        }
        return functions.setError(res, 'Chưa truyền id công ty', 404);
    } catch (err) {
        functions.setError(res, err.message)
    }
};


//Tạo mới dữ liệu của một tổ
exports.createTeam = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const type = req.user.data.type
        let now = new Date()
        if (type == 1) {
            const { dep_id, team_name } = req.body;
            if (com_id && dep_id && team_name) {
                //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
                let maxID = await Team.findOne({}, {}, { sort: { team_id: -1 } }).lean() || 0;
                const team = new Team({
                    team_id: Number(maxID.team_id) + 1 || 1,
                    com_id: com_id,
                    dep_id: dep_id,
                    team_name: team_name
                });
                await team.save()
                return functions.success(res, "Tạo thành công", { team })
            }
            return functions.setError(res, "nhập thiếu thông tin");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
};
//Chỉnh sửa dự liệu của một tổ
exports.editTeam = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { team_id, dep_id, team_name } = req.body
            const team = await functions.getDatafindOne(Team, { com_id: com_id, team_id: team_id });
            if (team) {
                await functions.getDatafindOneAndUpdate(Team, { com_id: com_id, team_id: team_id }, {
                    com_id: com_id,
                    dep_id: dep_id,
                    team_name: team_name,
                })
                return functions.success(res, "Sửa thành công", { team })
            }
            return functions.setError(res, "Tổ không tồn tại");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
//Xóa dữ liệu của một tổ cua 1 cty
exports.deleteTeam = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { team_id, dep_id } = req.body
            if (com_id && team_id) {
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.team_id": team_id }, { $set: { "inForPerson.employee.team_id": 0 } })

                const team = await functions.getDatafindOne(Team, { com_id: com_id, team_id: team_id });
                if (team) {
                    functions.getDataDeleteOne(Team, { com_id: com_id, team_id: team_id })
                    return functions.success(res, "xóa thành công", { team })
                }
                return functions.setError(res, "Tổ không tồn tại", 610);
            }
            return functions.setError(res, "thiếu thông tin id tổ cần xóa");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }

};