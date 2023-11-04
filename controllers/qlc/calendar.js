const Calendar = require("../../models/qlc/Calendar");
const CalendarOfEmp = require("../../models/qlc/CalendarWorkEmployee");
const functions = require("../../services/functions");
const Users = require("../../models/Users");

// const shift_id = require("../../models/Users")
//Lấy danh sách toàn bộ lịch làm việc

exports.getAllCalendarCompany = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
            const _id = req.body._id;
            let condition = {}
            let total_emp = {}

            if (_id) condition._id = _id
            if (com_id) condition.com_id = com_id
            const data = await Calendar.find(condition).lean();
            if (data) {
                const calendarID = data.map(item => item._id);
                for (let i = 0; i < calendarID.length; i++) {
                    const cId = calendarID[i];
                    total_emp = await functions.findCount(CalendarOfEmp, { com_id: com_id, calendar_id: cId })

                    if (total_emp) data.total_emp = total_emp
                }
                return functions.success(res, 'tạo thành công ', { data })
            }
            return functions.setError(res, 'không tìm thấy lịch làm việc')
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (error) {
        functions.setError(res, error.message);
    }
}

//Tạo một lịch làm việc mới
exports.create = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { cy_name, apply_month, cy_detail, is_personal } = req.body;
            if (cy_name && apply_month && cy_detail) {
                // Kiểm tra tên llv đã tồn tại hay chưa
                const check_cy_name = await Calendar.findOne({ cy_name: cy_name, com_id: com_id, apply_month: apply_month });
                if (!check_cy_name) {
                    // Tạo mới
                    const calendar_max = await Calendar.findOne({}, { cy_id: 1 }).sort({ cy_id: -1 }).lean();
                    const calendar = new Calendar({
                        cy_id: Number(calendar_max.cy_id) + 1,
                        com_id: com_id,
                        cy_name: cy_name,
                        apply_month: apply_month,
                        cy_detail: cy_detail,
                        is_personal: is_personal
                    })
                    await calendar.save();
                    return functions.success(res, "Lưu lịch làm việc thành công");
                }
                return functions.setError(res, "Lịch làm việc trong tháng đã tồn tại");
            }
            return functions.setError(res, "nhập thiếu tên lịch làm việc, tháng áp dụng, chi tiết");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

//Chỉnh sửa một lịch làm việc đã có sẵn
exports.editCalendar = async(req, res) => {
        try {
            const com_id = req.user.data.com_id
                // const com_id = req.body.com_id
            const type = req.user.data.type
            const _id = req.body._id;
            if (type == 1) {

                const { com_id, calendarName, typeCalender, timeApply, timeStart, calendarDetail, shift_id } = req.body;

                const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
                if (calendar) {
                    await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                        com_id: com_id,
                        shift_id: shift_id || 0,
                        calendarName: calendarName,
                        typeCalender: typeCalender,
                        timeApply: timeApply,
                        timeStart: timeStart,
                        isCopy: false,
                        timeCopy: null,
                        calendarDetail: calendarDetail
                    })
                    return functions.success(res, "Calendar edited successfully", { calendar })
                }
                return functions.setError(res, "Calendar does not exist");
            }
            return functions.setError(res, "Tài khoản không phải Công ty", 604);
        } catch (error) {
            return functions.setError(res, error.message)
        }

    }
    //Copy một lịch làm việc đã có sẵn

exports.copyCalendar = async(req, res) => {
        try {
            const com_id = req.user.data.com_id
                // const com_id = req.body.com_id
            const type = req.user.data.type
            const _id = req.body._id;
            if (type == 1) {
                const calendar = await functions.getDatafindOne(Calendar, { com_id: com_id, _id: _id });
                if (calendar) {
                    let maxId = await functions.getMaxID(Calendar);
                    if (!maxId) {
                        maxId = 0;
                    }
                    const newId = Number(maxId) + 1;
                    const newCalendar = new Calendar({
                        ...calendar,
                        _id: newId,
                    })
                    await newCalendar.save()
                    return functions.success(res, "Calendar copied successfully", { newCalendar });
                }
                return functions.setError(res, "Calendar does not exist");
            }
            return functions.setError(res, "Tài khoản không phải Công ty", 604);
        } catch (error) {
            return functions.setError(res, error.message)
        }

    }
    //Xóa một lịch làm việc đã có sẵn

exports.deleteCalendar = async(req, res) => {
        try {
            const com_id = req.user.data.com_id
                // const com_id = req.body.com_id
            const type = req.user.data.type
            const _id = req.body._id;
            if (type == 1) {
                const calendar = await functions.getDatafindOne(Calendar, { com_id: com_id, _id: _id });
                if (calendar) {
                    await functions.getDataDeleteOne(Calendar, { com_id: com_id, _id: _id })
                    return functions.success(res, "Delete calendar successfully", { calendar })
                }
                return functions.setError(res, "Calendar does not exist");
            }
            return functions.setError(res, "Tài khoản không phải Công ty", 604);
        } catch (error) {
            return functions.setError(res, error.message)
        }
    }
    //Xóa toàn bộ lịch làm việc của một công ty

exports.deleteCompanyCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {

            const calendars = await functions.getDatafind(Calendar, { com_id: com_id });
            if (calendars) {
                await Calendar.deleteMany({ com_id: com_id })
                return functions.success(res, "Calendars deleted successfully", { calendars })
            }
            return functions.setError(res, "No calendars found in this company");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
}