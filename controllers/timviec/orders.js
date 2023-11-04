const puppeteer = require("puppeteer");
const axios = require("axios");
const Users = require("../../models/Users");
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const PriceList = require("../../models/Timviec365/PriceList/PriceList");
const Order = require("../../models/Timviec365/Order");
const OrderDetails = require("../../models/Timviec365/OrderDetails");
const SaveExchangePointOrder = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointOrder");
const HistoryPointPromotion = require("../../models/Timviec365/UserOnSite/ManageHistory/HistoryPointPromotion");
const SaveExchangePoint = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePoint");
const ManagerPointHistory = require("../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const NewTV365 = require("../../models/Timviec365/UserOnSite/Company/New")
const functions = require("../../services/functions")
const service = require("../../services/timviec365/orders");
const { useCreditsHandler } = require("./credits");
const GhimHistory = require("../../models/Timviec365/UserOnSite/Company/GhimHistory");
const PointCompany = require("../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany")

const docHeight = () => {
    const body = document.body
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}


// xử lý mua hàng
const handleOrderProduct = async(id_user, type_user, name, phone, email, adm_id, count, price, chiet_khau, discount_vip, discount_fee, vat_fee, final_price, list_product, point_use, use_order, name_bank, account_bank, account_holder, content_bank, automatic) => {
    try {
        let checkUser = await Users.findOne({ idTimViec365: id_user, type: type_user });
        if (checkUser) {
            if (automatic == 1) {
                let checkMoney = await PointCompany.findOne({ usc_id: id_user });
                if (checkMoney && (checkMoney.money_usc < final_price)) {
                    return 0;
                }
            }
            adm_id = Number(adm_id);
            let adminUser = await AdminUser.findOne({ adm_bophan: adm_id }).lean();
            if (adminUser) {
                let time = functions.getTimeNow()
                let arr_product = JSON.parse(list_product);
                // let str_lst_product = arr_product.map(item => item.id_service);
                let arr_id_service = [];
                let arr_id_service_crm = [];
                for (let i = 0; i < arr_product.length; i++) {
                    if (arr_product[i].type_service != 7) {
                        arr_id_service.push(arr_product[i].id_service);
                    } else {
                        arr_id_service_crm.push(arr_product[i].id_service);
                    }
                }
                let list_service = await PriceList.find({ bg_id: { $in: arr_id_service } });
                if ((list_service && list_service.length > 0) || arr_id_service_crm.length > 0) {
                    let code_order = 'A' + service.random(1, 1000000);
                    let id = 0;
                    let latestOrder = await Order.findOne().sort({ id: -1 }).lean();
                    if (latestOrder) id = latestOrder.id + 1;
                    let savedOrder = await (new Order({
                        id: id,
                        code_order: code_order,
                        admin_id: adm_id,
                        id_user: id_user,
                        type_user: type_user,
                        name: name,
                        phone: phone,
                        email: email,
                        count: count,
                        price: price,
                        chiet_khau: chiet_khau,
                        discount_vip: discount_vip,
                        discount_fee: discount_fee,
                        vat_fee: vat_fee,
                        final_price: final_price,
                        use_order: use_order,
                        create_time: time,
                        name_bank: name_bank,
                        account_bank: account_bank,
                        account_holder: account_holder,
                        content_bank: content_bank,
                        automatic: automatic
                    })).save()
                    let id_order = savedOrder.id;
                    let detail_id = 0;
                    let latestOrderDetails = await OrderDetails.findOne().sort({ id: -1 }).lean();
                    if (latestOrderDetails) detail_id = latestOrderDetails.id + 1;
                    let promises = [];
                    for (let i = 0; i < arr_product.length; i++) {
                        let serviceDetail;
                        let product = arr_product[i];
                        if (product.type_service != 7) {
                            serviceDetail = await PriceList.findOne({
                                bg_id: product.id_service
                            });
                        } else {
                            serviceDetail = service.renderServiceDetailCRM(product.id_service, product.type_service);
                        }
                        if (product.type_service == 2) {
                            product.new_id = 0;
                        }
                        promises.push((new OrderDetails({
                            id: detail_id,
                            order_id: id_order,
                            product_id: product.id_service,
                            product_type: product.type_service,
                            price: serviceDetail.bg_gia,
                            chiet_khau: serviceDetail.bg_chiet_khau,
                            price_chiet_khau: serviceDetail.bg_thanh_tien,
                            new_id: product.new_id,
                            date_start: product.date_start,
                            count_product: product.count,
                            use_product: product.use_product,
                            created_at: time,
                        })).save());
                        detail_id++;
                        
                        // thêm lịch sử ghim tin với trạng thái đang chờ duyệt
                        if (product.new_id > 0) {
                            await (new GhimHistory({
                                new_id: product.new_id,
                                new_title: '',
                                new_user_id: id_user,
                                bg_type: product.type_service,
                                bg_id: product.id_service,
                                bg_title: '',
                                created_time: time,
                                ghim_start: 0,
                                ghim_end: 0,
                                status: 0,
                                order_id: id_order
                            })).save()
                        }

                    }
                    /**
                     * Thêm detail có id lớn nhất trước để giữ chỗ cho các bản ghi có id nhỏ hơn,
                     * tránh trường hợp ghi trùng id
                     */
                    await promises.pop();
                    await Promise.all(promises);


                    // lưu dữ liệu sử dụng điểm khuyến mại 
                    if (point_use > 0) {
                        await (new HistoryPointPromotion({
                            userId: id_user,
                            userType: type_user,
                            order_id: id_order,
                            point: point_use,
                            time: time,
                        })).save();
                        // cập nhật tiền trong ví365 và lưu lại lịch sử
                        if (automatic == 0) {
                            // cập nhật tiền trong ví365 và lưu lại lịch sử
                            let amount = point_use * 1000;
                            await useCreditsHandler(
                                id_user,
                                amount,
                                6,
                                `${code_order}`,
                                id_order
                            );
                        }
                    }

                    await service.sendMessageToSupporter(adminUser.emp_id, code_order, name, phone, adminUser.adm_name, final_price, id_order);

                    // gửi tin nhắn sang chat
                    let detail = await Users.findOne({ idTimViec365: id_user, type: 1 })
                    if (detail) {
                        // lưu ảnh đơn hàng ,lưu pdf  //https://timviec365.vn/mua-hang/hoa-don-mua-hang-o61
                        const browser = await puppeteer.launch({
                            headless: 'chrome',
                            args: ["--no-sandbox", "--disabled-setupid-sandbox", "--font-render-hinting=none", '--force-color-profile=srgb', '--disable-web-security']
                        });
                        let namepdf = `../storage/base365/timviec365/pdforder/order_${Number(id_order)}.pdf`;
                        let nameimg = `../storage/base365/timviec365/imageorder/order_${Number(id_order)}.png`;
                        const page = await browser.newPage();
                        const session = await page.target().createCDPSession();
                        await session.send('DOM.enable');
                        await session.send('CSS.enable');
                        session.on('CSS.fontsUpdated', event => {
                            // console.log(event);
                        });
                        const website_url = `https://dev.timviec365.vn/mua-hang/hoa-don-mua-hang-o${id_order}`;
                        await page.goto(website_url, { waitUntil: 'networkidle2' });
                        await page.emulateMediaType('screen');
                        await page.evaluateHandle('document.fonts.ready');
                        await page.pdf({
                            path: namepdf,
                            margin: { top: '50px', right: '0px', bottom: '0px', left: '0px' },
                            printBackground: true,
                        });
                        const height = await page.evaluate(docHeight);
                        await page.screenshot({
                            path: nameimg,
                            height: `${height}px`,
                            fullPage: true,
                            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
                        });
                        await axios({
                            method: "post",
                            url: "http://210.245.108.202:9000/api/message/SendMessageCv",
                            data: {
                                senderId: 1192,
                                userId: detail._id,
                                linkImg: `http://210.245.108.202:3001/base365/timviec365/imageorder/order_${id_order}.png`,
                                linkPdf: `http://210.245.108.202:3001/base365/timviec365/pdforder/order_${id_order}.pdf`
                            },
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        // cập nhật link pdf vào đơn hàng
                        let linkpdf = `http://210.245.108.202:3001/base365/timviec365/pdforder/order_${id_order}.pdf`;
                        await Order.updateOne({ id: id_order }, {
                            $set: { bill_pdf: linkpdf }
                        })
                    } else {
                        return id_order;
                    }
                    return id_order;
                } else {
                    return false;
                }
            } else {
                console.log('error check admin handleOrderProduct')
                return false;
            }
        } else {
            console.log('error check exist user handleOrderProduct')
            return false;
        }
    } catch (e) {
        console.log("Error handleOrderProduct", e);
        return false;
    }
}

// api mua hàng
exports.orderProduct = async(req, res, next) => {
    try {
        if (req.body.id_user && req.body.adm_id && req.body.count && req.body.list_product) {
            let {
                id_user,
                type_user,
                name,
                phone,
                email,
                adm_id,
                count,
                price,
                chiet_khau,
                discount_vip,
                discount_fee,
                vat_fee,
                final_price,
                /**
                 * 'id_service': bg_id,
                 * 'type_service': bg_type,
                 * 'new_id': new_id,
                 * 'date_start': date_start,
                 * 'count': <số lượng đặt mua>
                 */
                list_product, //JSON
                point_use,
                automatic
            } = req.body;

            // let final_price = ( price_per_product * count - discount_fee ) * (100 + vat_fee) / 100;
            const use_order = Number(req.body.use_order) || 0; // 1: đơn hàng có gói dịch vụ chưa đc sử dụng(dành cho gói ghim tin sau)
            const name_bank = String(req.body.name_bank); // tên ngân hàng
            const account_bank = String(req.body.account_bank); // số tài khoản
            const account_holder = String(req.body.account_holder); // chủ tài khoản
            const content_bank = String(req.body.content_bank); // nội dung chuyển khoản
            if (!automatic) {
                automatic = 0;
            } else {
                automatic = 1;
            }
            let result = await handleOrderProduct(id_user, type_user, name, phone, email, adm_id, count, price,
                chiet_khau, discount_vip, discount_fee, vat_fee, final_price, list_product, point_use, use_order,
                name_bank, account_bank, account_holder, content_bank, automatic);
            if (result) {
                return functions.success(res, "Đặt hàng thành công", { data: { result: true, id_order: result } })
            } else {
                if (result === 0) {
                    return functions.setError(res, "Số dư của bạn không đủ", 400);
                }
                return functions.setError(res, "Thông tin đặt hàng không đúng", 400);
            }
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}






exports.getPromotionalPoints = async(req, res) => {
    try {
        if (!req.user && !req.user.data) return functions.setError(res, "Không có dữ liệu người dùng", 400);
        let userId = req.user.data.idTimViec365;
        if (!userId) return functions.setError(res, "Không có dữ liệu người dùng", 400);
        let aggregation = [{
                $match: {
                    userId: userId,
                    userType: 1
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$point' }
                }
            }
        ]
        let pointPromoPromise = HistoryPointPromotion.aggregate(aggregation);
        let pointOrderPromise = SaveExchangePointOrder.aggregate(aggregation);
        let pointUsedPromise = SaveExchangePoint.aggregate(aggregation);

        let data = await Promise.all([pointPromoPromise, pointOrderPromise, pointUsedPromise]);

        const pointPromo = data[0].length ? data[0] : [{ total: 0 }];
        const pointOrder = data[1].length ? data[1] : [{ total: 0 }];
        const pointUsed = data[2].length ? data[2] : [{ total: 0 }];

        const totalPromo = pointPromo[0].total ? pointPromo[0].total : 0;
        const totalOrder = pointOrder[0].total ? pointOrder[0].total : 0;
        const totalUsed = pointUsed[0].total ? pointUsed[0].total : 0;

        const availablePoints = (totalPromo + totalOrder) - totalUsed;

        return functions.success(res, "Lấy điểm khuyến mãi thành công", { data: { point: availablePoints > 0 ? availablePoints : 0 } })

    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getDiscountData = async(req, res) => {
    try {
        // if (!req.user && !req.user.data) return functions.setError(res, "Không có dữ liệu người dùng", 400);
        // let userId = req.user.data.idTimViec365;
        // let userType = req.user.data.type;
        let {
            userId,
            userType
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Dữ liệu truyền lên không đủ", 400);
        userId = Number(userId);
        userType = Number(userType);
        let [
            pointPromo,
            pointOrder,
            pointUsed,
            managerHistory
        ] = await Promise.all([
            HistoryPointPromotion.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$point' }
                    }
                }
            ]),
            SaveExchangePointOrder.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $lookup: {
                        from: "Tv365OrderDetails",
                        localField: "order_id",
                        foreignField: "order_id",
                        as: "details"
                    }
                },
                { $addFields: { product_id: "$details.product_id" } },
                {
                    $lookup: {
                        from: "PriceList",
                        localField: "product_id",
                        foreignField: "bg_id",
                        as: "listing"
                    }
                },
                {
                    $facet: {
                        totalPoint: [{
                            $group: {
                                _id: null,
                                total: { $sum: "$point" }
                            }
                        }],
                        list: [
                            { $sort: { time: -1 } },
                            {
                                $addFields: {
                                    services: {
                                        $reduce: {
                                            input: "$listing",
                                            initialValue: "",
                                            in: {
                                                $cond: {
                                                    if: { $eq: [{ $indexOfArray: ["$listing", "$$this"] }, 0] },
                                                    then: { $concat: ["$$value", "$$this.bg_tuan"] },
                                                    else: { $concat: ["$$value", ", ", "$$this.bg_tuan"] }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    services: "$services",
                                    id: 1,
                                    userId: 1,
                                    userType: 1,
                                    order_id: 1,
                                    point: 1,
                                    unit_point: 1,
                                    type_point: 1,
                                    is_used: 1,
                                    time: 1,
                                }
                            }
                        ]
                    }
                }
            ]),
            SaveExchangePoint.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $facet: {
                        totalPoint: [{
                            $group: {
                                _id: null,
                                total: { $sum: "$point" },
                                money: { $sum: "$money" }
                            }
                        }],
                        list: [
                            { $sort: { time: -1 } },
                            {
                                $project: {
                                    id: 1,
                                    time: 1,
                                    point: 1,
                                    money: 1,
                                }
                            }
                        ]
                    }
                }
            ]),
            ManagerPointHistory.findOne({
                userId: userId,
                type: userType
            })
        ])
        let managerPoints = 0;
        let pointToChange = 0;
        let usedPoints = 0;
        let exchangedMoney = 0;
        let orderPoints = 0;
        let promoPoints = 0;
        let pointOrderList = [];
        let pointUsedList = [];
        if (pointUsed[0] && pointUsed[0].totalPoint && pointUsed[0].totalPoint.length) {
            usedPoints = pointUsed[0].totalPoint[0].total;
            exchangedMoney = pointUsed[0].totalPoint[0].money;
            pointUsedList = pointUsed[0].list;
        }
        if (pointPromo[0]) {
            promoPoints = pointPromo[0].total
        }
        if (pointOrder[0] && pointOrder[0].totalPoint.length) {
            orderPoints = pointOrder[0].totalPoint[0].total;
            pointOrderList = pointOrder[0].list
        }
        if (managerHistory) {
            managerPoints = managerHistory.sum;
            pointToChange = managerHistory.point_to_change;
        }
        let total_points = usedPoints + orderPoints;
        let exchanged_points = promoPoints;
        let available_points = total_points - exchanged_points;


        return functions.success(res, "Thành công", {
            data: {
                total: {
                    available_points,
                    total_points,
                    exchanged_points
                },
                history: {
                    sum: managerPoints,
                    point_to_change: pointToChange,
                    used_points: usedPoints,
                    exchanged_money: exchangedMoney,
                    list: pointUsedList
                },
                point_order: {
                    total: orderPoints,
                    list: pointOrderList
                }
            }
        })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getPriceListByType = async(req, res) => {
    try {
        let {
            bg_type
        } = req.body;
        if (!bg_type) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        let list = await PriceList.find({ bg_type });
        return functions.success(res, "Thành công", { data: list });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getNews = async(req, res) => {
    try {
        let {
            userId
        } = req.body;
        let newsList = [];
        newsList = await NewTV365.find({ new_user_id: userId, new_han_nop: { $gte: functions.getTimeNow() } }).sort({ new_update_time: -1 }).select("new_title new_id");
        return functions.success(res, "Thành công", {
            data: {
                newsList,
            }
        })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getLatestOrderId = async(req, res) => {
    try {
        let {
            userId,
            userType
        } = req.body;
        let latestOrder = await Order.findOne({ id_user: userId, type_user: userType }).sort({ id: -1 });
        return functions.success(res, "Thành công", {
            data: {
                order_id: latestOrder.id,
            }
        })

    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getOrderHistory = async(req, res) => {
    try {
        let {
            status,
            limit,
            page,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        status = Number(status);
        limit = Number(limit);
        page = Number(page);
        userId = Number(userId);
        userType = Number(userType);

        dateFrom = Number(dateFrom);
        dateTo = Number(dateTo);

        if (!page) page = 1;
        if (!limit) limit = 10;
        let skip = (page - 1) * limit;
        if (!userId) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        let match = {}
        if (!isNaN(status)) match["status"] = status;

        let tenDaysAgo = functions.getTimeNow() - 3600 * 24 * 10;
        if (!dateFrom) dateFrom = 0;
        if (tenDaysAgo > dateFrom) dateFrom = tenDaysAgo;
        if (!dateTo) dateTo = functions.getTimeNow();

        let adminData = await Users.aggregate([
            { $match: { idTimViec365: userId } },
            { $addFields: { usc_kd: "$inForCompany.usc_kd" } },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "usc_kd",
                    foreignField: "adm_bophan",
                    as: "admin"
                }
            },
            { $unwind: "$admin" },
            {
                $project: {
                    adm_name: "$admin.adm_name",
                    adm_bophan: "$admin.adm_bophan",
                    adm_id: "$admin.adm_id"
                }
            }
        ])
        let adm_name = "";
        let adm_bophan = 0;
        let adm_id = 0;
        if (adminData.length) {
            adm_name = adminData[0].adm_name;
            adm_bophan = adminData[0].adm_bophan;
            adm_id = adminData[0].adm_id;
        }
        let aggrData = await Order.aggregate([{
                $match: {
                    id_user: userId,
                    type_user: userType,
                    create_time: { $gte: dateFrom, $lte: dateTo }
                }
            },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    pending: [
                        { $match: { status: 0 } },
                        { $count: "count" }
                    ],
                    active: [
                        { $match: { status: 1 } },
                        { $count: "count" }
                    ],
                    completed: [
                        { $match: { status: 2 } },
                        { $count: "count" }
                    ],
                    expired: [
                        { $match: { status: 3 } },
                        { $count: "count" }
                    ],
                    cancelled: [
                        { $match: { status: 4 } },
                        { $count: "count" }
                    ],
                    listTotal: [
                        { $match: match },
                        { $count: "count" }
                    ],
                    total_final_price: [
                        { $match: match },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$final_price" }
                            }
                        }
                    ],
                    list: [
                        { $match: match },
                        { $sort: { create_time: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $addFields: {
                                adm_name: adm_name,
                                adm_bophan: adm_bophan,
                                adm_id: adm_id,
                            }
                        }
                    ]
                }
            }
        ])
        let list = [];
        let total = 0;
        let pending = 0;
        let active = 0;
        let completed = 0;
        let expired = 0;
        let cancelled = 0;
        let listTotal = 0;
        let total_money_order = 0;
        if (aggrData[0] && aggrData[0].total.length) {
            total = aggrData[0].total[0].count;
            list = aggrData[0].list
        }
        if (aggrData[0].pending.length) {
            pending = aggrData[0].pending[0].count;
        }
        if (aggrData[0].active.length) {
            active = aggrData[0].active[0].count;
        }
        if (aggrData[0].completed.length) {
            completed = aggrData[0].completed[0].count;
        }
        if (aggrData[0].expired.length) {
            expired = aggrData[0].expired[0].count;
        }
        if (aggrData[0].cancelled.length) {
            cancelled = aggrData[0].cancelled[0].count;
        }
        if (aggrData[0].listTotal.length) {
            listTotal = aggrData[0].listTotal[0].count;
        }
        if (aggrData[0].total_final_price.length) {
            total_money_order = aggrData[0].total_final_price[0].count;
        }
        return functions.success(res, "Thành công", {
            data: {
                list,
                listTotal,
                total,
                pending,
                active,
                completed,
                expired,
                cancelled,
                total_money_order
            }
        })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getOrderDetails = async(req, res) => {
    try {
        let {
            order_id
        } = req.body;
        order_id = Number(order_id);
        if (isNaN(order_id)) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        let tenDaysAgo = functions.getTimeNow() - 3600 * 24 * 10;
        let orderData = await Order.aggregate([
            { $match: { id: order_id, create_time: { $gte: tenDaysAgo } } },
            {
                $lookup: {
                    from: "Users",
                    let: { id_user: "$id_user", type_user: "$type_user" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$idTimViec365", "$$id_user"] },
                                    { $eq: ["$type", "$$type_user"] },
                                ]
                            }
                        }
                    }],
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $addFields: { usc_kd: "$user.inForCompany.usc_kd" }
            },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "usc_kd",
                    foreignField: "adm_bophan",
                    as: "admin"
                }
            },
            { $unwind: "$admin" },
            {
                $lookup: {
                    from: "Tv365OrderDetails",
                    pipeline: [{
                            $match: {
                                order_id: order_id
                            }
                        },
                        {
                            $lookup: {
                                from: "PriceList",
                                let: { product_id: "$product_id" },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$$product_id", "$bg_id"] },
                                                { $ne: ["$bg_type", "7"] }
                                            ]
                                        }
                                    }
                                }],
                                as: "listing"
                            }
                        },
                        {
                            $unwind: {
                                path: "$listing",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $lookup: {
                                from: "NewTV365",
                                localField: "new_id",
                                foreignField: "new_id",
                                as: "new"
                            }
                        },
                        {
                            $unwind: {
                                path: "$new",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                id: 1,
                                order_id: 1,
                                product_id: 1,
                                product_type: 1,
                                price: 1,
                                chiet_khau: 1,
                                price_chiet_khau: 1,
                                new_id: 1,
                                count_product: 1,
                                date_start: 1,
                                created_at: 1,
                                bg_tuan: "$listing.bg_tuan",
                                bg_type: "$listing.bg_type",
                                new_title: "$new.new_title",
                                bg_gia: "$listing.bg_gia",
                                bg_chiet_khau: "$listing.bg_chiet_khau",
                                bg_thanh_tien: "$listing.bg_thanh_tien",
                                bg_vat: "$listing.bg_vat",
                                bg_time: "$listing.bg_time",
                                bg_hoso: "$listing.bg_hoso",
                                bg_gift_hoso: "$listing.bg_gift_hoso",
                                bg_time_gift_hoso: "$listing.bg_time_gift_hoso",
                                use_product: { $ifNull: ["$use_product", 0] },
                            }
                        }
                    ],
                    as: "details"
                }
            },
            { $unwind: "$admin" },
            {
                $project: {
                    id: 1,
                    code_order: 1,
                    admin_id: 1,
                    id_user: 1,
                    type_user: 1,
                    name: 1,
                    phone: 1,
                    email: 1,
                    count: 1,
                    price: 1,
                    chiet_khau: 1,
                    discount_vip: 1,
                    discount_fee: 1,
                    vat_fee: 1,
                    final_price: 1,
                    status: 1,
                    admin_accept: 1,
                    accept_time_1: 1,
                    money_received: 1,
                    money_bonus: 1,
                    money_real_received: 1,
                    accept_time_2: 1,
                    bill_pdf: 1,
                    use_order: { $ifNull: ["$use_order", 0] },
                    hide_admin: 1,
                    create_time: 1,
                    name_bank: 1,
                    account_bank: 1,
                    account_holder: 1,
                    content_bank: 1,
                    automatic: 1,
                    adm_name: "$admin.adm_name",
                    adm_bophan: "$admin.adm_bophan",
                    adm_id: "$admin.adm_id",
                    adm_phone: "$admin.adm_phone",
                    adm_email: "$admin.adm_email",
                    usc_company: "$user.userName",
                    usc_address: "$user.address",
                    usc_mst: "$user.inForCompany.timviec365.usc_mst",
                    details: 1,
                    usc_manager: "$user.inForCompany.timviec365.usc_manager"
                }
            }
        ]);
        if (!orderData.length) return functions.setError(res, "Không có đơn hàng này", 404);
        return functions.success(res, "Thành công", { data: orderData[0] })

    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getPricelists = async(req, res) => {
    try {
        let { id_service } = req.body;
        if (!id_service) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        if (!Array.isArray(id_service)) id_service = [id_service]
        let data = await PriceList.find({ bg_id: { $in: id_service }, bg_type: { $ne: "7" } });
        return functions.success(res, "Thành công", { data })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.getVipData = async(req, res) => {
    try {
        // if (!req.user && !req.user.data) return functions.setError(res, "Không có dữ liệu người dùng", 400);
        // let userId = req.user.data.idTimViec365;
        // let userType = req.user.data.type;
        let {
            userId,
            userType
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Dữ liệu truyền lên không đủ", 400);
        userId = Number(userId);
        userType = Number(userType);
        let [
            pointPromo,
            pointOrder,
            pointUsed,
            managerHistory
        ] = await Promise.all([
            HistoryPointPromotion.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$point' }
                    }
                }
            ]),
            SaveExchangePointOrder.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $lookup: {
                        from: "Tv365OrderDetails",
                        localField: "order_id",
                        foreignField: "order_id",
                        as: "details"
                    }
                },
                { $addFields: { product_id: "$details.product_id" } },
                {
                    $lookup: {
                        from: "PriceList",
                        localField: "product_id",
                        foreignField: "bg_id",
                        as: "listing"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$point" }
                    }
                }
            ]),
            SaveExchangePoint.aggregate([{
                    $match: {
                        userId: userId,
                        userType: userType
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$point" },
                        money: { $sum: "$money" }
                    }
                }
            ]),
            ManagerPointHistory.findOne({
                userId: userId,
                type: userType
            })
        ])
        let managerPoints = 0;
        let pointToChange = 0;
        let usedPoints = 0;
        let exchangedMoney = 0;
        let orderPoints = 0;
        let promoPoints = 0;
        if (pointUsed[0]) {
            usedPoints = pointUsed[0].total;
            exchangedMoney = pointUsed[0].money;
        }
        if (pointPromo[0]) {
            promoPoints = pointPromo[0].total
        }
        if (pointOrder[0]) {
            orderPoints = pointOrder[0].total;
        }
        if (managerHistory) {
            managerPoints = managerHistory.sum;
            pointToChange = managerHistory.point_to_change;
        }
        let total_points = usedPoints + orderPoints;
        let exchanged_points = promoPoints;
        let available_points = total_points - exchanged_points;
        let vip = 0;
        let user = await Users.findOne({ idTimViec365: userId, type: userType }).select("inForCompany");
        if (user.inForCompany && user.inForCompany.timviec365) vip = user.inForCompany.timviec365.usc_vip;

        return functions.success(res, "Thành công", { data: { point: available_points, vip: vip ? vip : 0 } })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.downloadOrderPDF = async(req, res) => {
    try {
        let {
            id_order
        } = req.body;
        if (!id_order) return functions.setError(res, "Dữ liệu truyền lên không đủ", 400);
        const browser = await puppeteer.launch({
            headless: 'chrome',
            args: ["--no-sandbox", "--disabled-setupid-sandbox", "--font-render-hinting=none", '--force-color-profile=srgb', '--disable-web-security']
        });
        let namepdf = `../storage/base365/timviec365/pdforder/order_${Number(id_order)}.pdf`;
        let nameimg = `../storage/base365/timviec365/imageorder/order_${Number(id_order)}.png`;
        const page = await browser.newPage();
        const session = await page.target().createCDPSession();
        await session.send('DOM.enable');
        await session.send('CSS.enable');
        session.on('CSS.fontsUpdated', event => {});
        const website_url = `https://dev.timviec365.vn/mua-hang/hoa-don-mua-hang-o${id_order}`;
        await page.goto(website_url, { waitUntil: 'networkidle2' });
        await page.emulateMediaType('screen');
        await page.evaluateHandle('document.fonts.ready');
        await page.pdf({
            path: namepdf,
            margin: { top: '50px', right: '0px', bottom: '0px', left: '0px' },
            printBackground: true,
        });
        const height = await page.evaluate(docHeight);
        await page.screenshot({
            path: nameimg,
            height: `${height}px`,
            fullPage: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });
        let linkpdf = `http://210.245.108.202:3001/base365/timviec365/pdforder/order_${id_order}.pdf`;
        return functions.success(res, "Thành công", { data: { link: linkpdf } })
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}
exports.getServiceOrder = async(req, res) => {
    try {
        if (!req.body.id_user || !req.body.type_user)
            return functions.setError(res, "Dữ liệu truyền lên không đầy đủ")
        let {
            id_user,
            type_user,
        } = req.body
        id_user = Number(id_user)
        type_user = Number(type_user)
        let aggrData = await OrderDetails.aggregate([{
                $match: { use_product: 1 }
            },
            {
                $lookup: {
                    from: "Tv365Order",
                    let: { id: "$order_id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$id", "$$id"] },
                                    { $eq: ["$id_user", id_user] },
                                    { $eq: ["$type_user", type_user] },
                                    { $eq: ["$use_order", 1] },
                                    { $in: ["$status", [1, 2]] },
                                ]
                            }
                        }
                    }, ],
                    as: 'tv365Order'
                }
            },
            {
                $lookup: {
                    from: "PriceList",
                    let: { product_id: "$product_id" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$product_id", "$bg_id"] },
                                        { $ne: ["$bg_type", "7"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                bg_tuan: 1,
                            }
                        }
                    ],
                    as: 'priceList'
                }
            },
            { $unwind: "$priceList" },
            { $sort: { created_at: -1 } },
            { $unwind: "$tv365Order" },
            { $unset: "tv365Order" },
            {
                $project: {
                    id: 1,
                    order_id: 1,
                    product_id: 1,
                    product_type: 1,
                    price: 1,
                    chiet_khau: 1,
                    price_chiet_khau: 1,
                    new_id: 1,
                    count_product: 1,
                    date_start: 1,
                    created_at: 1,
                    bg_tuan: "$priceList.bg_tuan",
                }
            }
        ])

        return functions.success(res, "Thành công", {
            data: {
                aggrData
            }
        })
    } catch (e) {
        console.log(e)

        return functions.setError(res, 'Đã có lỗi xảy ra', 400)
    }
}