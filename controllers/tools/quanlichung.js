const fnc = require("../../services/functions")
const settingIP = require("../../models/qlc/SettingIP")
const Deparment = require("../../models/qlc/Deparment")
const Group = require("../../models/qlc/Group")
const EmployeeDevice = require("../../models/qlc/EmployeeDevice")
const HisTracking = require("../../models/qlc/TimeSheets")
const Shifts = require("../../models/qlc/Shifts")
const ReportError = require("../../models/qlc/ReportError")
const Feedback = require("../../models/qlc/Feedback")
const CalendarWorkEmployee = require("../../models/qlc/CalendarWorkEmployee")
const Calendar = require("../../models/qlc/Calendar")
const Company = require("../../models/Users")
const CompanyCoordinate = require("../../models/qlc/CompanyCoordinate")
const CompanyWebIP = require("../../models/qlc/CompanyWebIP");
const CompanyWifi = require("../../models/qlc/TrackingWifi");
const axios = require('axios');
const FormData = require('form-data');
const moment = require('moment-timezone');
//pb: // 0: access_ip; 1: advisory; 2: appoint; 3: authentication; 4: check_qmk; 5: company;
// 6: company_coordinate; 7: company_web_ip; 8: company_wifi; 9: company_workday; 10: cycle; 11: delete_data_history; 12: department;
// 13: employee; 14: employee_cycle; 15: employee_device; 16: employee_history; 17: feedback_customer; 18: firebase_token; 19: groups;
// 20: log_access; 21: log_login; 22: notify_app; 23: permission; 24: question; 25: quit_job; 26: refresh_token; 27: report_error; 28: resign; 29: roles
//  30: send_notification; 31: shift; 32: time_sheets; 33: tranfer_job; 34:


//cài đặt IP
exports.toolsettingIP = async(req, res, next) => {

        try {
            let page = 1;
            let result = true;
            do {
                let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 0 })
                let data = listItems.data.items;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        const setIP = new settingIP({
                            id_acc: element.id_acc,
                            id_com: element.id_com,
                            ip_access: element.ip_access,
                            from_site: element.from_site,
                            created_time: element.created_time,
                            update_time: element.update_time,
                        });
                        await setIP.save();
                    }
                    page++;
                } else {
                    result = false;
                }
                console.log(page)
            } while (result);
            return fnc.success(res, 'Thành công')
        } catch (error) {
            console.log(error);
            return fnc.setError(res, error.message);
        }
    }
    //phòng ban
exports.toolDeparment = async(req, res, next) => {

        try {
            let page = 1;
            let result = true;
            do {
                let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 12 })
                let data = listItems.data.items;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        // const html = JSON.stringify(element.html);
                        let deparmentOrder = element.dep_order;
                        if (deparmentOrder == 0) {
                            deparmentOrder = null;
                        };
                        const department = new Deparment({
                            dep_id: element.dep_id,
                            com_id: element.com_id,
                            dep_name: element.dep_name,
                            manager_id: element.manager_id,
                            dep_create_time: element.dep_create_time,
                            dep_order: element.dep_order
                        })
                        await department.save();
                    }
                    page++;
                } else {
                    result = false;
                }
                console.log(page)
            } while (result);
            return fnc.success(res, 'Thành công')
        } catch (error) {
            console.log(error);
            return fnc.setError(res, error.message);
        }
    }
    //nhóm
exports.toolGroup = async(req, res, next) => {

        try {
            let page = 1;
            let result = true;
            do {
                let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 19 })
                let data = listItems.data.items;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        // const html = JSON.stringify(element.html);
                        // let deparmentOrder = element.dep_order;
                        // if (deparmentOrder == 0) {
                        //     deparmentOrder = null;
                        // };
                        const Groups = new Group({
                            _id: element.gr_id,
                            companyID: element.dep_id,
                            groupName: element.gr_name,
                            parentGroup: element.parent_gr,
                        })
                        await Groups.save();
                    }
                    page++;
                } else {
                    result = false;
                }
                console.log(page)
            } while (result);
            return fnc.success(res, 'Thành công')
        } catch (error) {
            console.log(error);
            return fnc.setError(res, error.message);
        }
    }
    //tài khoản cty
