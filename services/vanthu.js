const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const jwt = require('jsonwebtoken');
// const linktb = require('./raoNhanh365/raoNhanh')
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');
const SettingDX = require('../models/Vanthu/setting_dx');
const functions = require('./functions')
const DeXuat = require('../models/Vanthu/de_xuat')
const QuitJob = require('../models/hr/personalChange/QuitJob');
const CalendarWorkEmployee = require('../models/qlc/CalendarWorkEmployee');
const Calendar = require('../models/qlc/Cycle')
const ThuongPhat = require('../models/Tinhluong/Tinhluong365ThuongPhat');
const HoaHong = require('../models/Tinhluong/TinhluongRose')
const Cycle = require("../models/qlc/Cycle");
const EmployeCycle = require("../models/qlc/CalendarWorkEmployee");
const Shifts = require('../models/qlc/Shifts');

exports.covert = async (checkConvert) => {
    let date = '';
    let moth = '';
    if (checkConvert.getDate() < 10 || checkConvert.getMonth() < 10) {
        date = "0" + checkConvert.getDate()
        moth = "0" + checkConvert.getMonth()
    }
    let year = checkConvert.getFullYear()
    let newdate = year + "-" + moth + "-" + date
    return newdate
}

exports.formatDate = (dateString) => {
    // Sử dụng phương thức `replace()` để thay thế dấu / bằng dấu -
    return new Date(dateString).toISOString().slice(0, 10);;
}

exports.getDatesFromRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);
    while (currentDate <= stopDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;

}

// hàm khi thành công
exports.success = async (res, messsage = "", data = []) => {
    return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};

// hàm thực thi khi thất bại
exports.setError = async (res, message, code = 500) => {
    return res.status(code).json({ code, message })
};

exports.uploadFileVanThu = (id, file) => {
    let path = `../storage/base365/vanthu/tailieu/${id}/`;
    let filePath = `../storage/base365/vanthu/tailieu/${id}/` + file.originalFilename;

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }

    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(" luu thanh cong ");
            }
        });
    });
}
exports.createLinkFileVanthu = (id, file) => {
    let link = 'http://210.245.108.202:3001/base365' + `/vanthu/tailieu/${id}/` + file;
    return link;
}

exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id + 1;
};

exports.getMaxIDQJ = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { id: -1 } }).lean() || 0;
    return maxUser.id + 1;
};
exports.getMaxIDrose = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { ro_id: -1 } }).lean() || 0;
    return maxUser.ro_id + 1;
};
exports.getMaxIDtp = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { pay_id: -1 } }).lean() || 0;
    return maxUser.pay_id + 1;
};

