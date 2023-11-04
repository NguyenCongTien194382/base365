const CalendarWorkEmployee = require("../../models/qlc/CalendarWorkEmployee")
const functions = require("../../services/functions")

//lấy tất cả lịch làm việc nhân viên
exports.getAllCalendarEmp = async(req, res) => {
    try {
        const company = req.user.data;

    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
    await functions.getDatafind(CalendarWorkEmployee, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};
//lấy danh sách nv có lịch làm việc 
exports.getCalendarById = async(req, res) => {

    try {
        const _id = req.params.id;
        // const companyID = req.user.data.companyID
        const data = await functions.getDatafindOne(CalendarWorkEmployee, { _id: _id });
        if (data) {
            return await functions.success(res, 'Lấy lich thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };

}

//lấy danh sách lịch làm việc của nhân viên theo cty
exports.getAllCalendarEmpByCom = async(req, res) => {
    const companyID = req.body.companyID
    const calendarID = req.body.calendarID
    if (!companyID) {
        await functions.setError(res, 'thiếu dữ liệu công ty')
    } else {

        const data = await CalendarWorkEmployee.find({ companyID: companyID }).select("calendarID ")
        if (!data) {
            return functions.setError(res, "không tìm thấy lịch làm việc cuẩ công ty")
        } else {
            return functions.success(res, "lấy dữ liệu thành công", { dat })
        }
    }
}

//tạo danh sách cho nhân viên cho lịch làm việc
exports.createCalendarWorkEmployee = async(req, res) => {
    // const email = req.user.data.email;
    const { idQLC, companyID, calendarID, timeApply, Detail, shiftID } = req.body;
    if (!idQLC) {
        functions.setError(res, "idQLC required")
    } else if (isNaN(idQLC)) {
        functions.setError(res, "idQLC must be a number ")
    } else if (!companyID) {
        functions.setError(res, "companyID required")
    } else if (isNaN(companyID)) {
        functions.setError(res, "companyID not a number")
    } else if (!calendarID) {
        functions.setError(res, "calendarID required")
    } else if (isNaN(calendarID)) {
        functions.setError(res, "calendarID not a number")
    } else if (!timeApply) {
        functions.setError(res, "timeApply required")
    } else {
        let maxID = await functions.getMaxID(CalendarWorkEmployee);
        if (!maxID) {
            maxID = 0
        }


        const tApply = timeApply != 0 ? new Date(timeApply * 1000) : null
        const empCal = new CalendarWorkEmployee({
            _id: Number(maxID) + 1,
            idQLC: idQLC,
            companyID: companyID,
            calendarID: calendarID,
            shiftID: shiftID,
            timeApply: tApply,
            Detail: Detail
        })
        await empCal.save()
            .then(() => { functions.success(res, 'creat successful', { empCal }) })
            .catch(err => functions.setError(res, err.message, 509))
    }
};
//sửa danh sách 
exports.editCalendar = async(req, res) => {

        const _id = req.body.id;
        if (isNaN(_id)) {
            functions.setError(res, "Id must be a number");
        } else {
            const { companyID, calendarID, timeApply, idQLC, Detail, } = req.body;

            if (!idQLC) {
                functions.setError(res, "idQLC required")
            } else if (isNaN(idQLC)) {
                functions.setError(res, "idQLC must be a number ")
            } else if (!companyID) {
                functions.setError(res, "companyID required")
            } else if (isNaN(companyID)) {
                functions.setError(res, "companyID not a number")
            } else if (!calendarID) {
                functions.setError(res, "calendarID required")
            } else if (isNaN(calendarID)) {
                functions.setError(res, "calendarID not a number")
            } else if (!timeApply) {
                functions.setError(res, "timeApply required")
            } else {

                const tApply = timeApply != 0 ? new Date(timeApply * 1000) : null

                const calendar = await functions.getDatafindOne(CalendarWorkEmployee, { _id: _id });
                if (!calendar) {
                    functions.setError(res, "Calendar does not exist");
                } else {
                    await functions.getDatafindOneAndUpdate(CalendarWorkEmployee, { _id: _id }, {
                            idQLC: idQLC,
                            companyID: companyID,
                            calendarID: calendarID,
                            timeApply: tApply,
                            Detail: Detail
                        })
                        .then((data) => functions.success(res, "Calendar edited successfully", data))
                        .catch((err) => functions.setError(res, err.message));
                }
            }
        }
    }
    //Xóa một lịch làm việc đã có sẵn

exports.deleteCalendar = async(req, res) => {
        const _id = req.body.id;

        if (isNaN(_id)) {
            functions.setError(res, "Id must be a number");
        } else {
            const calendar = await functions.getDatafindOne(CalendarWorkEmployee, { _id: _id });
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDataDeleteOne(CalendarWorkEmployee, { _id: _id })
                    .then(() => functions.success(res, "Delete calendar successfully", calendar))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
    //Xóa toàn bộ lịch làm việc của một công ty

exports.deleteCompanyCalendar = async(req, res) => {
        const { companyID } = req.body;
        if (!companyID) {
            functions.setError(res, "Company id required");
        } else if (typeof companyID == "number") {
            functions.setError(res, "Company id must be a number");
        } else {
            const calendars = await functions.getDatafind(CalendarWorkEmployee, { companyID: companyID });
            if (!calendars) {
                await functions.setError(res, "No calendars found in this company");
            } else {
                await CalendarWorkEmployee.deleteMany({ companyID: companyID })
                    .then(() => functions.success(res, "Calendars deleted successfully", calendars))
                    .catch((err) => functions.setError(res, err.message))
            }
        }
    }
    //Xóa toàn bộ lịch làm việc của hệ thống

exports.deleteAllCalendars = async(req, res) => {
    if (!await functions.getMaxID(CalendarWorkEmployee)) {
        functions.setError(res, "No Calendar existed")
    } else {
        CalendarWorkEmployee.deleteMany()
            .then(() => functions.success(res, "Delete all calendars successfully"))
            .catch(err => functions.setError(res, err.message))
    }
};