exports.toolCompany = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 5 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    // const html = JSON.stringify(element.html);
                    // let com_id_tv365 = element.com_id_tv365;
                    // if (com_id_tv365 == 0) {
                    //     com_id_tv365 = null;
                    // };
                    // let com_quantity_time = element.com_quantity_time;
                    // if (com_quantity_time == 0) {
                    //     com_quantity_time = null;
                    // };
                    const company = new Company({
                        _id: element.com_id,
                        "inForPerson.companyID": element.com_parent_id,
                        userName: element.com_name,
                        email: element.com_email,
                        phoneTK: element.com_phone_tk,
                        "inForCompany.type_timekeeping": element.type_timekeeping,
                        "inForCompany.id_way_timekeeping": element.id_way_timekeeping,
                        password: element.com_pass,
                        "inForCompany.comMd5": element.com_pass_encrypt,
                        phone: element.com_phone,
                        "inForCompany.com_email_lh": element.com_email_lh,
                        avatarUser: element.com_logo,
                        address: element.com_address,
                        "inForCompany.com_role_id": element.com_role_id,
                        "inForCompany.com_size": element.com_size,
                        "inForPerson.description": element.com_description,
                        createdAt: element.com_create_time,
                        updatedAt: element.com_update_time,
                        authentic: element.com_authentic,
                        latitude: element.com_lat,
                        longtitude: element.com_lng,
                        "inForCompany.com_path": element.com_path,
                        "inForCompany.base36_path": element.base36_path,
                        "inForCompany.com_qr_logo": element.com_qr_logo,
                        "inForCompany.enable_scan_qr": element.enable_scan_qr,
                        fromWeb: element.from_source,
                        "inForCompany.com_vip": element.com_vip,
                        "inForCompany.com_ep_vip": element.com_ep_vip,
                        "inForCompany.com_id_tv365": element.com_id_tv365,
                        "inForCompany.com_quantity_time": element.com_quantity_time,
                        "inForCompany.ep_crm": element.ep_crm,
                        "inForCompany.idKD": element.com_kd,


                    })
                    await company.save()
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}


//lịch làm việc chi tiết của nhân viên
exports.toolCTCalendarWorkEmployee = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 14 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const calendar = new CalendarWorkEmployee({
                        epcy_id: element.epcy_id,
                        ep_id: element.ep_id,
                        cy_id: element.cy_id,
                        update_time: element.update_time
                    })
                    await calendar.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

//lịch làm việc của nhân viên
exports.toolCalendarWorkEmployee = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 10 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];

                    const calendar = new Calendar({
                        cy_id: element.cy_id,
                        com_id: element.com_id,
                        cy_name: element.cy_name,
                        apply_month: element.apply_month,
                        cy_detail: element.cy_detail,
                        status: element.status,
                        is_personal: element.is_personal,
                    })
                    await calendar.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

//duyệt thiết bị 
exports.toolCheckDevice = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 15 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const device = new EmployeeDevice({
                        ed_id: element.ed_id,
                        ep_id: element.ep_id,
                        current_device: element.current_device,
                        current_device_name: element.current_device_name,
                        new_device: element.new_device,
                        new_device_name: element.new_device_name,
                        create_time: element.create_time,
                        type_device: element.type_device,
                    })
                    await device.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

//bao cao loi
exports.toolReportError = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 15 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    // const html = JSON.stringify(element.html);
                    // let deparmentOrder = element.dep_order;
                    // if (deparmentOrder == 0) {
                    //     deparmentOrder = null;
                    // };
                    const Report = new ReportError({
                        _id: element.ed_id,
                        idQLC: element.ep_id,
                        curDeviceId: element.current_device,
                        curDeviceName: element.current_device_name,
                        newDeviceId: element.new_device,
                        newDeviceName: element.new_device_name,
                        createdAt: element.create_time,
                        typeDevice: element.type_device,
                        // deparmentOrder,
                    })
                    await Report.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

