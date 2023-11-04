const TimeSheets = require('../../models/qlc/TimeSheets')
const CC365_Cycle = require('../../models/qlc/Cycle')
const functions = require('../../services/functions')
const calEmp = require('../../models/qlc/CalendarWorkEmployee')
const Users = require('../../models/Users')
const EmployeeDevice = require('../../models/qlc/EmployeeDevice')
const CompanyWebIP = require('../../models/qlc/CompanyWebIP')
const Tracking = TimeSheets
const moment = require('moment-timezone')
const Shifts = require('../../models/qlc/Shifts')

//thêm chấm công
exports.CreateTracking = async(req, res) => {
    try {
        const user = req.user.data
        if (user.type == 2) {
            const ep_id = user.idQLC,
                com_id = user.com_id,
                {
                    ts_image,
                    device,
                    uuid_device,
                    name_device,
                    ts_lat,
                    ts_long,
                    ts_location_name,
                    wifi_name,
                    wifi_ip,
                    wifi_mac,
                    shift_id,
                    note,
                    bluetooth_address,
                    is_location_valid,
                    from,
                } = req.body

            if (
                ts_image &&
                device &&
                ts_lat &&
                ts_long &&
                ts_location_name &&
                wifi_name &&
                wifi_ip &&
                wifi_mac &&
                shift_id &&
                bluetooth_address &&
                note
            ) {
                // Lấy thông tin công ty
                const company = await Users.findOne({
                        idQLC: com_id,
                        type: 1,
                    })
                    .select('inForCompany.cds.id_way_timekeeping')
                    .lean()

                let is_success = 1,
                    error = '',
                    status = 1

                if (company) {
                    if (is_location_valid) {
                        error = 'Phạm vi bán kính không hợp lệ'
                        is_success = 0
                        if (from != 'cc365') {
                            error = `${from}, Phạm vi bán kính không hợp lệ`
                        }
                    }

                    if (uuid_device) {
                        // Kiểm tra thiết bị lạ
                        let type_device = 0
                        const qr_device = await EmployeeDevice.findOne({
                                ep_id: ep_id,
                                type_device: type_device,
                            })
                            // Nếu đã có thiết bị trước đó lưu lại rồi thì kiểm tra
                        if (qr_device) {
                            const current_device = qr_device.current_device
                                // Nếu thiết bị chấm công khác với thiết bị chấm công gần nhất được duyệt thì cập nhật
                            if (current_device != uuid_device) {
                                status = 2
                                await EmployeeDevice.updateOne({ ed_id: qr_device.ed_id }, {
                                    $set: {
                                        new_device: uuid_device,
                                        new_device_name: name_device,
                                    },
                                })
                            }
                        }
                        // Không thì lưu lại
                        else {
                            const MaxDevice = await EmployeeDevice.findOne({}, { ed_id: 1 })
                                .sort({ ed_id: -1 })
                                .limit(1)
                                .lean()
                            let ed_id = 1
                            if (MaxDevice) ed_id = Number(MaxDevice.ed_id) + 1
                            const NewEmployeeDevice = new EmployeeDevice({
                                ed_id: ed_id,
                                ep_id: ep_id,
                                current_device: current_device,
                                current_device_name: name_device,
                                type_device: type_device,
                            })
                            await NewEmployeeDevice.save()
                        }
                    }

                    // Lưu lại lịch sử điểm danh
                    let sheet_id = 1
                    let maxId = await Tracking.findOne({}, { sheet_id: 1 })
                        .sort({ sheet_id: -1 })
                        .limit(1)
                        .lean()
                    if (maxId) {
                        sheet_id = Number(maxId.sheet_id) + 1
                    }

                    const tracking = new Tracking({
                        sheet_id: sheet_id,
                        ep_id: ep_id,
                        ts_com_id: com_id,
                        ts_image: ts_image,
                        at_time: new Date(),
                        device: device,
                        ts_lat: ts_lat,
                        ts_long: ts_long,
                        ts_location_name: ts_location_name,
                        wifi_name: wifi_name,
                        wifi_ip: wifi_ip,
                        wifi_mac: wifi_mac,
                        shift_id: shift_id,
                        status: status,
                        bluetooth_address: bluetooth_address,
                        ts_error: error,
                        is_success: is_success,
                        note: note,
                    })
                    await tracking.save()
                    return functions.success(res, 'Điểm danh thành công', { tracking })
                }
                return functions.setError(res, 'Công ty không tồn tại')
            } else {
                return functions.setError(res, 'Chưa truyền đầy đủ thông tin')
            }
        }
        return functions.setError(res, 'Tài khoản không hợp lệ')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Lưu lại lịch sử chấm công khi chấm công trên web
exports.SaveForWeb = async(req, res) => {
    try {
        const user = req.user.data
        if (user.type == 2) {
            const com_id = user.com_id
            const { ts_lat, ts_long, wifi_ip, shift_id, type } = req.body
            if (shift_id && type) {
                const qr_list = await CompanyWebIP.findOne({
                    com_id: com_id,
                    type: type,
                    status: 1,
                }).lean()
                const qr_list_ip = await CompanyWebIP.findOne({
                    com_id: com_id,
                    type: type,
                    ip_address: wifi_ip,
                    status: 1,
                })
                const qr_fw = await Users.findOne({ idQLC: com_id, type: 1 }, { 'inForCompany.cds.type_timekeeping': 1 }).lean()
                let check_id_way_n
                const check_type = type == 1 ? 6 : 7
                if (qr_fw && qr_fw.inForCompany) {
                    const id_way_n = qr_fw.inForCompany.cds.type_timekeeping
                        .split(',')
                        .map(Number)
                    check_id_way_n = id_way_n.indexOf(check_type)
                }
                if (!qr_list || qr_list_ip || check_id_way_n == -1) {
                    const max = await TimeSheets.findOne({}, { sheet_id: 1 })
                        .sort({ sheet_id: -1 })
                        .lean()
                    const item = new TimeSheets({
                        sheet_id: Number(max.sheet_id) + 1,
                        ep_id: user.idQLC,
                        at_time: Date.now(),
                        device: 'web',
                        ts_lat: ts_lat,
                        ts_long: ts_long,
                        wifi_ip: wifi_ip,
                        shift_id: shift_id,
                        is_success: 1,
                        ts_error: '',
                        ts_location_name: '',
                        note: '',
                        ts_com_id: com_id,
                    })
                    await item.save()
                    return functions.success(res, 'Điểm danh thành công', {
                        name: user.userName,
                    })
                }
                return functions.setError(res, 'Địa chỉ IP điểm danh không hợp lệ')
            }
            return functions.setError(
                res,
                'Thiếu ca làm việc hoặc hình thức chấm công'
            )
        }
        return functions.setError(res, 'Tài khoản không phải tài khoản nhân viên')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}




exports.SaveForWebComp = async(req, res) => {
    try {
        const user = req.user.data
        if (user.type == 1) {
            const com_id = user.com_id;
            let time = new Date();
            if (req.body.time) {
                time = new Date(req.body.time);
            }
            const { ts_lat, ts_long, wifi_ip, shift_id, type, idQLC } = req.body
            if (shift_id && type) {
                const qr_list = await CompanyWebIP.findOne({
                    com_id: com_id,
                    type: type,
                    status: 1,
                }).lean()
                const qr_list_ip = await CompanyWebIP.findOne({
                    com_id: com_id,
                    type: type,
                    ip_address: wifi_ip,
                    status: 1,
                })
                const qr_fw = await Users.findOne({ idQLC: idQLC, type: 1 }, { 'inForCompany.cds.type_timekeeping': 1 }).lean()
                let check_id_way_n
                const check_type = type == 1 ? 6 : 7
                if (qr_fw && qr_fw.inForCompany) {
                    const id_way_n = qr_fw.inForCompany.cds.type_timekeeping
                        .split(',')
                        .map(Number)
                    check_id_way_n = id_way_n.indexOf(check_type)
                }
                if (!qr_list || qr_list_ip || check_id_way_n == -1) {
                    const max = await TimeSheets.findOne({}, { sheet_id: 1 })
                        .sort({ sheet_id: -1 })
                        .lean()

                    const currentDate = new Date()

                    const item = new TimeSheets({
                        sheet_id: Number(max.sheet_id) + 1,
                        ep_id: idQLC,
                        at_time: time,

                        device: 'web',
                        ts_lat: ts_lat,
                        ts_long: ts_long,
                        wifi_ip: wifi_ip,
                        shift_id: shift_id,
                        is_success: 1,
                        ts_error: '',
                        ts_location_name: '',
                        note: '',
                        ts_com_id: com_id,
                    })
                    await item.save()
                    return functions.success(res, 'Điểm danh thành công', {
                        name: user.userName,
                    })
                }
                return functions.setError(res, 'Địa chỉ IP điểm danh không hợp lệ')
            }
            return functions.setError(
                res,
                'Thiếu ca làm việc hoặc hình thức chấm công'
            )
        }
        return functions.setError(res, 'Tài khoản không phải tài khoản công ty')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.EmployeeHome = async(req, res) => {
    try {
        const user = req.user.data
        let { begin_time, end_search_time, time_chart_begin, time_chart_end } =
        req.body
        if (begin_time && end_search_time) {
            const idQLC = Number(user.idQLC)

            /*
                  Xử lý lấy ra đi muộn
                  - Giả sử $start_date và $end_date là hai biến chứa ngày bắt đầu và ngày kết thúc
                  - Chuyển các chuỗi ngày thành đối tượng Date
                  */

            const begin = new Date(begin_time)
            const end = new Date(end_search_time)

            // Sử dụng vòng lặp while để thực hiện từng ngày từ start_date đến end_date
            const currentDate = new Date(begin)
            let is_enough_work, only_checkin, only_checkout
            let is_late, is_early, late, late_second, early, early_second
            let count_late = 0
            let time_keeping_not_invalid = 0
            let count_success = 0
            while (currentDate <= end) {
                // Thực hiện công việc với ngày hiện tại
                const list_child = await TimeSheets.aggregate([{
                        $match: {
                            ep_id: idQLC,
                            $and: [{
                                    at_time: {
                                        $gt: new Date(
                                            `${moment(currentDate).format('YYYY-MM-D')}T00:00:00Z`
                                        ),
                                    },
                                },
                                {
                                    at_time: {
                                        $lt: new Date(
                                            `${moment(currentDate).format('YYYY-MM-D')}T23:59:59Z`
                                        ),
                                    },
                                },
                            ],
                        },
                    },
                    // { $sort: { at_time: -1, shift_id: -1 } },
                    {
                        $lookup: {
                            from: 'QLC_Shifts',
                            foreignField: 'shift_id',
                            localField: 'shift_id',
                            as: 'shift',
                        },
                    },
                    { $unwind: '$shift' },
                    {
                        $project: {
                            sheet_id: 1,
                            at_time: 1,
                            shift_id: '$shift.shift_id',
                            shift_name: '$shift.shift_name',
                            start_time: '$shift.start_time',
                            end_time: '$shift.end_time',
                            num_to_calculate: '$shift.num_to_calculate',
                            is_overtime: '$shift.is_overtime',
                            is_success: 1,
                        },
                    },
                ])
                let arr_by_shift_id = {}
                for (let index = 0; index < list_child.length; index++) {
                    const element = list_child[index]
                    const { shift_id } = element

                    // Nếu shift_id đã tồn tại trong đối tượng arr_by_shift_id
                    if (arr_by_shift_id.hasOwnProperty(shift_id)) {
                        // Thêm phần tử vào mảng tương ứng với shift_id
                        arr_by_shift_id[shift_id].push(element)
                    } else {
                        // Nếu shift_id chưa tồn tại, khởi tạo một mảng mới và thêm phần tử vào đó
                        arr_by_shift_id[shift_id] = [element]
                    }

                    // Nếu điểm danh thành công thì cộng lên 1
                    if (element.is_success == 1) count_success++
                        else time_keeping_not_invalid++
                }
                arr_by_shift_id = Object.values(arr_by_shift_id)
                arr_by_shift_id.forEach((sheet) => {
                    const start_time = sheet[0]['start_time']
                    const end_time = sheet[0]['end_time']
                    const date_check_in = new Date(sheet[0]['at_time'])
                        // Lấy giờ, phút và giây từ đối tượng Date
                    const hour = date_check_in.getHours().toString().padStart(2, '0')
                    const minute = date_check_in.getMinutes().toString().padStart(2, '0')
                    const second = date_check_in.getSeconds().toString().padStart(2, '0')
                        // Kết hợp thành định dạng "h:i:s"
                    const time_check_in = `${hour}:${minute}:${second}`

                    const date_check_out = new Date(sheet[sheet.length - 1]['at_time'])
                        // Lấy giờ, phút và giây từ đối tượng Date
                    const hour_check_out = date_check_out
                        .getHours()
                        .toString()
                        .padStart(2, '0')
                    const minute_check_out = date_check_out
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')
                    const second_check_out = date_check_out
                        .getSeconds()
                        .toString()
                        .padStart(2, '0')
                        // Kết hợp thành định dạng "h:i:s"
                    const time_check_out = `${hour_check_out}:${minute_check_out}:${second_check_out}`

                    is_enough_work = true
                    only_checkin = false
                    only_checkout = false

                    if (sheet.length == 1) {
                        is_enough_work = false
                        if (
                            Math.abs(time_check_in - start_time) <
                            Math.abs(time_check_out - end_time)
                        ) {
                            only_checkin = true
                        } else {
                            only_checkout = true
                        }
                    }

                    is_late = false
                    is_early = false

                    late = 0
                    late_second = 0
                    early = 0
                    early_second = 0

                    //Nếu đủ công check in và check out
                    if (is_enough_work) {
                        //Nhân viên đi muộn
                        if (time_check_in > start_time) {
                            late += Math.floor((time_check_in - start_time) / 60)
                            late_second += time_check_in - start_time
                            is_late = true
                        }

                        //NV về sớm
                        if (time_check_out < end_time) {
                            early += Math.floor((end_time - time_check_out) / 60)
                            early_second += end_time - time_check_out
                            is_early = true
                        }
                    } else {
                        //Nhân ko đủ công và chỉ chấm 1 lần, nếu là chấm giờ gần với check in, thì là quên check out, thì lấy giờ check in và so sánh với start time xem có đi muộn không
                        if (only_checkin) {
                            if (time_check_in > start_time) {
                                late += Math.floor((time_check_in - start_time) / 60)
                                late_second += time_check_in - start_time
                                is_late = true
                            }
                        } else {
                            //Nếu chỉ check out
                            //Kiểm tra NV về sớm
                            if (time_check_out < end_time) {
                                early += Math.floor((end_time - time_check_out) / 60)
                                early_second += end_time - time_check_out
                                is_early = true
                            }
                        }
                    }

                    if (is_late || is_early) {
                        count_late++
                    }
                })

                // Tăng ngày hiện tại lên 1 ngày
                currentDate.setDate(currentDate.getDate() + 1)
            }
            // Kết thúc xử lý đi muộn

            // Xử lý số lần chấm công trong tuần
            const chart_begin = new Date(time_chart_begin)
            const chart_end = new Date(time_chart_end)
                // Sử dụng vòng lặp while để thực hiện từng ngày từ start_date đến end_date
            const currentDateChart = new Date(chart_begin)
            const resultChart = []
            const history = []

            const list_time_sheet = await TimeSheets.aggregate([{
                    $match: {
                        ep_id: idQLC,
                    },
                },
                { $sort: { at_time: -1 } },
                { $limit: 100 },
                {
                    $lookup: {
                        from: 'QLC_Shifts',
                        foreignField: 'shift_id',
                        localField: 'shift_id',
                        as: 'shift',
                    },
                },
                { $unwind: '$shift' },
                {
                    $project: {
                        sheet_id: 1,
                        at_time: 1,
                        shift_name: '$shift.shift_name',
                        is_success: 1,
                    },
                },
                { $sort: { at_time: 1 } },
            ])
            return functions.success(res, 'Thành công', {
                count_late,
                time_keeping_not_invalid,
                count_success,
                resultChart,
                history: list_time_sheet
            })
        }
        return functions.setError(
            res,
            'Chưa truyền đầy đủ thông tin bắt đầu và kết thúc'
        )
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Set current date TimeStamp, eg: '1666512804163'
// TimeStamp: new Date().getTime().toString()

// Display saved TimeStamp, eg: '23/10/2022'
// new Date(parseInt(TimeStamp)).toLocaleDateString()

exports.getListUserTrackingSuccess = async(req, res) => {
    try {
        //const page = req.body.page || 1;
        //const pageSize = req.body.pageSize || 30;
        const request = req.body;
        let com_id = request.com_id;
        //shift_id = request.shift_id
        at_time = request.at_time || true;
        let inputNew = new Date(request.inputNew);
        let inputOld = new Date(request.inputOld);


        if (com_id == undefined) {
            return functions.setError(res, 'lack of input')
        } else {
            const data = await Tracking.find({ ts_com_id: com_id, at_time: { $gte: inputOld, $lte: inputNew } }, {
                    sheet_id: 1,
                    shift_id: 1,
                    ep_id: 1,
                    at_time: 1,
                })
                .sort({ at_time: -1 })
                //.skip((page - 1) * pageSize)
                //.limit(pageSize)
                .lean()
            let listUserId = []
            let dataTimeSheet = []
            for (let i = 0; i < data.length; i++) {
                if (!listUserId.find((e) => e == data[i].ep_id)) {
                    listUserId.push(data[i].ep_id)
                }
                if (!dataTimeSheet.find((e) => e.ep_id == data[i].ep_id)) {

                    const shift = await Shifts.findOne({ shift_id: data[i].shift_id })

                    dataTimeSheet.push({
                        ep_id: data[i].ep_id,
                        time: data[i].at_time,
                        shift_id: data[i].shift_id,
                        shift_name: shift ? shift.shift_name : 'Ca làm việc không tồn tại'

                    })
                }
            }
            let listUser = await Users.find({
                idQLC: { $in: listUserId },
                type: 2,
            }).lean()

            if (data) {
                //lấy thành công danh sách NV đã chấm công
                return await functions.success(res, 'Lấy thành công', {
                    dataTimeSheet,
                    listUser,
                })
            }
            return functions.setError(res, 'Không có dữ liệu', 404)
        }
    } catch (err) {
        console.log(err)
        return functions.setError(res, err.message)
    }
}

function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1.idQLC) === JSON.stringify(obj2.idQLC)
}

function removeSimilarElements(data, data2) {
    const newArray = data.filter(
        (item1) => !data2.some((item2) => compareObjects(item1, item2))
    )

    return newArray.concat(
        data2.filter((item2) => !data.some((item1) => compareObjects(item1, item2)))
    )
}

//LỌC PHẦN TỬ LẶP LẠI
function compare(personA, personB) {
    return (
        personA.idQLC === personB.idQLC && personA.shift_id === personB.shift_id
    )
}

// danh sách nhân viên chưa chấm công của ca đấy trong ngày hôm đấy
exports.getlistUserNoneHistoryOfTracking = async(req, res) => {
    const pageNumber = req.body.pageNumber || 1
    let at_time = req.body.at_time || true
    let inputNew = new Date(req.body.inputNew) || null
    let inputOld = new Date(req.body.inputOld) || null
    let com_id = Number(req.body.com_id)
    let shift_id = req.body.shift_id
        //ta tìm danh sách lịch sử nhân viên của công ty đã chấm công
        // xử lý thời gian => Lấy phổ rộng nhất có thể
    let start_date = new Date(inputNew.getFullYear(), inputNew.getMonth())
    start_date = new Date(start_date.setSeconds(start_date.getSeconds() - 1))
    let end_date = new Date(inputOld.getFullYear(), inputOld.getMonth() + 1, 1, 7)
    end_date = new Date(end_date.setSeconds(end_date.getSeconds() + 1))
    let list_ep = []
    let listEm = await Users.find({ 'inForPerson.employee.com_id': com_id }, { idQLC: 1 }).lean()
    for (let i = 0; i < listEm.length; i++) {
        list_ep.push(listEm[i].idQLC)
    }
    const data = await Tracking.find({
            ts_com_id: com_id,
            shift_id: shift_id,
            at_time: { $gte: inputNew, $lte: inputOld },
        }, {
            sheet_id: 1,
            shift_id: 1,
            ep_id: 1,
        }).lean()
        //ta tìm danh sách nhân viên đã có lịch làm việc của công ty
    const data2 = await calEmp
        .find({ com_id: com_id, shift_id: shift_id }, {
            sheet_id: 1,
            shift_id: 1,
            ep_id: 1,
        })
        .lean()

    // dữ liệu lịch làm việc
    let list_cy_detail = await CC365_Cycle.aggregate([{
            $lookup: {
                from: 'CC365_EmployeCycle',
                localField: 'cy_id',
                foreignField: 'cy_id',
                as: 'CC365_EmployeCycle',
            },
        },
        {
            $match: {
                $and: [
                    { 'CC365_EmployeCycle.ep_id': { $in: list_ep } },
                    { apply_month: { $gte: start_date } },
                    { apply_month: { $lte: end_date } },
                    { com_id: com_id },
                ],
            },
        },
        {
            $project: {
                cy_id: 1,
                cy_detail: 1,
                apply_month: 1,
                'CC365_EmployeCycle.ep_id': 1,
            },
        },
    ])
    let list_detail = [] //thông tin ca của từng ngày
    for (let i = 0; i < list_cy_detail.length; i++) {
        let array = JSON.parse(list_cy_detail[i].cy_detail)
        for (let j = 0; j < array.length; j++) {
            if (array[j].shift_id) {
                let date = new Date(Number(array[j].date.split('-')[0]), Number(array[j].date.split('-')[1]) - 1, Number(array[j].date.split('-')[2]), 7);
                if (array[j].shift_id.includes(',')) {
                    let array_shift = array[j].shift_id.split(',')
                    for (let k = 0; k < array_shift.length; k++) {
                        list_detail.push({
                            shift_id: Number(array_shift[k]),
                            date,
                            ep_id: list_cy_detail[i].CC365_EmployeCycle[0].ep_id,
                        })
                    }
                } else {
                    list_detail.push({
                        shift_id: Number(array[j].shift_id),
                        date,
                        ep_id: list_cy_detail[i].CC365_EmployeCycle[0].ep_id,
                    })
                }
            }
        }
    }
    // dữ liệu lịch làm việc của ca trong ngày đó
    list_detail = list_detail.filter(
        (e) => e.date.getDate() == inputNew.getDate() && e.shift_id == shift_id
    )
    let listUserIdNoTimeSheet = []
    for (let i = 0; i < list_detail.length; i++) {
        let check = data.find((e) => e.ep_id == list_detail[i].ep_id)
        if (!check) {
            if (list_ep.find((e) => e == list_detail[i].ep_id)) {
                listUserIdNoTimeSheet.push(list_detail[i].ep_id)
            }
        }
    }
    let listUserNoTimeSheet = await Users.find({ idQLC: { $in: listUserIdNoTimeSheet } }, { password: 0 }).lean()
    return await functions.success(res, 'Lấy thành công', { listUserNoTimeSheet })

    // const ketQua = removeSimilarElements(data, data2);

    // let newData = functions.arrfil(ketQua, compare);

    // const pageSize = 20;
    // const startIndex = (pageNumber - 1) * pageSize;
    // const endIndex = pageNumber * pageSize;
    // const results = newData.slice(startIndex, endIndex);

    // if (newData) { //lấy thành công danh sách NV
    //     return await functions.success(res, 'Lấy thành công', { results, pageNumber });
    // }
    // return functions.setError(res, 'Không có dữ liệu', 404);
}

exports.getlist = async(req, res) => {
    try {
        // const com_id = req.user.data.com_id
        const pageNumber = req.body.pageNumber || 1
        const request = req.body
        let idQLC = request.idQLC
        com_id = Number(request.com_id)
        dep_id = Number(request.dep_id)
        inputNew = request.inputNew
        inputOld = request.inputOld
        let data = []
        let listCondition = {}

        if (com_id) listCondition.com_id = com_id
        if (idQLC) listCondition.idQLC = idQLC
        if (dep_id) listCondition.dep_id = dep_id
        if (inputNew && inputOld)
            listCondition['at_time'] = { $gte: inputOld, $lte: inputNew }
            // const data = await Tracking.find({com_id: com_id, at_time: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC ts_location_name at_time shift_id status  ').skip((pageNumber - 1) * 20).limit(20).sort({ at_time : -1});
        data = await Tracking.find(listCondition)
            .select('sheet_id ep_id ts_location_name at_time shift_id status  ')
            .skip((pageNumber - 1) * 20)
            .limit(20)
            .sort({ sheet_id: -1 })
        if (data) {
            return await functions.success(res, 'Lấy thành công', { data })
        }
        return functions.setError(res, 'Không có dữ liệu', 404)
    } catch (err) {
        functions.setError(res, err.message)
    }
}

//tách dòng chấm công
exports.splitTimeKeeping = async(req, res) => {
    try {
        let ep_id = Number(req.body.ep_id)
        let fromDate = req.body.fromDate
        let toDate = req.body.toDate
        let tokenTinhLuong = req.body.tokenTinhLuong
        let fromDateObject = new Date(fromDate);
        let toDateObject = new Date(toDate)
        let month = fromDateObject.getMonth() + 1
        let year = fromDateObject.getFullYear()

        let findUser = await Users.findOne({ _id: ep_id }, { idQLC: 1, "inForPerson.employee.com_id": 1, type: 1 }).lean()

        let com_id = findUser.inForPerson.employee.com_id

        if (findUser && findUser.type == 2) {
            //1: Không tách dòng
            //2:  Theo công chuẩn: Nếu 1 tháng nhân sự áp dụng nhiều mức công chuẩn khác nhau thì bảng chấm công sẽ tách dòng của nhân sự đó
            //(hiện tại cty chưa có luồng một tháng áp dụng nhiều công chuẩn, bên tính lương sẽ tính công chuẩn được cập nhật cuối cùng)
            //3:  Theo vị trí, phòng ban: Khi vị trí hoặc phòng ban của nhân sự thay đổi trong tháng thì bảng chấm công sẽ tách dòng của nhân sự đó
            //4:  Theo lương vị trí: Trong 1 tháng nhân sự được thay đổi mức lương theo vị trí thì bảng chấm công sẽ tách dòng của nhân sự đó
            //5:  Lương phụ cấp: Trong 1 tháng nhân sự được thay đổi mức phụ cấp thì bảng chấm công sẽ tách dòng của nhân sự đó
            //6:  Theo hợp đồng lao động: Trong 1 tháng nhân sự thay đổi loại hợp đồng thì bảng chấm công sẽ tách dòng của nhân sự đó
            let timeSheet = await axios.post('https://tinhluong.timviec365.vn/api_app/company/tbl_timekeeping_manager.php', qs.stringify({
                'token': tokenTinhLuong,
                'id_comp': com_id,
                'id_emp': findUser.idQLC,
                'month': month,
                'year': year
            }));

            const type = req.body.type
            if (type == 1) {
                return await functions.success(res, 'Lấy thành công', { timeSheet: timeSheet.data.data });
            } else if (type == 2) {
                return await functions.success(res, 'Chưa có luồng nhiều công chuẩn trong 1 tháng', { timeSheet: timeSheet.data.data });
            } else if (type == 3) {
                let listCondition = {};
                if (ep_id) listCondition.ep_id = Number(ep_id);
                if (fromDate && !toDate) listCondition.created_at = { $gte: new Date(fromDate) };
                if (toDate && !fromDate) listCondition.created_at = { $lte: new Date(toDate) };
                if (toDate && fromDate) listCondition.created_at = { $gte: new Date(fromDate), $lte: new Date(toDate) };

                let listAppoint = await Appoint.find(listCondition)

                let arrChange = []
                for (let i = 0; i < listAppoint.length; i++) {
                    arrChange.push(listAppoint[i].created_at)
                }

                return await functions.success(res, 'Lấy thành công', { timeSheet: timeSheet.data.data, data: arrChange });
            } else if (type == 4) {
                let condition = { sb_id_com: com_id };
                if (findUser.idQLC) condition.sb_id_user = findUser.idQLC;
                if (fromDate && !toDate) condition.sb_time_up = { $gte: new Date(fromDate) };
                if (toDate && !fromDate) condition.sb_time_up = { $lte: new Date(toDate) };
                if (fromDate && toDate) condition.sb_time_up = { $gte: new Date(fromDate), $lte: new Date(toDate) };

                let dataLuong = await Salary.find(condition).sort({ sb_time_up: -1 });

                let arrChange = []
                for (let i = 0; i < dataLuong.length; i++) {
                    arrChange.push(dataLuong[i].sb_time_up)
                }

                return await functions.success(res, 'Lấy thành công', { timeSheet: timeSheet.data.data, data: arrChange });
            } else if (type == 5) {
                return await functions.success(res, 'Chưa có luồng thay đổi phụ cấp', { timeSheet: timeSheet.data.data });
            } else if (type == 6) {
                // thời điểm lớn hơn thời điểm bắt đầu hợp đồng 
                const time = new Date(toDate);

                let data_contract = await Tinhluong365Contract.find({
                    con_id_user: findUser.idQLC,
                    con_time_end: { $lte: toDateObject }
                }, {
                    con_time_up: 1,
                    con_time_end: 1,
                }).sort({ con_time_up: -1 }).lean();
                let arrChange = []
                for (let i = 0; i < data_contract.length; i++) {
                    let ojb = {}
                    ojb.startTime = data_contract[i].con_time_up,
                        ojb.endTime = data_contract[i].con_time_end,

                        arrChange.push(ojb)
                }

                return await functions.success(res, 'Lấy thành công', { timeSheet: timeSheet.data.data, data: arrChange, });
            }
            return functions.setError(res, "Không đúng type")
        } else return functions.setError(res, "không có user này hoặc user ko phải là nhân viên")
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.get_history_time_keeping_by_company = async(req, res) => {
    try {
        const user = req.user.data;
        const page = req.body.page || 1,
            pageSize = req.body.pageSize || 30;
        const type = req.body.type;
        const ep_id = req.body.ep_id;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const com_id = Number(user.com_id);

        let match = {
            ts_com_id: com_id
        };
        if (ep_id) {
            match.ep_id = Number(ep_id);
        }

        if (start_date && !end_date) match.at_time = { $gte: new Date(`${start_date} 00:00:00`) };
        if (!start_date && end_date) match.at_time = { $lte: new Date(`${end_date} 23:59:59`) };
        if (start_date && end_date) match.at_time = { $gte: new Date(`${start_date} 00:00:00`), $lte: new Date(`${end_date} 23:59:59`) };

        if (type == 'timekeeping_qr') {
            match.ts_image = "";
        }
        const list = await TimeSheets.aggregate([{
                $match: match
            },
            { $sort: { at_time: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idQLC",
                    localField: "ep_id",
                    as: "user",
                }
            },
            { $unwind: "$user" },
            { $match: { "user.type": { $ne: 1 } } },
            {
                $lookup: {
                    from: "QLC_Shifts",
                    localField: "shift_id",
                    foreignField: "shift_id",
                    as: "shift"
                }
            },
            { $unwind: "$shift" },
            {
                $project: {
                    _id: 0,
                    sheet_id: 1,
                    ep_id: 1,
                    ts_image: 1,
                    at_time: 1,
                    device: 1,
                    ts_location_name: 1,
                    wifi_name: 1,
                    wifi_ip: 1,
                    wifi_mac: 1,
                    shift_id: 1,
                    ts_com_id: 1,
                    note: 1,
                    bluetooth_address: 1,
                    status: 1,
                    ts_error: 1,
                    is_success: 1,
                    ep_name: "$user.userName",
                    ep_gender: "$user.inForPerson.account.gender",
                    shift_name: "$shift.shift_name"
                }
            },
        ]);
        let total = 0;
        if (list.length > 0) {
            const countTimeSheet = await TimeSheets.aggregate([{
                    $match: match
                },
                {
                    $group: {
                        _id: "$ep_id",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        foreignField: "idQLC",
                        localField: "_id",
                        as: "user",
                    }
                },
                { $unwind: "$user" },
                { $match: { "user.type": { $ne: 1 } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$count" }
                    }
                }
            ]);
            total = countTimeSheet[0].total;
        }
        return functions.success(res, "Danh sách chấm công khuôn mặt", {
            totalItems: total,
            items: list
        });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error);
    }
}