exports.chat = async (id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, status, link, file_kem) => {
     await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive', {
        SenderId: id_user,
        ListReceive: id_user_duyet,
        CompanyId: com_id,
        Message: name_dx,
        ListFollower: id_user_theo_doi,
        Status: status,
        Link: link,
        // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link
    }).then(function (response) {
        // console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    });
    await axios.post('http://210.245.108.202:9000/api/V2/Notification/NotificationOfferReceive', {
        SenderId: id_user,
        ListReceive: id_user_duyet,
        CompanyId: com_id,
        Message: name_dx,
        ListFollower: id_user_theo_doi,
        Status: status,
        Link: link,
        // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link
    }).then(function (response) {
        // console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    });
    return 1
}

exports.uploadFileNameRandom = async (folder, file_img) => {
    let filename = '';
    const time_created = Date.now();
    const date = new Date(time_created);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    const dir = `../storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';

    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return filename;
}

exports.getLinkFile = (folder, time, fileName) => {
    let date = new Date(time * 1000);
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    let link = process.env.DOMAIN_VAN_THU + `/base365/vanthu/uploads/${folder}/${y}/${m}/${d}/`;
    let res = '';

    let arrFile = fileName.split(',').slice(0, -1);
    for (let i = 0; i < arrFile.length; i++) {
        if (res == '') res = `${link}${arrFile[i]}`
        else res = `${res}, ${link}${arrFile[i]}`
    }
    return res;
}

exports.getMaxId = async (model) => {
    let maxId = await model.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
    if (maxId) {
        maxId = Number(maxId._id) + 1;
    } else maxId = 1;
    return maxId;
}

exports.sendChat = async (link, data) => {
    return await axios
        .post(link, data)
        .then(response => {
            console.log(response.data);
            // Xử lý phản hồi từ server
        })
        .catch(error => {
            console.error(error);
            // Xử lý lỗi
        });
}

exports.checkToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing token" });
        }
        jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            let infoUser = user.data;
            if (!infoUser || !infoUser.type || !infoUser.idQLC || !infoUser.userName || !infoUser.com_id) {
                return res.status(404).json({ message: "Token missing info!" });
            }
            req.id = infoUser.idQLC;
            req.comId = infoUser.com_id;
            req.userName = infoUser.userName;
            req.type = infoUser.type;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({ message: "Error from server!" });
    }

}

exports.arrAPI = () => {
    return {
        'NotificationOfferReceive': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive",
        'NotificationOfferSent': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferSent",
        "NotificationReport": "http://43.239.223.142:9000/api/V2/Notification/NotificationReport",
        "SendContractFile": "http://43.239.223.142:9000/api/V2/Notification/SendContractFile"
    }
}

exports.replaceTitle = (title) => {
    // Hàm replaceTitle() là hàm tùy chỉnh của bạn để thay thế các ký tự không hợp lệ trong tiêu đề
    // Hãy thay thế nó bằng cách xử lý phù hợp với yêu cầu của bạn
    return title.replace(/[^a-zA-Z0-9]/g, '-');
};

exports.uploadfile = async (folder, file_img, time) => {
    let filename = '';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const timestamp = Math.round(date.getTime() / 1000);

    const dir = `../storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${timestamp}-tin-${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';
    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return filename;
}
exports.deleteFile = (file) => {
    let namefile = file.replace(`${process.env.DOMAIN_VAN_THU}/base365/vanthu/uploads/`, '');
    let filePath = '../storage/base365/vanthu/uploads/' + namefile;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.convertTimestamp = (date) => {
    let time = new Date(date);
    return Math.round(time.getTime());
}

exports.convertDate = (timestamp) => {
    return new Date(timestamp * 1000);
}

// duyệt đề xuất
exports.browseProposals = async (res, His_Handle, De_Xuat, _id, check, id_user, com_id) => {
    try {
        //Khi cần công ty duyệt
        if(check.type_duyet === 11 && id_user === com_id){
            //Lịch làm việc
            if(check.type_dx === 18){
                try{
                    const ep_id = check.id_user;
                    const llv = check.noi_dung.lich_lam_viec?.ngay_lam_viec;
                    const llvData = JSON.parse(llv)[0]?.data;
                    const llvToPost = JSON.stringify(llvData);
                    const apply_month = check.noi_dung.lich_lam_viec?.thang_ap_dung*1000;
                    const cy_name = check.name_dx;
                    const dx_created_date = check.time_create*1000;
                    //Lọc ra những llv cần cập nhật thực sự: từ ngày tạo trở đi
                    let true_llv_data;
                    if(llvData.length > 0){
                        true_llv_data = llvData.filter(llv => Date.parse(llv.date) > dx_created_date)
                    }
                    //Nếu data không rỗng
                    if(llvToPost && apply_month && cy_name) {
                        //Tìm lịch làm việc của nhân viên
                        const emp_cycle = await EmployeCycle.find({ ep_id: ep_id},{cy_id: 1});
                        let cycle_this_month;
                        if(emp_cycle && emp_cycle.length > 0) {
                            for(let i = 0; i < emp_cycle.length;i++){
                                //Tìm ra llv cá nhân ứng với tháng tạo và công ty của người tạo
                                const cycle = await Cycle.findOne({cy_id: emp_cycle[i]?.cy_id,com_id: check.com_id,is_personal:1 })
                                if(cycle){
                                    //Lấy ra tháng và năm của lịch làm việc đó
                                    const cycle_apply_month = cycle.apply_month
                                    const cycle_apply_month_date = new Date(cycle_apply_month);
                                    const cycle_apply_month_date_year = cycle_apply_month_date.getFullYear();
                                    const cycle_apply_month_date_month = cycle_apply_month_date.getMonth() + 1;
                                    //Lấy ra tháng và năm của ngày áp dụng llv trên đề xuất
                                    const apply_month_date = new Date(apply_month);
                                    const apply_month_date_year = apply_month_date.getFullYear();
                                    const apply_month_date_month = apply_month_date.getMonth() + 1;
                                    //Nếu có lịch làm việc có trùng ngày và năm của nhân viên đó thì cho thêm vào llv đã tồn tại
                                    if(cycle_apply_month_date_year === apply_month_date_year && 
                                        cycle_apply_month_date_month === apply_month_date_month){
                                            cycle_this_month = cycle
                                        }
                                }
                            }
                        }
                        //Nếu đã có sẵn llv cho tháng áp dụng: cập nhật llv đó
                        if(cycle_this_month){
                            //Lấy ra chi tiết llv
                            const cy_detail = cycle_this_month.cy_detail;
                            if(cy_detail && true_llv_data){
                                let cy_detail_object = JSON.parse(cy_detail)
                                if(cy_detail_object.length > 0){
                                    //Tìm ra những ngày trùng lặp trong llv cũ và llv mới để thay thế shift_id từ llv mới sang llv cũ
                                    cy_detail_object = cy_detail_object.map(cdo => {
                                        const matchingDate = true_llv_data.find((tld) => tld.date === cdo.date);
                                        if (matchingDate) {
                                            return { ...cdo, shift_id: matchingDate.shift_id };
                                        }
                                        //Nếu không thì cho shift_id là rỗng: không có ca làm việc
                                        return {...cdo,shift_id: ''};
                                    })
                                }
                                //Thêm những ngày trong llv mới vào llv cũ mà llv cũ ko có
                                if(true_llv_data.length > 0) {
                                    true_llv_data.forEach((tld) => {
                                        const existingDate = cy_detail_object.find((cdo) => cdo.date === tld.date);
                                        if (!existingDate) {
                                            cy_detail_object.push({ ...tld });
                                        }
                                    });
                                }
                                //Sắp xếp lại ngày tháng trong llv cũ
                                cy_detail_object = cy_detail_object.sort((a, b) => {
                                    const dateA = new Date(a.date);
                                    const dateB = new Date(b.date);
                                    return dateA - dateB;
                                });
                                //Cập nhật llv
                                const updatedLlv = await Cycle.findOneAndUpdate(
                                    {
                                        cy_id:cycle_this_month.cy_id 
                                    },{
                                        $set: {
                                            cy_detail: JSON.stringify(cy_detail_object)
                                        }
                                    },{ 
                                        new: true 
                                    }
                                )
                                if(updatedLlv){
                                    let timeNow = new Date();
                                    const maxID = await this.getMaxID(His_Handle);
                                    let newID = 0;
                                    if (maxID) {
                                        newID = Number(maxID) + 1;
                                    }
                                    const createHis = new His_Handle({
                                        _id: newID,
                                        id_user: id_user,
                                        id_dx: check._id,
                                        type_handling: 2,
                                        time: timeNow
                                    });
                                    await createHis.save();
                                    await De_Xuat.findOneAndUpdate(
                                        { _id: _id },
                                        {
                                            $set: {
                                                type_duyet: 5,
                                                time_duyet: timeNow
                                            }
                                        },
                                        { new: true }
                                    );
                                    return res.status(200).json({ message: 'Cập nhật lịch làm việc của nhân viên thành công',data: updatedLlv});
                                }
                                else{
                                    return functions.setError(res, "Lỗi khi cập nhật lịch làm việc của nhân viên");
                                }
                            }else{
                                return functions.setError(res, "Lịch làm việc đã bị mất nội dung");
                            }
                        }//Nếu ko có sẵn llv cho tháng áp dụng: tạo mới llv
                        else{
                            // Tạo mới
                            const calendar_max = await Cycle.findOne({}, { cy_id: 1 }).sort({ cy_id: -1 }).lean();
                            const calendar = new Cycle({
                                cy_id: Number(calendar_max.cy_id) + 1,
                                com_id: com_id,
                                cy_name: cy_name,
                                apply_month: apply_month,
                                cy_detail: llvToPost,
                                is_personal: true,
                            })
                            await calendar.save();
                            //Tìm ra llv vừa tạo mới
                            const newCalender = await Cycle.findOne({cy_id:Number(calendar_max.cy_id) + 1})
                            const max = await EmployeCycle.findOne({}, { epcy_id: 1 }).sort({ epcy_id: -1 }).lean();
                            //Thêm nhân viên tạo đx vào llv mới
                            const item = new EmployeCycle({
                                epcy_id: Number(max.epcy_id) + 1,
                                ep_id: ep_id,
                                cy_id: newCalender.cy_id,
                                update_time: Date.now(),
                            });
                            await item.save();
                            if(item){
                                let timeNow = new Date();
                                const maxID = await this.getMaxID(His_Handle);
                                let newID = 0;
                                if (maxID) {
                                    newID = Number(maxID) + 1;
                                }
                                const createHis = new His_Handle({
                                    _id: newID,
                                    id_user: id_user,
                                    id_dx: check._id,
                                    type_handling: 2,
                                    time: timeNow
                                });
                                await createHis.save();
                                await De_Xuat.findOneAndUpdate(
                                    { _id: _id },
                                    {
                                        $set: {
                                            type_duyet: 5,
                                            time_duyet: timeNow
                                        }
                                    },
                                    { new: true }
                                );
                                const data = {
                                    emp:item,
                                    com:calendar
                                }
                                return res.status(200).json({ message: 'Thêm mới lịch làm việc của nhân viên thành công',data: data});
                            }
                            else{
                                return functions.setError(res, "Lỗi khi tạo lịch làm việc nhân viên mới");
                            }
                        }
                    }
                    else{
                        return functions.setError(res, "Thông tin truyền lên không đầy đủ");
                    }
                    
                }catch(err){
                    console.log(err);
                }
            }
            //Nghỉ việc
            if(check.type_dx === 5){
                try{
                    let ep_id = check.id_user
                    let maxIDTQJ = await this.getMaxIDQJ(QuitJob)
                        let idTB = 0;
                        if (maxIDTQJ) {
                            idTB = Number(maxIDTQJ) + 1;
                        }
                    const createQJ = new QuitJob({
                        id : idTB,
                        ep_id: ep_id,
                        com_id: com_id,
                        created_at: check.noi_dung.thoi_viec.ngaybatdau_tv,
                        note: check.noi_dung.thoi_viec.ly_do,
                    });
                    if(createQJ){
                        let timeNow = new Date();
                        const maxID = await this.getMaxID(His_Handle);
                        let newID = 0;
                        if (maxID) {
                            newID = Number(maxID) + 1;
                        }
                        const createHis = new His_Handle({
                            _id: newID,
                            id_user: id_user,
                            id_dx: check._id,
                            type_handling: 2,
                            time: timeNow
                        });
                        await createHis.save();
                        await De_Xuat.findOneAndUpdate(
                            { _id: _id },
                            {
                                $set: {
                                    type_duyet: 5,
                                    time_duyet: timeNow
                                }
                            },
                            { new: true }
                        );
                        return res.status(200).json({ message: 'Duyệt đề xuất nghỉ việc thành công',data: createQJ});
                    }
                    else{
                        return functions.setError(res, "Thông tin truyền lên không đầy đủ");
                    }
                }catch(e){
                    console.log(e);
                }
            }
            //Tăng ca
            else if(check.type_dx === 10){
                try{
                    let month_apply = 0;
                    let nd = check.noi_dung.tang_ca;
                    if (new Date(check.tang_ca.time_tc).getMonth() + 1 < 10) {
                        month_apply = new Date(nd.time_tc).getFullYear() + '-0' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
                    } else {
                        month_apply = new Date(nd.time_tc).getFullYear() + '-' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
                    }
                    const checkcalendar = await CalendarWorkEmployee.findOne({
                        idQLC: check.id_user
                    }).select('cy_id')
                    let checkCalendaremp = await Calendar.findOne({ 
                        cy_id: checkcalendar.cy_id,
                        apply_month: month_apply })
                    if (checkCalendaremp) {
                        var items_tc = JSON.parse(checkCalendaremp.cy_detail)
                    }
                    for(let i = 0; i < items_tc.length ; i++){
                        if(new Date(nd.time_tc).getTime() == new Date(items_tc[i].date).getTime())
                        {
                            var data_item_tc = items_tc[i]
                        }
                    }
                    let shift_olds = data_item_tc.shift_id.split(',');
                    if(shift_olds.length > 1)
                    {
                        if(shift_olds.includes(nd.shift_id))
                        {
                        shift_olds =[...nd.shift_id]
                        }
                    }
                    
                    let checkConvert = nd.time_tc
                    let timeDate = await this.covert(checkConvert)
                    let shift_new = '{"date" : "' + timeDate + '","shift_id": "' + shift_olds + '"}';
                    let covect  = JSON.stringify(items_tc);
                    let arrCycle = covect.replace(JSON.stringify(data_item_tc[0]), JSON.stringify(shift_new));
                    let name = `Lịch làm việc ${historyDuyet.name_user} Tháng ${new Date(nd.time_tc).toISOString().slice(0, 7)}`;
                    const updatedCalendarawait = await Calendar.findOneAndUpdate(
                        { cy_id: checkCalendaremp.cy_id },
                        {
                        $set: {
                            com_id: checkCalendaremp.com_id,
                            cy_name: name,
                            month_apply: month_apply,
                            cy_detail : arrCycle,
                        }
                        },
                        { new: true }
                    );
                    if(updatedCalendarawait){
                        let timeNow = new Date();
                        const maxID = await this.getMaxID(His_Handle);
                        let newID = 0;
                        if (maxID) {
                            newID = Number(maxID) + 1;
                        }
                        const createHis = new His_Handle({
                            _id: newID,
                            id_user: id_user,
                            id_dx: check._id,
                            type_handling: 2,
                            time: timeNow
                        });
                        await createHis.save();
                        await De_Xuat.findOneAndUpdate(
                            { _id: _id },
                            {
                                $set: {
                                    type_duyet: 5,
                                    time_duyet: timeNow
                                }
                            },
                            { new: true }
                        );
                        return res.status(200).json({ message: 'Duyệt đề xuất tăng ca thành công, đã cập nhật lịch làm việc của nhân viên',data: updatedCalendarawait});
                    }
                    else{
                        return functions.setError(res, "Thông tin truyền lên không đầy đủ");
                    }
                }catch(e){
                    console.log(e);
                }
            }
            //Thưởng phạt
            else if(check.type_dx === 19){
                try{
                    let id_eptp = '';
                    const ndtp = check.noi_dung.thuong_phat
                    if(ndtp.type == 1) {
                        id_eptp = check.id_user;
                    }else{
                        id_eptp = ndtp.nguoi_tp
                    }
                        let max_id = await this.getMaxIDtp(ThuongPhat)
                        if(!max_id){
                        max_id = 0
                        }
                        const createTP = new ThuongPhat({
                        pay_id: max_id + 1,
                        pay_id_user: check.id_user,
                        pay_id_com: check.com_id,
                        pay_price : ndtp.so_tien_tp,
                        pay_status: ndtp.type_tp,
                        pay_case : ndtp.ly_do,
                        pay_day : ndtp.time_tp
                    });
                    if(createTP){
                        let timeNow = new Date();
                        const maxID = await this.getMaxID(His_Handle);
                        let newID = 0;
                        if (maxID) {
                            newID = Number(maxID) + 1;
                        }
                        const createHis = new His_Handle({
                            _id: newID,
                            id_user: id_user,
                            id_dx: check._id,
                            type_handling: 2,
                            time: timeNow
                        });
                        await createHis.save();
                        await De_Xuat.findOneAndUpdate(
                            { _id: _id },
                            {
                                $set: {
                                    type_duyet: 5,
                                    time_duyet: timeNow
                                }
                            },
                            { new: true }
                        );
                        return res.status(200).json({ message: 'Duyệt đề xuất thưởng phạt thành công',data: createTP});
                    }
                    else{
                        return functions.setError(res, "Thông tin truyền lên không đầy đủ");
                    }
                }
                catch(err){
                    console.log(err)
                }
            }
            //Hoa hồng
            else if(check.type_dx === 20){
                try{
                    let id_ephh  = check.id_user
                    const ndhh = check.noi_dung.hoa_hong;
                    let maxID = await this.getMaxIDrose(HoaHong)
                    if(!maxID){
                        maxID = 0
                    }
                    const createhh = new HoaHong({
                        ro_id : maxID + 1,
                        ro_id_user: id_ephh,
                        ro_id_com: check.com_id,
                        ro_time : ndhh.time_hh,
                        ro_time_end: ndhh.item_mdt_date,
                        ro_note : ndhh.ly_do,
                        ro_time_created : timeNow
                    });
                    if(createhh){
                        let timeNow = new Date();
                        const maxID = await this.getMaxID(His_Handle);
                        let newID = 0;
                        if (maxID) {
                            newID = Number(maxID) + 1;
                        }
                        const createHis = new His_Handle({
                            _id: newID,
                            id_user: id_user,
                            id_dx: check._id,
                            type_handling: 2,
                            time: timeNow
                        });
                        await createHis.save();
                        await De_Xuat.findOneAndUpdate(
                            { _id: _id },
                            {
                                $set: {
                                    type_duyet: 5,
                                    time_duyet: timeNow
                                }
                            },
                            { new: true }
                        );
                        res.status(200).json({ message: 'Duyệt đề xuất hoa hồng thành công',data: createhh});
                    }
                    else{
                        return functions.setError(res, "Thông tin truyền lên không đầy đủ");
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
            // //cộng công
            // else if(check.type_dx === 17){
            //     try{
            //         const list = await Shifts.find({
            //             com_id: com_id
            //         }).sort({ _id: -1 });
            //         const plus_shift = check.noi_dung.xac_nhan_cong.id_ca_xnc
            //         const real_shift = list.find(shift => shift.shift_id === plus_shift)
            //         const plus_effort = real_shift.num_to_calculate;
                    
            //     }
            //     catch(err){
            //         console.log(err);
            //     }
            // }
            //Các loại đề xuất khác
            else{
                try{
                    let timeNow = new Date();
                    const maxID = await this.getMaxID(His_Handle);
                    let newID = 0;
                    if (maxID) {
                        newID = Number(maxID) + 1;
                    }
                    const createHis = new His_Handle({
                        _id: newID,
                        id_user: id_user,
                        id_dx: check._id,
                        type_handling: 2,
                        time: timeNow
                    });
                    await createHis.save();
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 5,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    return res.status(200).json({ message: 'Duyệt đề xuất thành công'});
                }
                catch (err) {
                    console.error(err);
                }
            }
        }else{
            let timeNow = new Date();
            const maxID = await this.getMaxID(His_Handle);
            let newID = 0;
            if (maxID) {
                newID = Number(maxID) + 1;
            }
            const createHis = new His_Handle({
                _id: newID,
                id_user: id_user,
                id_dx: check._id,
                type_handling: 2,
                time: timeNow
            });
            await createHis.save();
            let id_user_duyet = [];
            let history = [];
            if(check.id_user_duyet) {
                id_user_duyet = check.id_user_duyet.split(',').map(Number);
                for(var i =0; i < id_user_duyet.length; i++) {
                    id = id_user_duyet[i];
                    const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                    history.push({id: id, history: his?.type_handling});
                }
            }
            //Kiểu duyệt đồng thời
            if (check.kieu_duyet == 0) {
                //Chờ công ty duyệt
                if (history.length > 0){
                    // Nếu tất cả người duyệt đều đã duyệt
                    if(history.every(his => his.history === 2)){
                        //Đề xuất cần công ty duyệt
                        if(check.type_dx === 2 || check.type_dx === 10 || 
                            check.type_dx === 17 || check.type_dx === 18 || 
                            check.type_dx === 19 || check.type_dx === 20)
                        {
                            await De_Xuat.findOneAndUpdate(
                                { _id: _id },
                                {
                                    $set: {
                                        type_duyet: 11,
                                        time_duyet: timeNow,
                                        id_user_duyet: check.id_user_duyet += `,${com_id}`
                                    }
                                },
                                { new: true }
                            );
                            return res.status(200).json({ message: 'Chờ công ty duyệt' });
                        }
                        //Đề xuất không cần công ty duyệt
                        else{
                            await De_Xuat.findOneAndUpdate(
                                { _id: _id },
                                {
                                    $set: {
                                        type_duyet: 5,
                                        time_duyet: timeNow
                                    }
                                },
                                { new: true }
                            );
                            return res.status(200).json({ message: 'Đã duyệt đề xuất' });
                        }
                    }
                    // Nếu có bất cứ một người nào chưa duyệt
                    else{
                        await De_Xuat.findOneAndUpdate(
                            { _id: _id },
                            {
                                $set: {
                                    type_duyet: 10,
                                    time_duyet: timeNow
                                }
                            },
                            { new: true }
                        );
                        return res.status(200).json({ message: 'Chờ lãnh đạo còn lại duyệt' });
                    }
                }
                
            } 
            //Kiểu duyệt lần lượt
            else {
                const historyDuyet = await His_Handle.find({ id_dx: check._id, type_handling: 2 }).sort({ id_his: 1 });
                const listDuyet = historyDuyet.map((item) => item.id_user).join(',');
                const arrDuyet = listDuyet.split(',');
                const arrDuyet1 = check.id_user_duyet.split(',');
                arrDuyet.sort();
                arrDuyet1.sort();
                if (JSON.stringify(arrDuyet) === JSON.stringify(arrDuyet1)) {
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 5,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    return res.status(200).json({ message: 'Đã duyệt đề xuất' });
                } else {
                    return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

// từ chối đề xuất
exports.refuseProposal = async (res, His_Handle, De_Xuat, _id, id_ep, check, id_user) => {
    try {
        let timeNow = new Date()
        await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    type_duyet: 3,
                    time_duyet: timeNow,
                    active: 2
                }
            },
            { new: true }
        );
        const createHis = new His_Handle({
            _id: await this.getMaxID(His_Handle) + 1,
            id_user: id_user,
            id_dx: check._id,
            type_handling: 3,
            time: timeNow
        });
        await createHis.save();

        const deXuatInfo = await De_Xuat.findOne({ _id: _id });
        const link = `https://vanthu.timviec365.vn/trang-quan-ly-de-xuat/${_id}`;
        const notificationData = {
            EmployeeId: deXuatInfo.id_user,
            SenderId: id_ep,
            CompanyId: deXuatInfo.com_id,
            Message: deXuatInfo.name_dx,
            ListFollower: `[${deXuatInfo.id_user_theo_doi}]`,
            Status: deXuatInfo.name_cate_dx,
            Link: link,
            type: 1
        };
        await axios.post('https://mess.timviec365.vn/Notification/NotificationOfferSent', notificationData);
        return res.status(200).json({ message: 'Từ chối đề xuất thành công' });
    } catch (error) {
        console.log(error);
        return this.setError(res, error);
    }
}

// bắt buộc đi làm
exports.compulsoryWork = async (res, His_Handle, De_Xuat, _id, check, id_user) => {
    try {
        let timeNow = new Date();
        await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    type_duyet: 6,
                    time_duyet: timeNow,
                    active: 2
                }
            },
            { new: true }
        );
        const createHis = new His_Handle({
            _id: await this.getMaxID(His_Handle) + 1,
            id_user:id_user,
            id_dx: check._id,
            type_handling: 6,
            time: timeNow
        });
        await createHis.save();
        return res.status(200).json({ message: 'Bắt buộc đi làm thành công!' });
    } catch (error) {
        return this.setError(res, error)
    }
}

// duyệt chuyển tiếp
exports.forwardBrowsing = async (res, His_Handle, De_Xuat, _id, id_uct, check,id_user) => {
    try {
        let timeNow = new Date()
        let user_td
        const listIDtheodoi = check.id_user_theo_doi.split(',')
        if (id_uct && listIDtheodoi.length > 0 && !listIDtheodoi.includes(id_uct)) {
            user_td = `${check.id_user_theo_doi},${id_uct}`;
        }
        else{
            return res.status(200).json({ message: 'Thiếu trường người chuyển tiếp' })
        }
        await De_Xuat.findOneAndUpdate(
            { _id: _id },
            { id_user_duyet: id_uct, id_user_theo_doi: user_td },
            { new: true }
        );

        const createHis = new His_Handle({
            _id: await this.getMaxID(His_Handle) + 1,
            id_user:id_user,
            id_dx: check._id,
            type_handling: 2,
            time: timeNow
        });
        await createHis.save();

        return res.status(200).json({ message: 'Chuyển tiếp đề xuất thành công' });
    } catch (error) {
        return this.setError(res, error)
    }
}
 // Kiểm tra thời gian quá hạn
exports.expired = async (id_dx,id_com) =>{
    const dexuat = await DeXuat.findOne({_id: id_dx,com_id: id_com});
    const settingDx = await SettingDX.findOne({ com_id:id_com });
    let time_nghi_kh = 0;
    let time_nghi_dx = null;
    let time_tp = 0;
    let time_hh = 0;
    if(settingDx){
        if(settingDx.time_limit){
            time_nghi_kh = settingDx.time_limit;
        }
        if(settingDx.time_limit_l){
            time_nghi_dx = JSON.parse(settingDx.time_limit_l);
        } 
        if(settingDx.time_tp){
            time_tp = settingDx.time_tp;
        }
        if(settingDx.time_hh){
            time_hh = settingDx.time_hh;
        }
    }
    const date_now = Date.parse(new Date())/1000;
    const hour_diff = (date_now -  dexuat.time_create)/3600
    switch (dexuat.type_dx){
        //đx nghỉ phép
        case 1 : 
            //Nghỉ có kế hoạch
            if(dexuat?.noi_dung.nghi_phep.loai_np === 1){
                if(time_nghi_kh === 0 || time_nghi_kh === null){
                    return false;
                }
                if(hour_diff > time_nghi_kh){
                    return true;
                }
                else{
                    return false;
                }
            }
            //Nghỉ đột xuất
            else if (dexuat?.noi_dung.nghi_phep.loai_np === 2){
                if(time_nghi_dx && time_nghi_dx.length > 0){
                    const ca_nghi_data = dexuat?.noi_dung.nghi_phep.nd?.map(nd => nd.ca_nghi)
                    //Nếu trong đề xuất xuất hiện ca nghỉ cả ngày (shift === null)
                    if(ca_nghi_data.some(shift => shift === null)){
                        //phải duyệt trước 8h sáng hôm sau
                        const hour_duyet = '08:00'
                        const [hours, minutes] = hour_duyet.split(':').map(Number)
                        //Tìm ra ngày tiếp sau ngày tạo đề xuất
                        const ngay_qua_han = new Date(dexuat.time_create*1000)
                        ngay_qua_han.setDate(ngay_qua_han.getDate() + 1)
                        //Tìm ra giờ quá hạn tương ứng ở ngày tiêp sau ngày tạo đề xuất
                        ngay_qua_han.setHours(hours)
                        ngay_qua_han.setMinutes(minutes)
                        ngay_qua_han.setSeconds(0)
                        //Tìm ra thời gian quá hạn thực tế cho ca đó
                        const thoi_gian_qua_han_thuc_te = Date.parse(ngay_qua_han)/1000
                        //So sánh giờ duyệt và giờ quá hạn
                        if(date_now > thoi_gian_qua_han_thuc_te){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        const ca_nghi = [...new Set(ca_nghi_data)]
                        let qua_han = [];
                        //Chọn ra ca nghỉ tương ứng với ca nghỉ trong cài đặt
                        for(var i = 0 ; i < ca_nghi.length; i++){
                            time_nghi_dx = time_nghi_dx.filter(time => time[0] === ca_nghi[i].toString())
                        }
                        for(var i = 0; i < time_nghi_dx.length; i++){
                            //Chọn ra giờ duyệt
                            const hour_duyet = time_nghi_dx[i][1];
                            if(hour_duyet){
                                //Tách ra giờ và phút
                                const [hours, minutes] = hour_duyet.split(':').map(Number)
                                //Tìm ra ngày tiếp sau ngày tạo đề xuất
                                const ngay_qua_han = new Date(dexuat.time_create*1000)
                                ngay_qua_han.setDate(ngay_qua_han.getDate() + 1)
                                //Tìm ra giờ quá hạn tương ứng ở ngày tiêp sau ngày tạo đề xuất
                                ngay_qua_han.setHours(hours)
                                ngay_qua_han.setMinutes(minutes)
                                ngay_qua_han.setSeconds(0)
                                //Tìm ra thời gian quá hạn thực tế cho ca đó
                                const thoi_gian_qua_han_thuc_te = Date.parse(ngay_qua_han)/1000
                                //So sánh giờ duyệt và giờ quá hạn
                                qua_han.push(date_now > thoi_gian_qua_han_thuc_te)
                            }
                            else{
                                qua_han.push(false)
                            }
                        }
                        if(qua_han.some(rec => rec === true)){
                            return true
                        }
                        else{
                            return false
                        }
                    }
                }
                else{
                    return false
                }
            }
        //đx thưởng phạt
        case 19:
            if(time_tp === 0 || time_tp === null){
                return false;
            }
            if(hour_diff > time_tp){
                return true
            }
            else{
                return false;
            }
        //đx hoa hồng
        case 20:
            if(time_hh === 0 || time_hh === null){
                return false;
            }
            if(hour_diff > time_hh){
                return true
            }
            else{
                return false;
            }
        //các loại đx khác
        default:
            return false
    }
}