// danh gia
exports.toolFeedback = async(req, res, next) => {

        try {
            let page = 1;
            let result = true;
            do {
                let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 17 })
                let data = listItems.data.items;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        // const html = JSON.stringify(element.html);
                        // let deparmentOrder = element.dep_order;
                        // if (deparmentOrder == 0) {
                        //     deparmentOrder = null;
                        // };
                        const Feedbacks = new Feedback({
                            _id: element.id,
                            idQLC: element.id_user,
                            type: element.type_user,
                            feed_back: element.feed_back,
                            rating: element.rating,
                            app_name: element.app_name,
                            createdAt: element.create_date,
                            from_source: element.from_source,
                            // deparmentOrder,
                        })
                        await Feedbacks.save();
                    }
                    page++;
                } else {
                    result = false;
                }
                console.log(page)
            } while (result);
            return fnc.success(res, 'Thành công')
        } catch (error) {
            console.log(error);
            return fnc.setError(res, error.message);
        }
    }
    //ca làm việc
exports.toolShifts = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 31 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    // const html = JSON.stringify(element.html);
                    // let deparmentOrder = element.dep_order;
                    // if (deparmentOrder == 0) {
                    //     deparmentOrder = null;
                    // };
                    const Shift = new Shifts({
                        shift_id: element.shift_id,
                        com_id: element.com_id,
                        create_time: element.create_time,
                        shift_name: element.shift_name,
                        start_time: element.start_time,
                        end_time: element.end_time,
                        end_time_earliest: element.end_time_earliest,
                        start_time_latest: element.start_time_latest,
                        shift_type: element.shift_type,
                        num_to_calculate: element.num_to_calculate,
                        num_to_money: element.num_to_money,
                        over_night: element.over_night,
                        is_overtime: element.is_overtime,
                        status: element.status,
                        // deparmentOrder,
                    })
                    await Shift.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}


//lịch sử chấm công
exports.toolHisTracking = async(req, res, next) => {
    try {
        // await HisTracking.deleteMany();
        // return fnc.success(res, 'Thành công');
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://chamcong.24hpay.vn/api_list_data/api_all.php', { page: page, pb: 32 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const tracking = new HisTracking({
                        sheet_id: element.sheet_id,
                        ep_id: element.ep_id,
                        ts_image: element.ts_image,
                        at_time: element.at_time,
                        device: element.device,
                        ts_lat: element.ts_lat,
                        ts_long: element.ts_long,
                        ts_location_name: element.ts_location_name,
                        wifi_name: element.wifi_name,
                        wifi_ip: element.wifi_ip,
                        wifi_mac: element.wifi_mac,
                        shift_id: element.shift_id,
                        ts_com_id: element.ts_com_id,
                        note: element.note,
                        bluetooth_address: element.bluetooth_address,
                        status: element.status,
                        ts_error: element.ts_error,
                        is_success: element.is_success
                    })
                    await tracking.save().then().catch();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.company_coordinate = async(req, res) => {
    try {
        const request = req.body;
        await CompanyCoordinate.deleteOne({ cor_id: request.cor_id });
        const item = new CompanyCoordinate({
            cor_id: request.cor_id,
            com_id: request.com_id,
            cor_location_name: request.cor_location_name,
            cor_lat: request.cor_lat,
            cor_long: request.cor_long,
            cor_radius: request.cor_radius,
            cor_create_time: request.cor_create_time,
            is_default: request.is_default,
            status: request.status,
            qr_logo: request.qr_logo,
            qr_status: request.qr_status
        });
        await item.save();
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.company_web_ip = async(req, res) => {
    try {
        const request = req.body;
        await CompanyWebIP.deleteOne({ ip_id: request.ip_id });
        const item = new CompanyWebIP({
            ip_id: request.ip_id,
            name_ip: request.name_ip,
            com_id: request.com_id,
            ip_address: request.ip_address,
            type: request.type,
            create_time: request.create_time,
            is_default: request.is_default,
            status: request.status,
        });
        await item.save();
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.company_wifi = async(req, res) => {
    try {
        const request = req.body;
        await CompanyWifi.deleteOne({ wifi_id: request.wifi_id });
        const item = new CompanyWifi({
            wifi_id: request.wifi_id,
            com_id: request.com_id,
            name_wifi: request.name_wifi,
            mac_address: request.mac_address,
            ip_address: request.ip_address,
            create_time: request.create_time,
            is_default: request.is_default,
            status: request.status,
        });
        await item.save();
        return fnc.success(res, 'Thành công')

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error.message);
    }
}