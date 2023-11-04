const service = require('../../../services/timviec365/orders');
const functions = require('../../../services/functions');
const Users = require('../../../models/Users');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const PriceList = require('../../../models/Timviec365/PriceList/PriceList');
const Order = require('../../../models/Timviec365/Order');
const OrderDetails = require('../../../models/Timviec365/OrderDetails');
const SaveExchangePointOrder = require('../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointOrder');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const PointCompany = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const PointUsed = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const GhimHistory = require('../../../models/Timviec365/UserOnSite/Company/GhimHistory');
const HistoryPointPromotion = require('../../../models/Timviec365/UserOnSite/ManageHistory/HistoryPointPromotion');
const { recordCreditsHistory } = require('../credits');

// danh sách các loại dịch vụ
function listTypeService($type) {
    let arr = [
        {
            type: 1,
            title: 'GHIM TIN TRANG CHỦ BOX VIỆC LÀM HẤP DẪN',
        },
        {
            type: 2,
            title: 'LỌC HỒ SƠ',
        },
        {
            type: 3,
            title: 'COMBO LỌC HỒ SƠ + GHIM TIN HẤP DẪN',
        },
        {
            type: 4,
            title: 'GHIM TIN TRANG CHỦ BOX THƯƠNG HIỆU',
        },
        {
            type: 5,
            title: 'GHIM TIN TRANG CHỦ BOX VIỆC LÀM TUYỂN GẤP',
        },
        {
            type: 6,
            title: 'GHIM TIN TRANG NGÀNH',
        },
        {
            type: 7,
            title: 'SÀNG LỌC HỒ SƠ ỨNG VIÊN NHANH CHÓNG, HIỆU QUẢ QUA AI TRÊN CRM 365',
        },
    ];
    if ($type != null) {
        if ($type != 0) {
            return arr[$type - 1].title;
        } else {
            return '';
        }
    } else {
        return arr;
    }
}

// xử lý chuyên viên hủy đơn hàng
const handleSupporterCancelOrder = async (order_id) => {
    try {
        let checkOrder = await Order.findOne({ id: order_id });
        if (checkOrder) {
            let info_admin = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });
            let nameAdmin = '',
                sdtAdmin = '',
                zaloAdmin = '',
                emailAdmin = '';
            if (info_admin) {
                nameAdmin = info_admin.adm_name;
                sdtAdmin = info_admin.adm_phone;
                if (info_admin.adm_mobile != '' && info_admin.adm_mobile != null) {
                    zaloAdmin = info_admin.adm_mobile;
                }
                emailAdmin = info_admin.adm_email;
            }
            await Order.updateOne(
                { id: order_id },
                {
                    $set: {
                        status: 4,
                    },
                }
            );
            let message =
                `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã bị hủy bởi chuyên viên chăm sóc ` + nameAdmin;
            service.sendMessageToGroupOrder(message);
            if (checkOrder.type_user == 1) {
                let infoCus = await Users.findOne({ idTimViec365: checkOrder.id_user });
                let messageKH =
                    `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã bị hủy bởi chuyên viên chăm sóc ` +
                    nameAdmin +
                    ` \n - Tên chuyên viên: ${nameAdmin} \n - Số điện thoại: ${sdtAdmin} \n - Zalo: ${zaloAdmin} \n - Email: ${emailAdmin} - Hotline: 1900633682 - Nhấn phím 1 \n Hãy liên hệ để được hỗ trợ.`;
                // hoàn lại điểm khi áp dụng điểm khuyến mại
                if (checkOrder.discount_fee > 0) {
                    let time = new Date().getTime() / 1000;
                    let point_promotion = checkOrder.discount_fee / 1000;
                    messageKH =
                        `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã bị hủy bởi chuyên viên chăm sóc ` +
                        nameAdmin +
                        ` \n Bạn được hoàn lại ${point_promotion} điểm khuyến mại vào điểm thưởng mua hàng \n - Tên chuyên viên: ${nameAdmin} \n - Số điện thoại: ${sdtAdmin} \n - Zalo: ${zaloAdmin} \n - Email: ${emailAdmin} - Hotline: 1900633682 - Nhấn phím 1 \n Hãy liên hệ để được hỗ trợ.`;
                    await new SaveExchangePointOrder({
                        userId: checkOrder.id_user,
                        userType: checkOrder.type_user,
                        order_id: order_id,
                        point: point_promotion,
                        type_point: 1,
                        time: time,
                    }).save();

                    // cập nhật tiền trong ví365 và lưu lại lịch sử
                    let existsPointCompany = await PointCompany.findOne({ usc_id: checkOrder.id_user });
                    let updateMoney;
                    if (!existsPointCompany) {
                        updateMoney = await new PointCompany({
                            usc_id: checkOrder.id_user,
                            money_usc: checkOrder.discount_fee,
                        }).save();
                    } else {
                        updateMoney = await PointCompany.findOneAndUpdate(
                            { usc_id: checkOrder.id_user },
                            { $inc: { money_usc: checkOrder.discount_fee } },
                            { new: true }
                        );
                    }
                    await recordCreditsHistory(
                        checkOrder.id_user,
                        1,
                        checkOrder.discount_fee,
                        null,
                        '',
                        `Hoàn ${functions.formatMoney(String(point_promotion))} điểm khuyến mãi mua hàng`,
                        updateMoney.money_usc,
                        7
                    );
                }
                service.sendMessageToIdChat(messageKH, infoCus._id);

                // cập nhật trang thái trong bản ghi ghim tin là Bị hủy
                await GhimHistory.updateMany(
                    { order_id: order_id },
                    {
                        $set: { status: 4 },
                    }
                );
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log('handleSupporterCancelOrder', e);
        return false;
    }
};

