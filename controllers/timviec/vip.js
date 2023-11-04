const axios = require('axios');
const Users = require('../../models/Users');
const Order = require('../../models/Timviec365/Order');
const ManagerPointHistory = require('../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory');
const SaveAccountVip = require('../../models/Timviec365/UserOnSite/ManageHistory/SaveAccountVip');
const functions = require('../../services/functions');
const { saveHistory } = require('./history/utils');
const service = require('../../services/timviec365/orders');
const md5 = require('md5');

const generateOTP = () => Math.floor(Math.random() * 899999) + 100000;

const getFirstDayOfLastMonth = () =>
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime() /
    1000;
const getLastDayOfLastMonth = () =>
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() /
        1000 +
    24 * 3600 -
    1;

const sendmailHunghapay = async (
    partner,
    toAddress,
    subject,
    body,
    int_type
) => {
    try {
        let soapUrl = 'http://ctyhungha.com/soap/server_mail.php?wsdl'; // asmx URL of WSDL
        // xml post structure

        let xml_post_string = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <CreateMail xmlns="http://tempuri.org/">
              <partner>${partner}</partner>
              <toAddress>${toAddress}</toAddress>
              <subject>${subject}</subject>
              <body>${body}</body>
              <type>${int_type}</type>
            </CreateMail>
          </soap:Body>
        </soap:Envelope>`; // data from the form, e.g. some ID number
        let headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            Accept: 'text/xml',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
        };
        let data = await axios.post(soapUrl, xml_post_string, { headers });
    } catch (error) {
        console.log('error', error.response.data);
    }
};

const createSendMail = async (
    toFrom,
    toAddress,
    ccAddress,
    bccAddress,
    subject,
    body,
    type
) => {
    await sendmailHunghapay('TV365', toAddress, subject, body, type);
};

const sendVerificationEmail = async (email, otp) => {
    email = email.trim();

    let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;"><table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000"><tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;"><td style="padding-top: 23px;float: left;"><img src="https://timviec365.vn/images/email/logo2.png"></td><td style="text-align: left;float: right;"><ul style="margin-top: 15px;padding-left: 0px;"><li style="list-style-type: none;padding-bottom: 5px;height:25px;font-size:18px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-weight: 700;">100,000+ </span><span>Công việc mơ ước</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;font-size:18px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-weight: 700;">365+ </span><span>Mẫu CV chuyện nghiệp</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;font-size:18px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-weight: 700;">22+ </span><span>Bộ đề câu hỏi tuyển dụng</span></li></ul></td></tr><tr  style="float: left;padding:10px 30px 30px 30px;"><td colspan="2"><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;"></span></p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Yêu cầu xác thực email của bạn đã được tiếp nhận</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Vui lòng nhập mã OTP để hoàn thành quá trình xác thực:</p><p style="margin: auto;color:#fff;margin-top: 45px;font-size: 20px;line-height: 40px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;">${otp}</p></td></tr><tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;"><td style="padding-top: 50px;"><ul><li style="list-style-type: none;color: #ffa111;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span></li><li style="list-style-type: none;color: #ffa111;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span></li></ul></td></tr><tr style="height: 86px;background-color: #dad7d7;"><td style="text-align: center;" colspan="2"><p style="margin:5px;"><span style="font-weight: 600;font-style: italic;">Chú ý</span> : Đây là mail tự động không nhận mail phản hồi</p></td></tr></table></body>`;

    let buff = Buffer.from(body);
    let base64data = buff.toString('base64');
    body = base64data;

    await createSendMail(
        email,
        email,
        '',
        '',
        'Timviec365 - Xác thực email! - ' + functions.getTimeNow(),
        body,
        15
    );
};

exports.checkIsUserOrdered = async (req, res) => {
    try {
        let { userId, userType } = req.body;
        let order = await Order.findOne({
            id_user: userId,
            type_user: userType,
            status: { $nin: [0, 4] },
        });
        if (!order) return functions.success(res, 'Thành công', { order: 0 });
        return functions.success(res, 'Thành công', { order: 1 });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

exports.getLastMonthTotalSpending = async (req, res) => {
    try {
        let { userId, userType } = req.body;
        userId = Number(userId);
        userType = Number(userType);
        let from = getFirstDayOfLastMonth();
        let to = getLastDayOfLastMonth();
        let aggrData = await Order.aggregate([
            {
                $match: {
                    id_user: userId,
                    type_user: userType,
                    create_time: { $gte: from, $lte: to },
                    status: { $nin: [0, 4] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$final_price' },
                },
            },
        ]);
        let total = 0;
        if (aggrData[0]) {
            total = aggrData[0].total;
        }
        return functions.success(res, 'Thành công', { total });
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

exports.sendOTPVerifyEmail = async (req, res) => {
    try {
        let { userId, email, password } = req.body;
        let otp = generateOTP();
        if (password) {
            let user = await Users.findOne({
                password: md5(password),
                idTimViec365: userId,
                type: 1,
            });
            if (!user || !user.inForCompany || !user.inForCompany.timviec365) {
                return functions.setError(res, 'Mật khẩu không đúng', 400);
            }

            if (
                !user.inForCompany.timviec365.usc_name_email ||
                !user.inForCompany.timviec365.usc_name_email.includes('@')
            ) {
                return functions.setError(
                    res,
                    'Bạn cần cập nhật email trước khi xác thực',
                    400
                );
            }

            await Users.updateOne(
                { idTimViec365: userId, type: 1 },
                {
                    $set: { 'inForCompany.timviec365.usc_xacthuc_email': otp },
                }
            );
            let email = user.inForCompany.timviec365.usc_name_email;
            await sendVerificationEmail(email, otp);
            return functions.success(res, 'Thành công');
        } else {
            if (email && email.includes('@')) {
                await Users.updateOne(
                    { idTimViec365: userId, type: 1 },
                    {
                        $set: {
                            'inForCompany.timviec365.usc_xacthuc_email': otp,
                        },
                    }
                );
                await sendVerificationEmail(email, otp);
                return functions.success(res, 'Thành công');
            } else {
                return functions.setError(res, 'Đã có lỗi xảy ra', 400);
            }
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

exports.updateVipNTD = async (req, res) => {
    try {
        let { userId, otp, vip } = req.body;
        vip = Number(vip);
        let time = functions.getTimeNow();
        let point = 0;
        if (vip < 1) vip = 1;
        if (vip > 6) vip = 6;
        if (vip == 1) point = 2;
        if (vip == 2) point = 4;
        if (vip == 3) point = 8;
        if (vip == 4) point = 9;
        if (vip == 5) point = 10;
        if (vip == 6) point = 11;

        let update = {};
        let user = await Users.findOne({ idTimViec365: userId, type: 1 });
        if (!user) return functions.setError(res, 'Đã có lỗi xảy ra', 400);
        if (
            otp > 0 &&
            vip == 1 &&
            String(otp) !==
                String(user.inForCompany.timviec365.usc_xacthuc_email)
        )
            return functions.setError(res, 'Mã OTP không đúng!', 400);
        // if ((String(otp) == String(user.otp))) {
        //     update["inForCompany.timviec365.usc_xacthuc_email"] = 1;
        // }
        update['inForCompany.timviec365.usc_vip'] = vip;
        await Users.updateOne(
            { idTimViec365: userId, type: 1 },
            {
                $set: update,
            }
        );
        await new SaveAccountVip({
            userId: userId,
            userType: 1,
            type_vip: vip,
            time: time,
        }).save();
        let history = await ManagerPointHistory.findOne({
            userId: userId,
            type: 1,
        });
        if (history) {
            history.point_vip = point;
        } else {
            history = new ManagerPointHistory({
                userId: userId,
                type: 1,
                point_to_change: point,
                point_vip: point,
                sum: point,
            });
        }
        await saveHistory(history);
        return functions.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

exports.updateGPKDNTD = async (req, res) => {
    try {
        let { userId, userType, usc_active_license } = req.body;
        let user = await Users.findOne({
            idTimViec365: userId,
            type: userType,
        });
        if (!user)
            return functions.setError(res, 'Không tồn tại người dùng!', 400);
        let dataUpdate = {};
        let Files = req.files || null;
        if (Files && Files.usc_license) {
            let license = await functions.uploadLicense(
                userId,
                Files.usc_license
            );
            dataUpdate['inForCompany.timviec365.usc_license'] = license;
            dataUpdate['inForCompany.timviec365.usc_active_license'] =
                usc_active_license;
        }
        if (Files && Files.usc_license_additional) {
            let license = await functions.uploadLicense(
                userId,
                Files.usc_license_additional
            );
            dataUpdate['inForCompany.timviec365.usc_license_additional'] =
                license;
            dataUpdate['inForCompany.timviec365.usc_active_license'] =
                usc_active_license;
        }
        await Users.updateOne(
            { idTimViec365: userId, type: userType },
            {
                $set: dataUpdate,
            }
        );
        if (usc_active_license == 1) {
            service.updateVipNTD(userId, 0, 2);
        }
        return functions.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};
