const functions = require('../../../services/CRM/CRMservice')
const fnc = require('../../../services/functions');
const set = require('../../../models/crm/account_api')
const axios = require('axios');
const http = require('http');
const md5 = require('md5');

// cài đặt hợp đồng 
exports.addContract = async(req, res) => {
    let { account, password, switchboard, domain, status } = req.body;
    let com_id = req.user.data.idQLC
    if ((account && password && switchboard && domain) == undefined) {
        functions.setError(res, " nhap thieu truong ")
    } else {
        let max = set.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean()
        const setting = new set({
            _id: Number(max) + 1 || 1,
            switchboard: switchboard,
            account: account,
            password: md5(password),
            domain: domain,
            status: status,
            created_at: new Date(),
        })
        await setting.save()
            .then(() => functions.success(res, "lasy thanh cong", { setting }))
            .catch((err) => functions.setError(res, err.message))
    }

}

//kết nối tổng đài kiểm tra theo com nếu có sẽ hiển thị ko có sẽ tạo mới
exports.connectTd = async(req, res) => {
    try {
        let { account, password, switchboard, domain, id } = req.body;
        const user = req.user.data;
        let com_id = user.type == 1 ? user.idQLC : user.inForPerson.employee.com_id;
        if (account && password && switchboard) {
            const time = fnc.getTimeNow();
            if (!id) {
                let max = set.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                const setting = new set({
                    id: Number(max.id) + 1 || 1,
                    switchboard: switchboard,
                    account: account,
                    password: password,
                    domain: domain,
                    created_at: time,
                    updated_at: time,
                })
                await setting.save();
            } else {
                await set.updateOne({ id: id }, {
                    $set: {
                        account: account,
                        password: password,
                        domain: domain,
                        updated_at: time
                    }
                });
            }
            return functions.success(res, 'Kết nối tài khoản thành công');
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (error) {
        return functions.setError(res, error)
    }

}

exports.switchboard_connect = async(req, res) => {
    try {
        const user = req.user.data;
        const switchboard = req.body.switchboard;
        let com_id = user.type == 1 ? user.idQLC : user.inForPerson.employee.com_id;
        const setting = await set.findOne({ com_id: com_id }, {
            $set: {
                com_id: com_id,
                switchboard: switchboard
            }
        }).select('status');
        if (setting) {
            const status = Math.abs(Number(setting.status) - 1);
            await set.updateOne({ com_id: com_id }, {
                $set: { status: status }
            });
            return functions.success(res, 'Kết nối tài khoản thành công');
        }
        return functions.setError(res, 'Cấu hình chưa được cài đặt');
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}