// api chuyên viên hủy đơn hàng
exports.supporterCancelOrder = async (req, res, next) => {
    try {
        if (req.body.order_id) {
            const order_id = Number(req.body.order_id);
            await handleSupporterCancelOrder(order_id);
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (error) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// xử lý chuyên viên duyệt đơn hàng
const handleSupporterAcceptOrder = async (
    order_id,
    money_received,
    money_bonus,
    money_real_received,
    name_bank,
    account_bank,
    account_holder,
    content_bank
) => {
    try {
        let checkOrder = await Order.findOne({ id: order_id });
        if (checkOrder) {
            let time = new Date().getTime() / 1000;
            await Order.updateOne(
                { id: order_id },
                {
                    $set: {
                        admin_accept: 1,
                        status: 0,
                        accept_time_1: time,
                        money_received: money_received,
                        money_bonus: money_bonus,
                        money_real_received: money_real_received,
                        name_bank: name_bank,
                        account_bank: account_bank,
                        account_holder: account_holder,
                        content_bank: content_bank,
                    },
                }
            );
            let info_admin = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });
            let nameAdmin = '',
                sdtAdmin = '',
                zaloAdmin = '',
                emailAdmin = '';
            if (info_admin) {
                nameAdmin = info_admin.adm_name;
                sdtAdmin = info_admin.adm_phone;
                if (info_admin.adm_mobile != '' && info_admin.adm_mobile != null) {
                    zaloAdmin = info_admin.adm_mobile;
                }
                emailAdmin = info_admin.adm_email;
            }
            let message =
                `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã được duyệt bởi chuyên viên chăm sóc ` +
                nameAdmin;
            service.sendMessageToGroupOrder(message);
            if (checkOrder.type_user == 1) {
                let messageKH =
                    `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã được duyệt bởi chuyên viên chăm sóc ` +
                    nameAdmin +
                    ` \n - Tên chuyên viên: ${nameAdmin} \n - Số điện thoại: ${sdtAdmin} \n - Zalo: ${zaloAdmin} \n - Email: ${emailAdmin} \n - Hotline: 1900633682 - Nhấn phím 1 \n Hãy chờ để được tổng đài hỗ trợ hoàn thành đơn hàng.`;
                let infoCus = await Users.findOne({ idTimViec365: checkOrder.id_user });
                service.sendMessageToIdChat(messageKH, infoCus._id);
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log('handleSupporterAcceptOrder', e);
        return false;
    }
};

// api chuyên viên duyệt đơn hàng = gửi đề xuất đơn hàng đến tổng đài
exports.supporterAcceptOrder = async (req, res, next) => {
    try {
        if (req.body.order_id) {
            const order_id = Number(req.body.order_id);
            const money_received = Number(req.body.money_received);
            const money_bonus = Number(req.body.money_bonus);
            const money_real_received = Number(req.body.money_real_received);
            const name_bank = String(req.body.name_bank); // tên ngân hàng
            const account_bank = String(req.body.account_bank); // số tài khoản
            const account_holder = String(req.body.account_holder); // chủ tài khoản
            const content_bank = String(req.body.content_bank); // nội dung chuyển khoản
            await handleSupporterAcceptOrder(
                order_id,
                money_received,
                money_bonus,
                money_real_received,
                name_bank,
                account_bank,
                account_holder,
                content_bank
            );
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// xử lý trực hủy đơn hàng
const handleAdminCancelOrder = async (order_id, admin_id) => {
    try {
        let checkAdmin = await AdminUser.findOne({ adm_id: admin_id });
        let checkOrder = await Order.findOne({ id: order_id });
        if (checkAdmin && checkOrder) {
            if (admin_id == 4 || admin_id == 32) {
                await Order.updateOne(
                    { id: order_id },
                    {
                        $set: {
                            status: 4,
                            admin_accept: 3,
                        },
                    }
                );
                let message = `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã bị từ chối bởi tổng đài hỗ trợ.`;
                service.sendMessageToGroupOrder(message);
                if (checkOrder.type_user == 1) {
                    let infoCus = await Users.findOne({ idTimViec365: checkOrder.id_user });
                    let info_admin = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });

                    let messageKH = `Thông báo \n 
                    Đơn hàng với mã ${checkOrder.code_order} đã bị từ chối bởi tổng đài hỗ trợ \n 
                    - Tên chuyên viên: ${info_admin.adm_name} \n 
                    - Số điện thoại: ${info_admin.adm_phone} \n 
                    - Zalo: ${info_admin.adm_mobile} \n 
                    - Email: ${info_admin.adm_email} \n 
                    - Hotline: 1900633682 - Nhấn phím 1 \n 
                    Hãy liên hệ để được hỗ trợ.`;

                    if (checkOrder.discount_fee > 0) {
                        let time = new Date().getTime() / 1000;
                        let point_promotion = checkOrder.discount_fee / 1000;

                        messageKH = `Thông báo \n 
                        Đơn hàng với mã ${checkOrder.code_order} đã bị từ chối bởi tổng đài hỗ trợ \n 
                        Bạn được hoàn lại ${point_promotion} điểm khuyến mại vào điểm thưởng mua hàng \n 
                        - Tên chuyên viên: ${info_admin.adm_name} \n 
                        - Số điện thoại: ${info_admin.adm_phone} \n 
                        - Zalo: ${info_admin.adm_mobile} \n 
                        - Email: ${info_admin.adm_email} \n 
                        - Hotline: 1900633682 
                        - Nhấn phím 1 \n 
                        Hãy liên hệ để được hỗ trợ.`;

                        await new SaveExchangePointOrder({
                            userId: checkOrder.id_user,
                            userType: checkOrder.type_user,
                            order_id: order_id,
                            point: point_promotion,
                            type_point: 1,
                            time: time,
                        }).save();

                        // cập nhật tiền trong ví365 và lưu lại lịch sử
                        let existsPointCompany = await PointCompany.findOne({ usc_id: checkOrder.id_user });
                        let updateMoney;
                        if (!existsPointCompany) {
                            updateMoney = await new PointCompany({
                                usc_id: checkOrder.id_user,
                                money_usc: checkOrder.discount_fee,
                            }).save();
                        } else {
                            updateMoney = await PointCompany.findOneAndUpdate(
                                { usc_id: checkOrder.id_user },
                                { $inc: { money_usc: checkOrder.discount_fee } },
                                { new: true }
                            );
                        }
                        await recordCreditsHistory(
                            checkOrder.id_user,
                            1,
                            checkOrder.discount_fee,
                            null,
                            '',
                            `Hoàn ${functions.formatMoney(String(point_promotion))} điểm khuyến mãi mua hàng`,
                            updateMoney.money_usc,
                            7
                        );
                    }
                    service.sendMessageToIdChat(messageKH, infoCus._id);
                }
                let infoSupporter = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });
                if (infoSupporter) {
                    service.sendMessageToIdQlc(message, infoSupporter.emp_id);
                }

                // cập nhật trang thái trong bản ghi ghim tin là Bị hủy
                await GhimHistory.updateMany(
                    { order_id: order_id },
                    {
                        $set: { status: 4 },
                    }
                );
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log('handleAdminCancelOrder', e);
        return false;
    }
};

// api trực hủy đơn hàng
exports.adminCancelOrder = async (req, res, next) => {
    try {
        if (req.body.order_id && req.body.admin_id) {
            const order_id = Number(req.body.order_id);
            const admin_id = Number(req.body.admin_id);

            await handleAdminCancelOrder(order_id, admin_id);
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

function uniqueArray(a, fn) {
    if (a.length === 0 || a.length === 1) {
        return a;
    }
    if (!fn) {
        return a;
    }
    for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j < a.length; j++) {
            if (fn(a[i], a[j])) {
                a.splice(i, 1);
            }
        }
    }
    return a;
}

// xử lý trực duyệt đơn hàng
const handleAdminAcceptOrder = async (order_id, admin_id) => {
    try {
        let checkAdmin = await AdminUser.findOne({ adm_id: admin_id });
        let checkOrder = await Order.findOne({ id: order_id });
        if (checkAdmin && checkOrder) {
            if (admin_id == 4 || admin_id == 32) {
                // gửi thông báo cho NTD, chuyên viên và nhóm đơn hàng
                let time = new Date().getTime() / 1000;
                await Order.updateOne(
                    { id: order_id },
                    {
                        $set: {
                            status: 1,
                            admin_accept: 2,
                            accept_time_2: time,
                        },
                    }
                );
                let message = `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã được duyệt bởi tổng đài hỗ trợ, đơn hàng chuyển sang trạng thái đang hoạt động.`;
                service.sendMessageToGroupOrder(message);
                if (checkOrder.type_user == 1) {
                    let infoCus = await Users.findOne({ idTimViec365: checkOrder.id_user });
                    let info_admin = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });

                    let messageKH = `Thông báo \n
    Đơn hàng với mã ${checkOrder.code_order} đã được duyệt bởi tổng đài hỗ trợ \n
    - Tên chuyên viên: ${info_admin.adm_name} \n
    - Số điện thoại: ${info_admin.adm_phone} \n
    - Zalo: ${info_admin.adm_mobile} \n
    - Email: ${info_admin.adm_email} \n
    - Hotline: 1900633682
    - Nhấn phím 1 \n
    Hãy liên hệ để được hỗ trợ.`;

                    service.sendMessageToIdChat(messageKH, infoCus._id);
                }
                let infoSupporter = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });
                if (infoSupporter) {
                    service.sendMessageToIdQlc(message, infoSupporter.emp_id);
                }
                // cộng điểm mua hàng
                let money_bonus_order = (checkOrder.money_real_received * 5) / 100 / 1000;

                await new SaveExchangePointOrder({
                    userId: checkOrder.id_user,
                    userType: checkOrder.type_user,
                    order_id: order_id,
                    point: money_bonus_order,
                    unit_point: 0,
                    time: time,
                }).save();

                // cập nhật tiền trong ví365 và lưu lại lịch sử
                let existsPointCompany = await PointCompany.findOne({ usc_id: checkOrder.id_user });
                let updateMoney;
                let amount = (checkOrder.money_real_received * 5) / 100;
                if (!existsPointCompany) {
                    updateMoney = await new PointCompany({
                        usc_id: checkOrder.id_user,
                        money_usc: amount,
                    }).save();
                } else {
                    updateMoney = await PointCompany.findOneAndUpdate(
                        { usc_id: checkOrder.id_user },
                        { $inc: { money_usc: amount } },
                        { new: true }
                    );
                }
                await recordCreditsHistory(
                    checkOrder.id_user,
                    1,
                    amount,
                    null,
                    '',
                    `${checkOrder.code_order}`,
                    updateMoney.money_usc,
                    5,
                    order_id
                );

                // KHI TRỰC DUYỆT SẼ TỰ ĐỘNG THỰC THI CÁC GÓI DỊCH VỤ MÀ NTD ĐÃ MUA
                let detail_order = await OrderDetails.aggregate([
                    { $match: { order_id: order_id, use_product: { $ne: 1 } } },
                    {
                        $lookup: {
                            from: 'PriceList',
                            localField: 'product_id',
                            foreignField: 'bg_id',
                            as: 'listing',
                        },
                    },
                    { $unwind: '$listing' },
                    {
                        $lookup: {
                            from: 'NewTV365',
                            localField: 'new_id',
                            foreignField: 'new_id',
                            as: 'new',
                        },
                    },
                    {
                        $unwind: {
                            path: '$new',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            id: 1,
                            product_id: 1,
                            product_type: 1,
                            new_id: 1,
                            count_product: 1,
                            bg_time: '$listing.bg_time',
                            bg_hoso: '$listing.bg_hoso',
                            bg_tuan: '$listing.bg_tuan',
                            bg_gift_hoso: '$listing.bg_gift_hoso',
                            bg_time_gift_hoso: '$listing.bg_time_gift_hoso',
                            new_title: '$new.new_title',
                        },
                    },
                ]);
                let arr_detail_service = [];
                if (detail_order && detail_order.length) {
                    for (let i = 0; i < detail_order.length; i++) {
                        let new_id = detail_order[i].new_id,
                            product_type = detail_order[i].product_type,
                            arr_detail_service_item = [],
                            so_tuan = 0,
                            so_hoso = 0,
                            gift_hoso = 0,
                            time_gift_hoso = 0;
                        for (let j = 0; j < detail_order.length; j++) {
                            let new_id_ = detail_order[j].new_id,
                                product_type_ = detail_order[j].product_type;

                            if (new_id == new_id_ && product_type == product_type_) {
                                so_tuan += parseInt(detail_order[j].bg_time) * parseInt(detail_order[j].count_product);
                                so_hoso += parseInt(detail_order[j].bg_hoso) * parseInt(detail_order[j].count_product);
                                gift_hoso +=
                                    parseInt(detail_order[j].bg_gift_hoso) * parseInt(detail_order[j].count_product);
                                time_gift_hoso +=
                                    parseInt(detail_order[j].bg_time_gift_hoso) *
                                    parseInt(detail_order[j].count_product);
                                arr_detail_service_item.push(detail_order[j]);
                            }
                        }
                        arr_detail_service.push({
                            product_id: detail_order[i].product_id,
                            product_type: product_type,
                            new_id: new_id,
                            so_tuan: so_tuan,
                            so_hoso: so_hoso,
                            gift_hoso: gift_hoso,
                            time_gift_hoso: time_gift_hoso,
                            bg_title: detail_order[i].bg_tuan,
                            new_title: detail_order[i].new_title,
                        });
                    }
                }
                // lọc các tin và loại dịch vụ trùng nhau trong mảng
                let arr_service = uniqueArray(
                    arr_detail_service,
                    (a, b) => (a.product_type === b.product_type) & (a.new_id === b.new_id)
                );
                // thực thi ghim tin và cộng điểm cho từng tin
                let total_hoso = 0,
                    tuan_hoso = 0,
                    total_gift_hoso = 0,
                    total_time_gift_hoso = 0;
                for (let s = 0; s < arr_service.length; s++) {
                    let _service = arr_service[s];
                    let datetime = new Date();
                    let time_han = datetime.setDate(datetime.getDate() + parseInt(_service.so_tuan) * 7) / 1000;
                    // ghim trang chủ
                    if (parseInt(_service.so_tuan) > 0) {
                        if (
                            _service.product_type == 1 ||
                            _service.product_type == 3 ||
                            _service.product_type == 4 ||
                            _service.product_type == 5
                        ) {
                            let data;
                            // box hấp dẫn: new_hot
                            if (_service.product_type == 1 || _service.product_type == 3) {
                                data = {
                                    new_order: 1,
                                    new_hot: 1,
                                    new_gap: 0,
                                    new_cao: 0,
                                };
                            }
                            // box thương hiệu: new_gap
                            else if (_service.product_type == 4) {
                                data = {
                                    new_order: 1,
                                    new_hot: 0,
                                    new_gap: 1,
                                    new_cao: 0,
                                };
                            }
                            // box tuyển gấp: new_cao
                            else if (_service.product_type == 5) {
                                data = {
                                    new_order: 1,
                                    new_hot: 0,
                                    new_gap: 0,
                                    new_cao: 1,
                                };
                            }
                            await NewTV365.updateOne(
                                { new_id: _service.new_id },
                                {
                                    $set: { ...data, new_vip_time: time_han },
                                }
                            );
                            // cập nhật trang thái trong bản ghi ghim tin là Đang hoạt động
                            await GhimHistory.updateOne(
                                { order_id: order_id, new_id: _service.new_id },
                                {
                                    $set: {
                                        status: 1,
                                        new_title: _service.new_title,
                                        bg_title: listTypeService(_service.product_type) + ' - ' + _service.bg_title,
                                        ghim_start: time,
                                        ghim_end: time_han,
                                    },
                                }
                            );
                        }
                        // ghim trang ngành
                        if (_service.product_type == 6) {
                            await NewTV365.updateOne(
                                { new_id: _service.new_id },
                                {
                                    $set: { new_nganh: 1, new_cate_time: time_han },
                                }
                            );
                            // cập nhật trang thái trong bản ghi ghim tin là Đang hoạt động
                            await GhimHistory.updateOne(
                                { order_id: order_id, new_id: _service.new_id },
                                {
                                    $set: {
                                        status: 1,
                                        new_title: _service.new_title,
                                        bg_title: listTypeService(_service.product_type) + ' - ' + _service.bg_title,
                                        ghim_start: time,
                                        ghim_end: time_han,
                                    },
                                }
                            );
                        }
                    }
                    // cộng điểm lọc hồ sơ
                    if (parseInt(_service.so_hoso) > 0) {
                        if (_service.product_type == 2 || _service.product_type == 3) {
                            total_hoso += parseInt(_service.so_hoso);
                            tuan_hoso += _service.so_tuan;
                        }
                    }
                    // cộng điểm hồ sơ đc tặng kèm
                    if (parseInt(_service.gift_hoso) > 0) {
                        total_gift_hoso += parseInt(_service.gift_hoso);
                        total_time_gift_hoso += parseInt(_service.time_gift_hoso);
                    }
                }
                total_hoso = total_hoso + total_gift_hoso;
                tuan_hoso = tuan_hoso + total_time_gift_hoso;
                if (total_hoso > 0) {
                    // check xem đơn hàng có đc tạo trươc hnay theo checkOrder.create_time, còn hạn
                    if (checkOrder.create_time <= 1697734800) total_hoso = total_hoso * 2;

                    // check bản ghi điểm của NTD ở bảng tbl_point_company
                    let point_ntd = await PointCompany.findOne({ usc_id: checkOrder.id_user });
                    let datetime = new Date();
                    let time_han_hoso = datetime.setDate(datetime.getDate() + parseInt(tuan_hoso) * 7) / 1000;
                    let point_chenh;
                    if (point_ntd) {
                        total_hoso = parseInt(point_ntd.point_usc) + total_hoso;
                        await PointCompany.updateOne(
                            { usc_id: checkOrder.id_user },
                            {
                                $set: {
                                    point_usc: total_hoso,
                                    ngay_reset_diem_ve_0: time_han_hoso,
                                },
                            }
                        );
                        point_chenh = parseInt(total_hoso) - parseInt(point_ntd.point_usc);
                    } else {
                        await new PointCompany({
                            usc_id: checkOrder.id_user,
                            point_usc: total_hoso,
                            ngay_reset_diem_ve_0: time_han_hoso,
                        }).save();
                        point_chenh = parseInt(total_hoso);
                    }
                    await new PointUsed({
                        usc_id: checkOrder.id_user,
                        point: point_chenh,
                        type: 1,
                        used_day: time,
                    }).save();
                }
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log('handleAdminAcceptOrder', e);
        return false;
    }
};

// api trực duyệt đơn hàng
exports.adminAcceptOrder = async (req, res, next) => {
    try {
        if (req.body.order_id && req.body.admin_id) {
            const order_id = Number(req.body.order_id);
            const admin_id = Number(req.body.admin_id);
            await handleAdminAcceptOrder(order_id, admin_id);
            return functions.success(res, 'Thành công', { data: { result: true } });
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// hàm xử lý đổi điểm thưởng mua hàng. và khi dùng điểm đã đổi mua hàng
const handleExchangePointOrder = async (userId, userType, point) => {
    try {
        let checkUser = await service.userExists(userId, userType);
        if (checkUser && point > 0) {
            let time = new Date().getTime() / 1000;
            let exchange_point = await SaveExchangePointOrder.find({
                userId: userId,
                userType: userType,
            }).sort({ id: -1 });
            if (exchange_point && exchange_point.length) {
                let point_plus_order = 0;
                let point_minus_order = 0;
                for (let i = 0; i < exchange_point.length; i++) {
                    if (exchange_point[i].unit_point == 0) {
                        point_plus_order += exchange_point[i].point;
                    } else {
                        point_minus_order += exchange_point[i].point;
                    }
                }
                let total_point_order = point_plus_order - point_minus_order;
                if (total_point_order >= 100 && point <= total_point_order) {
                    await new SaveExchangePointOrder({
                        userId: userId,
                        userType: userType,
                        order_id: 0,
                        point: point,
                        unit_point: 1,
                        is_used: 0,
                        time: time,
                    }).save();
                }
            }
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

// api đổi điểm thưởng mua hàng. và khi dùng điểm đã đổi mua hàng
exports.exchangePointOrder = async (req, res, next) => {
    try {
        if (req.body.userId && req.body.point) {
            const userId = Number(req.body.userId),
                userType = Number(req.body.userType) || 0,
                point = Number(req.body.point);

            await handleExchangePointOrder(userId, userType, point);
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// hàm xử lý admin hủy duyệt giấy phép kinh doanh NTD
const handleAcceptCancelGiaykdNtd = async (usc_id, usc_active_license) => {
    try {
        let checkUser = await service.userExists(usc_id, 1);
        if (checkUser) {
            await Users.updateOne(
                { idTimViec365: usc_id, type: 1 },
                {
                    $set: {
                        'inForCompany.timviec365.usc_active_license': usc_active_license,
                    },
                }
            );
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

// api admin hủy duyệt giấy phép kinh doanh NTD
exports.acceptCancelGiaykdNtd = async (req, res, next) => {
    try {
        if (req.body.usc_id && req.body.usc_active_license) {
            const usc_id = Number(req.body.usc_id),
                usc_active_license = Number(req.body.usc_active_license);

            await handleAcceptCancelGiaykdNtd(usc_id, usc_active_license);
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// api cập nhật trạng thái khi user login app chat và winform chat = đã tải app chat
exports.updateStatusDowloadChat365 = async (req, res, next) => {
    try {
        if (req.body.chat365_id) {
            const chat365_id = Number(req.body.chat365_id),
                status_dowload_appchat = Number(req.body.status_dowload_appchat) || 0,
                status_dowload_wfchat = Number(req.body.status_dowload_wfchat) || 0;

            let info_user = await Users.findOne({ _id: chat365_id });
            if (info_user) {
                await Users.updateOne(
                    { _id: chat365_id },
                    {
                        $set: {
                            'inForCompany.timviec365.status_dowload_appchat': status_dowload_appchat,
                            'inForCompany.timviec365.status_dowload_wfchat': status_dowload_wfchat,
                        },
                    }
                );
                return functions.success(res, 'Thành công', { data: { result: true } });
            } else {
                return functions.setError(res, 'Không tìm thấy thông tin tài khoản', 400);
            }
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// thực thi gói dịch vụ đã mua
const handlePostNewHandleService = async (newId, orderDetail) => {
    try {
        let time = new Date().getTime() / 1000;
        let info_new = await NewTV365.findOne({ new_id: newId });
        if (info_new) {
            let detail_order = await OrderDetails.aggregate([
                { $match: { id: orderDetail, use_product: 1 } },
                {
                    $lookup: {
                        from: 'PriceList',
                        localField: 'product_id',
                        foreignField: 'bg_id',
                        as: 'listing',
                    },
                },
                { $unwind: '$listing' },
                {
                    $lookup: {
                        from: 'Tv365Order',
                        localField: 'order_id',
                        foreignField: 'id',
                        as: 'order',
                    },
                },
                { $unwind: '$order' },
                {
                    $project: {
                        id: 1,
                        product_id: 1,
                        product_type: 1,
                        new_id: 1,
                        count_product: 1,
                        order_id: 1,
                        bg_time: '$listing.bg_time',
                        bg_hoso: '$listing.bg_hoso',
                        bg_tuan: '$listing.bg_tuan',
                        bg_gift_hoso: '$listing.bg_gift_hoso',
                        bg_time_gift_hoso: '$listing.bg_time_gift_hoso',
                        id_user: '$order.id_user',
                    },
                },
            ]);
            detail_order = detail_order[0];
            if (detail_order) {
                let so_tuan = parseInt(detail_order.bg_time) * parseInt(detail_order.count_product);
                let datetime = new Date();
                let time_han = datetime.setDate(datetime.getDate() + so_tuan * 7) / 1000;
                if (so_tuan > 0) {
                    if (
                        detail_order.product_type == 1 ||
                        detail_order.product_type == 3 ||
                        detail_order.product_type == 4 ||
                        detail_order.product_type == 5
                    ) {
                        let data;
                        // box hấp dẫn: new_hot
                        if (detail_order.product_type == 1 || detail_order.product_type == 3) {
                            data = {
                                new_order: 1,
                                new_hot: 1,
                                new_gap: 0,
                                new_cao: 0,
                            };
                        }
                        // box thương hiệu: new_gap
                        else if (detail_order.product_type == 4) {
                            data = {
                                new_order: 1,
                                new_hot: 0,
                                new_gap: 1,
                                new_cao: 0,
                            };
                        }
                        // box tuyển gấp: new_cao
                        else if (detail_order.product_type == 5) {
                            data = {
                                new_order: 1,
                                new_hot: 0,
                                new_gap: 0,
                                new_cao: 1,
                            };
                        }
                        await NewTV365.updateOne(
                            { new_id: newId },
                            {
                                $set: { ...data, new_vip_time: time_han },
                            }
                        );
                        // lưu lịch sử ghim tin
                        await new GhimHistory({
                            new_id: newId,
                            new_title: info_new.new_title,
                            new_user_id: info_new.new_user_id,
                            bg_type: detail_order.product_type,
                            bg_id: detail_order.product_id,
                            bg_title: listTypeService(detail_order.product_type) + ' - ' + detail_order.bg_tuan,
                            created_time: time,
                            ghim_start: time,
                            ghim_end: time_han,
                            status: 1,
                        }).save();
                    }
                    // ghim trang ngành
                    if (detail_order.product_type == 6) {
                        await NewTV365.updateOne(
                            { new_id: newId },
                            {
                                $set: { new_nganh: 1, new_cate_time: time_han },
                            }
                        );
                        // lưu lịch sử ghim tin
                        await new GhimHistory({
                            new_id: newId,
                            new_title: info_new.new_title,
                            new_user_id: info_new.new_user_id,
                            bg_type: detail_order.product_type,
                            bg_id: detail_order.product_id,
                            bg_title: listTypeService(detail_order.product_type) + ' - ' + detail_order.bg_title,
                            created_time: time,
                            ghim_start: time,
                            ghim_end: time_han,
                            status: 1,
                        }).save();
                    }
                }
                let total_hoso = 0,
                    tuan_hoso = 0;
                if (detail_order.product_type == 2 || detail_order.product_type == 3) {
                    total_hoso += parseInt(detail_order.bg_hoso) * parseInt(detail_order.count_product);
                    tuan_hoso += so_tuan;
                }
                let total_gift_hoso = parseInt(detail_order.bg_gift_hoso) * parseInt(detail_order.count_product);
                let total_time_gift_hoso =
                    parseInt(detail_order.bg_time_gift_hoso) * parseInt(detail_order.count_product);
                total_hoso = total_hoso + total_gift_hoso;
                tuan_hoso = tuan_hoso + total_time_gift_hoso;
                if (total_hoso > 0) {
                    // check bản ghi điểm của NTD ở bảng tbl_point_company
                    let point_ntd = await PointCompany.findOne({ usc_id: detail_order.id_user });
                    let datetime = new Date();
                    let time_han_hoso = datetime.setDate(datetime.getDate() + parseInt(tuan_hoso) * 7) / 1000;
                    let point_chenh;
                    if (point_ntd) {
                        total_hoso = parseInt(point_ntd.point_usc) + total_hoso;
                        await PointCompany.updateOne(
                            { usc_id: detail_order.id_user },
                            {
                                $set: {
                                    point_usc: total_hoso,
                                    ngay_reset_diem_ve_0: time_han_hoso,
                                },
                            }
                        );
                        point_chenh = parseInt(total_hoso) - parseInt(point_ntd.point_usc);
                    } else {
                        await new PointCompany({
                            usc_id: detail_order.id_user,
                            point_usc: total_hoso,
                            ngay_reset_diem_ve_0: time_han_hoso,
                        }).save();
                        point_chenh = parseInt(total_hoso);
                    }
                    await new PointUsed({
                        usc_id: detail_order.id_user,
                        point: point_chenh,
                        type: 1,
                        used_day: time,
                    }).save();
                }
                let data = await OrderDetails.updateOne(
                    { id: detail_order.id },
                    {
                        $set: {
                            use_product: 0,
                            new_id: newId,
                        },
                    }
                );
                let count_order_detail = await OrderDetails.find({
                    order_id: detail_order.order_id,
                    use_product: 1,
                }).count();
                if (count_order_detail == 0) {
                    await Order.updateOne(
                        { id: detail_order.order_id },
                        {
                            $set: {
                                use_order: 0,
                            },
                        }
                    );
                }
                return true;
            } else {
                console.log('Không tìm thấy gói dịch vụ đã mua');
                return false;
            }
        } else {
            console.log('Không tìm thấy tin tuyển dụng');
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
};
exports.postNewHandleService = async (req, res) => {
    try {
        if (req.body.newId && req.body.orderDetail) {
            const newId = Number(req.body.newId);
            const orderDetail = Number(req.body.orderDetail);
            await handlePostNewHandleService(newId, orderDetail);
            return functions.success(res, 'Thành công', { data: { result: true } });
        } else {
            return functions.setError(res, 'Không tìm thấy thông tin tài khoản', 400);
        }
    } catch (e) {
        console.log('error PostNewHandleService', e);
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    }
};

exports.getSupporterOrderList = async (req, res) => {
    try {
        let { adm_id, page, limit, code_order, name, phone, dateFrom, dateTo } = req.body;
        adm_id = Number(adm_id);
        page = Number(page);
        limit = Number(limit);
        dateFrom = Number(dateFrom);
        dateTo = Number(dateTo);
        let tenDaysAgo = functions.getTimeNow() - 3600 * 24 * 10;
        let oneDayInSeconds = 3600 * 24;
        if (!adm_id) return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        let admin = await AdminUser.findOne({ adm_id: adm_id });
        if (!admin) return functions.setError(res, 'Không tồn tại admin này', 400);
        if (!page) page = 1;
        if (!limit) limit = 30;
        if (!dateFrom) dateFrom = 0;
        if (tenDaysAgo > dateFrom) dateFrom = tenDaysAgo;
        if (!dateTo) dateTo = functions.getTimeNow();
        let skip = limit * (page - 1);
        let match = {
            create_time: { $gte: dateFrom, $lte: dateTo },
            hide_admin: 0,
            id_user: { $gt: 0 },
        };
        if (admin.adm_id != 4 && admin.adm_id != 32) {
            match['admin_id'] = admin.adm_bophan;
        }
        if (code_order) {
            match['code_order'] = { $regex: code_order };
        }
        if (name) {
            match['name'] = { $regex: name };
        }
        if (phone) {
            match['phone'] = { $regex: phone };
        }
        let aggrData = await Order.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'AdminUser',
                    let: { admin_id: '$admin_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$$admin_id', '$adm_bophan'] }, { $ne: ['$adm_bophan', 0] }],
                                },
                            },
                        },
                    ],
                    as: 'admin',
                },
            },
            {
                $unwind: {
                    path: '$admin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    list: [
                        { $sort: { id: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $set: {
                                adm_name: '$admin.adm_name',
                            },
                        },
                        { $unset: 'admin' },
                    ],
                },
            },
        ]);
        let list = [];
        let total = 0;
        if (aggrData[0] && aggrData[0].total.length) {
            list = aggrData[0].list;
            total = aggrData[0].total[0].count;
        }
        return functions.success(res, 'Thành công', { data: { list, total } });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.getAdminOrderList = async (req, res) => {
    try {
        let { page, limit, code_order, name, phone, dateFrom, dateTo } = req.body;
        page = Number(page);
        limit = Number(limit);
        dateFrom = Number(dateFrom);
        dateTo = Number(dateTo);
        let tenDaysAgo = functions.getTimeNow() - 3600 * 24 * 10;
        let oneDayInSeconds = 3600 * 24;
        if (!page) page = 1;
        if (!limit) limit = 30;
        if (!dateFrom) dateFrom = 0;
        if (tenDaysAgo > dateFrom) dateFrom = tenDaysAgo;
        if (!dateTo) dateTo = functions.getTimeNow();
        let skip = limit * (page - 1);
        let match = {
            create_time: { $gte: dateFrom, $lte: dateTo },
            hide_admin: 0,
            automatic: { $ne: 1 },
            admin_accept: { $gt: 0 },
            id_user: { $gt: 0 },
        };
        if (code_order) {
            match['code_order'] = { $regex: code_order };
        }
        if (name) {
            match['name'] = { $regex: name };
        }
        if (phone) {
            match['phone'] = { $regex: phone };
        }
        let aggrData = await Order.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'AdminUser',
                    let: { admin_id: '$admin_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$$admin_id', '$adm_bophan'] }, { $ne: ['$adm_bophan', 0] }],
                                },
                            },
                        },
                    ],
                    as: 'admin',
                },
            },
            {
                $unwind: {
                    path: '$admin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    list: [
                        { $sort: { id: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $set: {
                                adm_name: '$admin.adm_name',
                            },
                        },
                        { $unset: 'admin' },
                    ],
                },
            },
        ]);
        let list = [];
        let total = 0;
        if (aggrData[0] && aggrData[0].total.length) {
            list = aggrData[0].list;
            total = aggrData[0].total[0].count;
        }
        return functions.success(res, 'Thành công', { data: { list, total } });
    } catch (error) {
        console.log('error PostNewHandleService', error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.hideOrderAdmin = async (req, res) => {
    try {
        let { order_id } = req.body;
        if (!Array.isArray(order_id)) order_id = [order_id];
        order_id = order_id.map((id) => Number(id));
        await Order.updateMany(
            { id: { $in: order_id } },
            {
                $set: {
                    hide_admin: 1,
                },
            }
        );
        return functions.success(res, 'Thành công', { result: true });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.getGPKDNTDList = async (req, res) => {
    try {
        let { page, limit, usc_id, usc_phone, usc_email, usc_name } = req.body;
        page = Number(page);
        limit = Number(limit);
        if (!page) page = 1;
        if (!limit) limit = 30;
        let skip = limit * (page - 1);
        let match = {
            type: 1,
            'inForCompany.timviec365.usc_license': { $nin: [null, ''] },
        };
        if (usc_phone) {
            match['phoneTK'] = { $regex: usc_phone };
        }
        if (usc_email) {
            match['email'] = { $regex: usc_email };
        }
        if (usc_name) {
            match['userName'] = { $regex: usc_name };
        }
        if (usc_id) {
            match['idTimViec365'] = Number(usc_id);
        }
        let aggrData = await Users.aggregate([
            { $match: match },
            {
                $project: {
                    usc_id: '$idTimViec365',
                    usc_phone: '$phoneTK',
                    usc_email: '$email',
                    usc_name: '$userName',
                    usc_license: '$inForCompany.timviec365.usc_license',
                    usc_license_additional: { $ifNull: ['$inForCompany.timviec365.usc_license_additional', ''] },
                    usc_active_license: '$inForCompany.timviec365.usc_active_license',
                },
            },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    list: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
                },
            },
        ]);
        let list = [];
        let total = 0;
        if (aggrData[0] && aggrData[0].total.length) {
            list = aggrData[0].list;
            total = aggrData[0].total[0].count;
        }
        list.forEach((data) => {
            if (data.usc_license) {
                functions.getLicenseURL(data.usc_id, data.usc_license);
            }
            if (data.usc_license_additional) {
                functions.getLicenseURL(data.usc_id, data.usc_license_additional);
            }
        });
        return functions.success(res, 'Thành công', { data: { list, total } });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.getOrderCashflow = async (req, res) => {
    try {
        let { page, limit, code_order, dateFrom, dateTo } = req.body;
        page = Number(page);
        limit = Number(limit);
        dateFrom = Number(dateFrom);
        dateTo = Number(dateTo);
        let tenDaysAgo = functions.getTimeNow() - 3600 * 24 * 10;
        let oneDayInSeconds = 3600 * 24;
        if (!page) page = 1;
        if (!limit) limit = 30;
        if (!dateFrom) dateFrom = 0;
        if (tenDaysAgo > dateFrom) dateFrom = tenDaysAgo;
        if (!dateTo) dateTo = functions.getTimeNow();
        let skip = limit * (page - 1);
        let match = {
            create_time: { $gte: dateFrom, $lte: dateTo },
            status: { $nin: [0, 4] },
            hide_admin: 0,
            automatic: { $ne: 1 },
        };
        if (code_order) {
            match['code_order'] = { $regex: code_order };
        }
        let aggrData = await Order.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'AdminUser',
                    let: { admin_id: '$admin_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$$admin_id', '$adm_bophan'] }, { $ne: ['$adm_bophan', 0] }],
                                },
                            },
                        },
                    ],
                    as: 'admin',
                },
            },
            {
                $unwind: {
                    path: '$admin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    total_received: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: '$money_received' },
                            },
                        },
                    ],
                    total_bonus: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: '$money_bonus' },
                            },
                        },
                    ],
                    total_real_received: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: '$money_real_received' },
                            },
                        },
                    ],
                    list: [
                        { $sort: { id: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                code_order: 1,
                                adm_id: '$admin.adm_id',
                                adm_bophan: '$admin.adm_bophan',
                                adm_name: '$admin.adm_name',
                                create_time: 1,
                                money_received: 1,
                                money_bonus: 1,
                                money_real_received: 1,
                                id: 1,
                                id_user: 1,
                                admin_note: 1,
                            },
                        },
                    ],
                },
            },
        ]);
        let list = [];
        let total = 0;
        let total_received = 0;
        let total_bonus = 0;
        let total_real_received = 0;
        if (aggrData[0] && aggrData[0].total.length) {
            list = aggrData[0].list;
            total = aggrData[0].total[0].count;
        }
        if (aggrData[0].total_received.length) {
            total_received = aggrData[0].total_received[0].count;
        }
        if (aggrData[0].total_bonus.length) {
            total_bonus = aggrData[0].total_bonus[0].count;
        }
        if (aggrData[0].total_real_received.length) {
            total_real_received = aggrData[0].total_real_received[0].count;
        }
        return functions.success(res, 'Thành công', {
            data: { list, total, total_received, total_bonus, total_real_received },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.addOrderManually = async (req, res) => {
    try {
        let { code_order, create_time, admin_id, money_received, money_bonus, money_real_received, admin_note } =
            req.body;
        if (!admin_id && !code_order && !create_time && !money_received && !money_real_received && !admin_note)
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        let admin = await AdminUser.findOne({ adm_bophan: admin_id });
        if (!admin) return functions.setError(res, 'Không tồn tại chuyên viên này!', 404);
        let id = 0;
        let latestOrder = await Order.findOne().sort({ id: -1 }).lean();
        if (latestOrder) id = latestOrder.id + 1;
        await new Order({
            id,
            admin_id,
            code_order,
            create_time,
            money_received,
            money_bonus,
            money_real_received,
            admin_note,
            id_user: 0,
            type_user: 0,
            status: 1,
        }).save();
        return functions.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

exports.getSupporterList = async (req, res) => {
    try {
        let list = await AdminUser.find({
            adm_bophan: { $gt: 0 },
            adm_id: { $ne: 4 },
        })
            .sort({ adm_id: 1 })
            .select('adm_name adm_id adm_bophan');
        return functions.success(res, 'Thành công', { data: { list } });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã xảy ra lỗi', 400);
    }
};

// api tự động ghim tin sau khi ntd mua gói ghim tin tự động
exports.pinNewsAutomatic = async (req, res, next) => {
    try {
        if (req.body.order_id && req.body.admin_id) {
            const order_id = Number(req.body.order_id);
            const admin_id = Number(req.body.admin_id);
            let checkAdmin = await AdminUser.findOne({ adm_bophan: admin_id });
            let checkOrder = await Order.findOne({ id: order_id });
            if (checkAdmin && checkOrder) {
                // gửi thông báo cho NTD, chuyên viên và nhóm đơn hàng
                let time = new Date().getTime() / 1000;
                await Order.updateOne(
                    { id: order_id },
                    {
                        $set: {
                            status: 1,
                            admin_accept: 2,
                            accept_time_2: time,
                        },
                    }
                );
                let message = `Thông báo \n Đơn hàng với mã ${checkOrder.code_order} đã được mua tự động, đơn hàng chuyển sang trạng thái đang hoạt động.`;
                service.sendMessageToGroupOrder(message);
                if (checkOrder.type_user == 1) {
                    let infoCus = await Users.findOne({ idTimViec365: checkOrder.id_user });
                    let info_admin = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });

                    let messageKH = `Thông báo \n
        Đơn hàng với mã ${checkOrder.code_order} đã được mua thành công \n
        - Tên chuyên viên: ${info_admin.adm_name} \n
        - Số điện thoại: ${info_admin.adm_phone} \n
        - Zalo: ${info_admin.adm_mobile} \n
        - Email: ${info_admin.adm_email} \n
        - Hotline: 1900633682
        - Nhấn phím 1 \n
        Hãy liên hệ để được hỗ trợ.`;

                    service.sendMessageToIdChat(messageKH, infoCus._id);
                }
                let infoSupporter = await AdminUser.findOne({ adm_bophan: checkOrder.admin_id });
                if (infoSupporter) {
                    service.sendMessageToIdQlc(message, infoSupporter.emp_id);
                }

                // trừ tiền mua gói ghim tin
                let minusMoneyPackage = await PointCompany.findOneAndUpdate(
                    { usc_id: checkOrder.id_user },
                    { $inc: { money_usc: -checkOrder.final_price } },
                    { new: true }
                );
                await recordCreditsHistory(
                    checkOrder.id_user,
                    0,
                    checkOrder.final_price,
                    null,
                    '',
                    `${checkOrder.code_order}`,
                    minusMoneyPackage.money_usc,
                    8,
                    order_id
                );

                // lưu lịch sử sử dụng điểm khuyến mãi
                if (checkOrder.discount_fee != 0) {
                    await new HistoryPointPromotion({
                        userId: checkOrder.id_user,
                        userType: checkOrder.type_user,
                        order_id: order_id,
                        point: checkOrder.discount_fee / 1000,
                        time: time,
                    }).save();
                }

                // cộng điểm thưởng mua hàng
                let money_bonus_order = (checkOrder.final_price * 5) / 100 / 1000;

                await new SaveExchangePointOrder({
                    userId: checkOrder.id_user,
                    userType: checkOrder.type_user,
                    order_id: order_id,
                    point: money_bonus_order,
                    unit_point: 0,
                    time: time,
                }).save();

                // cập nhật tiền trong ví365 và lưu lại lịch sử cộng tiền khuyến mãi
                let amount_km = (checkOrder.final_price * 5) / 100;
                let plusMoneyKm = await PointCompany.findOneAndUpdate(
                    { usc_id: checkOrder.id_user },
                    { $inc: { money_usc: amount_km } },
                    { new: true }
                );

                await recordCreditsHistory(
                    checkOrder.id_user,
                    1,
                    amount_km,
                    null,
                    '',
                    `${checkOrder.code_order}`,
                    plusMoneyKm.money_usc,
                    5,
                    order_id
                );

                // KHI TRỰC DUYỆT SẼ TỰ ĐỘNG THỰC THI CÁC GÓI DỊCH VỤ MÀ NTD ĐÃ MUA
                let detail_order = await OrderDetails.aggregate([
                    { $match: { order_id: order_id, use_product: { $ne: 1 } } },
                    {
                        $lookup: {
                            from: 'PriceList',
                            localField: 'product_id',
                            foreignField: 'bg_id',
                            as: 'listing',
                        },
                    },
                    { $unwind: '$listing' },
                    {
                        $lookup: {
                            from: 'NewTV365',
                            localField: 'new_id',
                            foreignField: 'new_id',
                            as: 'new',
                        },
                    },
                    {
                        $unwind: {
                            path: '$new',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            id: 1,
                            product_id: 1,
                            product_type: 1,
                            new_id: 1,
                            count_product: 1,
                            bg_time: '$listing.bg_time',
                            bg_hoso: '$listing.bg_hoso',
                            bg_tuan: '$listing.bg_tuan',
                            bg_gift_hoso: '$listing.bg_gift_hoso',
                            bg_time_gift_hoso: '$listing.bg_time_gift_hoso',
                            new_title: '$new.new_title',
                            date_start: 1,
                        },
                    },
                ]);
                let arr_detail_service = [];
                if (detail_order && detail_order.length) {
                    for (let i = 0; i < detail_order.length; i++) {
                        let new_id = detail_order[i].new_id,
                            product_type = detail_order[i].product_type,
                            arr_detail_service_item = [],
                            so_tuan = 0,
                            so_hoso = 0,
                            gift_hoso = 0,
                            time_gift_hoso = 0;
                        for (let j = 0; j < detail_order.length; j++) {
                            let new_id_ = detail_order[j].new_id,
                                product_type_ = detail_order[j].product_type;

                            if (new_id == new_id_ && product_type == product_type_) {
                                so_tuan += parseInt(detail_order[j].bg_time) * parseInt(detail_order[j].count_product);
                                so_hoso += parseInt(detail_order[j].bg_hoso) * parseInt(detail_order[j].count_product);
                                gift_hoso +=
                                    parseInt(detail_order[j].bg_gift_hoso) * parseInt(detail_order[j].count_product);
                                time_gift_hoso +=
                                    parseInt(detail_order[j].bg_time_gift_hoso) *
                                    parseInt(detail_order[j].count_product);
                                arr_detail_service_item.push(detail_order[j]);
                            }
                        }
                        arr_detail_service.push({
                            product_id: detail_order[i].product_id,
                            product_type: product_type,
                            new_id: new_id,
                            so_tuan: so_tuan,
                            so_hoso: so_hoso,
                            gift_hoso: gift_hoso,
                            time_gift_hoso: time_gift_hoso,
                            bg_title: detail_order[i].bg_tuan,
                            new_title: detail_order[i].new_title,
                        });
                    }
                }
                // lọc các tin và loại dịch vụ trùng nhau trong mảng
                let arr_service = uniqueArray(
                    arr_detail_service,
                    (a, b) => (a.product_type === b.product_type) & (a.new_id === b.new_id)
                );
                // thực thi ghim tin và cộng điểm cho từng tin
                let total_hoso = 0,
                    tuan_hoso = 0,
                    total_gift_hoso = 0,
                    total_time_gift_hoso = 0;
                for (let s = 0; s < arr_service.length; s++) {
                    let _service = arr_service[s];
                    if (time > detail_order[0].date_start) {
                        let datetime = new Date();
                        let time_han = datetime.setDate(datetime.getDate() + parseInt(_service.so_tuan) * 7) / 1000;
                        // ghim trang chủ
                        if (parseInt(_service.so_tuan) > 0) {
                            if (
                                _service.product_type == 1 ||
                                _service.product_type == 3 ||
                                _service.product_type == 4 ||
                                _service.product_type == 5
                            ) {
                                let data;
                                // box hấp dẫn: new_hot
                                if (_service.product_type == 1 || _service.product_type == 3) {
                                    data = {
                                        new_order: 1,
                                        new_hot: 1,
                                        new_gap: 0,
                                        new_cao: 0,
                                    };
                                }
                                // box thương hiệu: new_gap
                                else if (_service.product_type == 4) {
                                    data = {
                                        new_order: 1,
                                        new_hot: 0,
                                        new_gap: 1,
                                        new_cao: 0,
                                    };
                                }
                                // box tuyển gấp: new_cao
                                else if (_service.product_type == 5) {
                                    data = {
                                        new_order: 1,
                                        new_hot: 0,
                                        new_gap: 0,
                                        new_cao: 1,
                                    };
                                }
                                await NewTV365.updateOne(
                                    { new_id: _service.new_id },
                                    {
                                        $set: { ...data, new_vip_time: time_han },
                                    }
                                );
                                // cập nhật trang thái trong bản ghi ghim tin là Đang hoạt động
                                await GhimHistory.updateOne(
                                    { order_id: order_id, new_id: _service.new_id },
                                    {
                                        $set: {
                                            status: 1,
                                            new_title: _service.new_title,
                                            bg_title:
                                                listTypeService(_service.product_type) + ' - ' + _service.bg_title,
                                            ghim_start: time,
                                            ghim_end: time_han,
                                        },
                                    }
                                );
                            }
                            // ghim trang ngành
                            if (_service.product_type == 6) {
                                await NewTV365.updateOne(
                                    { new_id: _service.new_id },
                                    {
                                        $set: { new_nganh: 1, new_cate_time: time_han },
                                    }
                                );
                                // cập nhật trang thái trong bản ghi ghim tin là Đang hoạt động
                                await GhimHistory.updateOne(
                                    { order_id: order_id, new_id: _service.new_id },
                                    {
                                        $set: {
                                            status: 1,
                                            new_title: _service.new_title,
                                            bg_title:
                                                listTypeService(_service.product_type) + ' - ' + _service.bg_title,
                                            ghim_start: time,
                                            ghim_end: time_han,
                                        },
                                    }
                                );
                            }
                        }
                    } else {
                        if (parseInt(_service.so_tuan) > 0) {
                            let time_han = Number(detail_order[0].date_start) + parseInt(_service.so_tuan) * 7 * 86400;
                            if (_service.product_type == 6) {
                                await NewTV365.updateOne(
                                    { new_id: _service.new_id },
                                    {
                                        $set: { new_cate_time: time_han },
                                    }
                                );
                            } else if (
                                _service.product_type == 1 ||
                                _service.product_type == 3 ||
                                _service.product_type == 4 ||
                                _service.product_type == 5
                            ) {
                                await NewTV365.updateOne(
                                    { new_id: _service.new_id },
                                    {
                                        $set: { new_vip_time: time_han },
                                    }
                                );
                            }
                            // cập nhật trang thái trong bản ghi ghim tin là Đang hoạt động
                            await GhimHistory.updateOne(
                                { order_id: order_id, new_id: _service.new_id },
                                {
                                    $set: {
                                        status: 1,
                                        new_title: _service.new_title,
                                        bg_title: listTypeService(_service.product_type) + ' - ' + _service.bg_title,
                                        ghim_start: time,
                                        ghim_end: time_han,
                                    },
                                }
                            );
                        }
                    }
                    // cộng điểm lọc hồ sơ
                    if (parseInt(_service.so_hoso) > 0) {
                        if (_service.product_type == 2 || _service.product_type == 3) {
                            total_hoso += parseInt(_service.so_hoso);
                            tuan_hoso += _service.so_tuan;
                        }
                    }
                    // cộng điểm hồ sơ đc tặng kèm
                    if (parseInt(_service.gift_hoso) > 0) {
                        total_gift_hoso += parseInt(_service.gift_hoso);
                        total_time_gift_hoso += parseInt(_service.time_gift_hoso);
                    }
                }
                total_hoso = total_hoso + total_gift_hoso;
                tuan_hoso = tuan_hoso + total_time_gift_hoso;
                if (total_hoso > 0) {
                    // check bản ghi điểm của NTD ở bảng tbl_point_company
                    let point_ntd = await PointCompany.findOne({ usc_id: checkOrder.id_user });
                    let datetime = new Date();
                    let time_han_hoso = datetime.setDate(datetime.getDate() + parseInt(tuan_hoso) * 7) / 1000;
                    let point_chenh;
                    if (point_ntd) {
                        total_hoso = parseInt(point_ntd.point_usc) + total_hoso;
                        await PointCompany.updateOne(
                            { usc_id: checkOrder.id_user },
                            {
                                $set: {
                                    point_usc: total_hoso,
                                    ngay_reset_diem_ve_0: time_han_hoso,
                                },
                            }
                        );
                        point_chenh = parseInt(total_hoso) - parseInt(point_ntd.point_usc);
                    } else {
                        await new PointCompany({
                            usc_id: checkOrder.id_user,
                            point_usc: total_hoso,
                            ngay_reset_diem_ve_0: time_han_hoso,
                        }).save();
                        point_chenh = parseInt(total_hoso);
                    }
                    await new PointUsed({
                        usc_id: checkOrder.id_user,
                        point: point_chenh,
                        type: 1,
                        used_day: time,
                    }).save();
                }
                return functions.success(res, 'Thành công');
            } else {
                return functions.setError(res, 'Thông tin truyền lên không tồn tại', 400);
            }
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};
