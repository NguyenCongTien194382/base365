const Shifts = require('../../models/qlc/Shifts');
const functions = require("../../services/functions");
const Cycle = require("../../models/qlc/Cycle");
const Users = require("../../models/Users");

//lấy danh sách ca làm việc
exports.getListShifts = async(req, res) => {
    try {
        const com_id = req.query.com_id || req.user.data.com_id;
        const list = await Shifts.find({
            com_id: com_id
        }).sort({ _id: -1 }).lean();
        const totalItems = await Shifts.countDocuments({ com_id: com_id });
        return functions.success(res, 'Danh sách ca làm việc của công ty', { totalItems, items: list });
    } catch (error) {
        return functions.setError(res, error);
    }
};

//lấy danh sách ca làm việc theo id
exports.getShiftById = async(req, res) => {
    try {
        const { shift_id } = req.body;
        if (shift_id) {
            const shift = await Shifts.findOne({
                shift_id: shift_id
            }).lean();
            if (shift) {
                return functions.success(res, "Lấy thông tin thành công", { shift });
            }
            return functions.setError(res, "Không tồn tại ca làm việc", 404);
        }
        return functions.setError(res, "Bạn chưa truyền lên id ca làm việc");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};


exports.createShift = async(req, res) => {
    try {
        const { shift_name, start_time, end_time, start_time_latest, end_time_earliest, shift_type, num_to_calculate, num_to_money, is_overtime, flexible } = req.body;
        if (req.user.data.type == 1) {
            const com_id = req.user.data.idQLC;

            const start_time_relax = req.body.start_time_relax
            const end_time_relax = req.body.end_time_relax
            const flex = req.body.flex

            if (shift_name && start_time && end_time && shift_type) {
                const check = await Shifts.findOne({ shift_name: shift_name, com_id: com_id }).lean();
                if (!check) {
                    const max = await Shifts.findOne({}, {}, { sort: { shift_id: -1 } }).lean() || 0;
                    if (start_time && end_time) {
                        const item = new Shifts({
                            shift_id: Number(max.shift_id) + 1 || 1,
                            com_id: com_id,
                            shift_name: shift_name,
                            start_time: start_time,
                            start_time_latest: start_time_latest,
                            end_time: end_time,
                            end_time_earliest: end_time_earliest,
                            shift_type: shift_type,
                            num_to_calculate: num_to_calculate,
                            num_to_money: num_to_money,
                            is_overtime: is_overtime,
                            "relaxTime.start_time_relax": start_time_relax,
                            "relaxTime.end_time_relax": end_time_relax,
                            flex: flex
                        });
                        await item.save();
                        return functions.success(res, 'tạo ca làm việc thành công');
                    }
                }
                return functions.setError(res, "Ca làm việc này đã được tạo");
            }
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        }
        return functions.setError(res, "Tài khoản không thể thực hiện chức năng này");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.editShift = async(req, res) => {
    try {
        if (req.user.data.type == 1) {
            const { shift_id, shift_name, start_time, end_time, start_time_latest, end_time_earliest, shift_type, num_to_calculate, num_to_money, is_overtime } = req.body;
            const com_id = req.user.data.idQLC;

            const start_time_relax = req.body.start_time_multiple
            const end_time_relax = req.body.end_time_multiple
            const flex = req.body.flex

            if (shift_id) {
                const shift = await functions.getDatafindOne(Shifts, { shift_id: shift_id });
                if (shift) {
                    await Shifts.updateOne({ shift_id: shift_id, com_id: com_id }, {
                        $set: {
                            shift_name: shift_name,
                            start_time: start_time,
                            end_time: end_time,
                            start_time_latest: start_time_latest,
                            end_time_earliest: end_time_earliest,
                            shift_type: shift_type,
                            num_to_calculate: num_to_calculate,
                            num_to_money: num_to_money,
                            is_overtime: is_overtime,
                            "relaxTime.start_time_relax": start_time_relax,
                            "relaxTime.end_time_relax": end_time_relax,
                            flex: flex
                        }
                    });
                    return functions.success(res, "Cập nhật thành công");
                }
                return functions.setError(res, "Ca làm việc không tồn tại");
            }
            return functions.setError(res, "Chưa truyền id ca làm việc");
        }
        return functions.setError(res, "Tài khoản không thể thực hiện chức năng này");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.deleteShiftCompany = async(req, res) => {
    try {
        const com_id = req.body.com_id || req.user.data.com_id;
        let shift_id = req.body.shift_id;
        const shifts = await functions.getDatafind(Shifts, { com_id: com_id, shift_id: shift_id });
        if (shifts) {
            await Shifts.deleteOne({ com_id: com_id, shift_id: shift_id });
            return functions.success(res, "xoá thành công");
        }
        return functions.setError(res, "không tìm thấy ca làm việc của công ty");
    } catch (e) {
        return functions.setError(res, e.message);
    }

}

exports.list_shift_user = async(req, res) => {
    try {
        const id_use = Number(req.body.u_id);
        const id_com = Number(req.body.c_id);
        if (id_com && id_use) {
            const date = new Date();
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            const dateNow = functions.convertDate(null, true).replaceAll('/', '-');
            const user = await Users.aggregate([{
                $match: {
                    idQLC: id_use,
                    type: 2,
                    "inForPerson.employee.com_id": id_com
                }
            }, {
                $project: {
                    ep_name: "$userName"
                }
            }]);
            if (user) {
                const candidate = user[0];
                const db_cycle = await Cycle.aggregate([{
                        $lookup: {
                            from: "CC365_EmployeCycle",
                            localField: "cy_id",
                            foreignField: "cy_id",
                            as: "employee_cycle"
                        }
                    },
                    { $unwind: "$employee_cycle" },
                    {
                        $match: {
                            "employee_cycle.ep_id": id_use,
                            apply_month: {
                                $gte: new Date(`${y}-${m}-01 00:00:00`),
                                $lte: new Date(`${dateNow} 23:59:59`)
                            }
                        }
                    },
                    {
                        $sort: { "employee_cycle.update_time": -1 }
                    },
                    { $limit: 1 },
                    // {
                    //     $project: {
                    //         _id: 0,
                    //         cy_detail: 1,
                    //         ep_id: "$EmployeCycle.ep_id"
                    //     }
                    // }
                ]);

                let arr_shift_id = "";
                let arr_shift = [];
                if (db_cycle.length > 0) {
                    const cycle = db_cycle[0];
                    const detail_cy = JSON.parse(cycle.cy_detail);
                    for (let i = 0; i < detail_cy.length; i++) {
                        const element = detail_cy[i];
                        if (element.date == dateNow) {
                            arr_shift_id = element.shift_id;
                            break;
                        }
                    }
                    let list_shift = [];
                    if (arr_shift_id != "") {
                        list_shift = await Shifts.find({ shift_id: { $in: arr_shift_id.split(',').map(Number) } }).lean();
                    } else {
                        list_shift = await Shifts.find({ com_id: id_com }).lean();
                    }
                    let hour = date.getHours(),
                        minute = date.getMinutes(),
                        second = date.getSeconds();
                    hour = hour > 10 ? hour : `0${hour}`;
                    minute = minute > 10 ? minute : `0${minute}`;
                    second = second > 10 ? second : `0${second}`;
                    const hourNow = `${hour}:${minute}:${second}`;

                    for (let j = 0; j < list_shift.length; j++) {
                        const element = list_shift[j];
                        if ((element.start_time_latest <= hourNow && element.end_time_earliest >= hourNow) ||
                            element.start_time_latest == null ||
                            element.end_time_earliest == null ||
                            element.start_time_latest == '00:00:00' ||
                            element.start_time_latest == '00:00:00') {
                            arr_shift.push(element);
                        }

                    }

                    return await functions.success(res, "Thông tin ca làm việc khi chấm công", { ep_name: candidate.ep_name, shift: arr_shift, db_cycle });
                } else {
                    list_shift = await Shifts.find({ com_id: id_com }).lean()
                    return functions.success(
                        res,
                        'Thông tin ca làm việc khi chấm công', { ep_name: candidate.ep_name, shift: [...list_shift] }
                    )
                }
            }
            return functions.setError(res, "Nhân viên không tồn tại");
        }
        return functions.setError(res, "Thiếu data truyền lên");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}