const axios = require('axios')
const functions = require('../../../services/functions')
const HistoryZalo = require('../../../models/crm/Marketing/HistoryZalo');
const ManagerZalo = require('../../../models/crm/Marketing/ManagerZalo');

const refreshTokenZalo = async (app_id, secret_key, refresh_token, com_id) => {
    try {
        const response = await axios({
            method: "post",
            url: `https://oauth.zaloapp.com/v4/oa/access_token`,
            data: {
                "refresh_token": refresh_token,
                "app_id": app_id,
                "grant_type": "refresh_token",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "secret_key": secret_key
            }
        })
        if (response.data.access_token) {
            await ManagerZalo.updateOne({ com_id: Number(com_id) }, { $set: { access_token: response.data.access_token, refresh_token: response.data.refresh_token, create_at: new Date() } })
            return {
                err: false,
                message: response.data.access_token
            }
        }
        if (response.data.error == -14020) {
            return {
                err: true,
                message: 'Refresh token hết hạn.'
            }
        }
        if (response.data.error == -14014) {
            return {
                err: true,
                message: 'Refresh token không chính xác'
            }
        }
        if (response.data.error == -14002) {
            return {
                err: true,
                message: 'App Id không chính xác'
            }
        }
        if (response.data.error == -14004) {
            return {
                err: true,
                message: 'Secret key không chính xác'
            }
        }
        else {
            return {
                err: true,
                message: response.data.error_name
            }
        }
    } catch (err) {
        console.log(err)
        return {
            err: true,
            message: err.message
        }
    }
}

exports.getListHistory = async (req, res, next) => {
    try {
        const user = req.user
        const managerZalo = await ManagerZalo.findOne({ com_id: Number(user.data.com_id) })
        let access_token = managerZalo.access_token
        const response = await axios({
            method: "get",
            url: `https://business.openapi.zalo.me/message/quota`,
            headers: {
                "Content-Type": "application/json",
                "access_token": access_token
            }
        });
        if (response.data?.error == -124) {
            const responseRefreshToken = await refreshTokenZalo(managerZalo.app_id, managerZalo.secret_key, managerZalo.refresh_token, managerZalo.com_id)
            if (responseRefreshToken.err) {
                return functions.setError(res, responseRefreshToken.message);
            }
            else {
                access_token = responseRefreshToken.message
            }
        }
        const listHistory = await HistoryZalo.aggregate([
            {
                $match: {
                    company_id: user.data.com_id
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "emp_id",
                    foreignField: "idQLC",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    userName: "$user.userName",
                    phone_number: "$phone_number",
                    created_at: {
                        '$dateToString': {
                            'date': '$created_at',
                            'timezone': '+07:00',
                            'format': '%H:%M-%d/%m/%G'
                        }
                    },
                    message_id: "$message_id",
                    templateId: "$templateId",
                    status: 'Đã gửi'
                }
            }
        ]);

        const listIdTemplate = [...new Set(listHistory.map(item => item.templateId))];
        const templatePromises = listIdTemplate.map(templateId =>
            axios.get(`https://business.openapi.zalo.me/template/info?template_id=${templateId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "access_token": access_token
                }
            })
        );

        const templateResponses = await Promise.all(templatePromises);
        const listTemplate = templateResponses
            .filter(response => response?.data?.data)
            .map(response => ({
                id: response.data.data.templateId,
                name: response.data.data.templateName
            }));

        const data = listHistory.map(item => {
            const tmp = listTemplate.find(e => e.id == item.templateId);
            item.templateName = tmp.name;
            return item;
        });

        const figData = [
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
            {
                userName: 'NCT',
                phone_number: '012345678',
                created_at: '2023/10/27 10:10',
                message_id: '1234',
                templateId: '1111',
                status: 'Đã gửi',
                templateName: 'Marketing Zalo'
            },
        ]

        return functions.success(res, "Lấy danh sách lịch sử thành công", { figData });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.getListDetailTemplate = async (req, res, next) => {
    try {
        const user = req.user
        const managerZalo = await ManagerZalo.findOne({ com_id: Number(user.data.com_id) })
        let access_token = managerZalo.access_token
        const response = await axios({
            method: "get",
            url: `https://business.openapi.zalo.me/template/all?offset=0&limit=100`,
            headers: {
                "Content-Type": "application/json",
                "access_token": access_token
            }
        });
        if (response.data?.error == -124) {
            responseRefreshToken = await refreshTokenZalo(managerZalo.app_id, managerZalo.secret_key, managerZalo.refresh_token, managerZalo.com_id)
            if (responseRefreshToken.err) {
                return functions.setError(res, responseRefreshToken.message);
            }
            else {
                access_token = responseRefreshToken.message
            }
            const response = await axios({
                method: "get",
                url: `https://business.openapi.zalo.me/template/all?offset=0&limit=100`,
                headers: {
                    "Content-Type": "application/json",
                    "access_token": access_token
                }
            });
            if (!response?.data?.data) {
                return functions.setError(res, { message: response.data.message });
            }
        }

        const listTemplate = response.data.data;
        const templatePromises = listTemplate.map(async (template) => {
            const response1 = await axios({
                method: "get",
                url: `https://business.openapi.zalo.me/template/info?template_id=${template.templateId}`,
                headers: {
                    "Content-Type": "application/json",
                    "access_token": access_token
                }
            });
            console.log(response1.data)
            if (response1.data.data.previewUrl) {
                return {
                    templateId: template.templateId,
                    templateName: template.templateName,
                    createAt: `${new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getFullYear()}-${('0' + (new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getMonth() + 1)).slice(-2)}-${('0' + new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getDate()).slice(-2)} ${('0' + new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getHours()).slice(-2)}:${('0' + new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getMinutes()).slice(-2)}:${('0' + new Date(Number(template.createdTime) + 7 * 60 * 60 * 1000).getSeconds()).slice(-2)}`,
                    status: template.status,
                    previewUrl: response1.data.data.previewUrl,
                    price: response1.data.data.price
                };
            }
        });

        const templateData = await Promise.all(templatePromises);
        const figData = [
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "abd dksdo ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "snjs lưdj",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "test aaa",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "tettt aac",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "lsdkjdsk ldd",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
            {
                "templateId": 290847,
                "templateName": "Chương trình khuyến mãi ",
                "createAt": "2023-10-27 05:24:32",
                "status": "PENDING_REVIEW",
                "previewUrl": "https://account.zalo.cloud/znspreview/QhvPYzkabg2ebh3MKAf9IA==",
                "price": "200.0"
            },
        ]

        return functions.success(res, "Lấy danh sách template thành công", { data: figData });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.getListTemplate = async (req, res) => {
    try {
        const user = req.user
        const managerZalo = await ManagerZalo.findOne({ com_id: Number(user.data.com_id) })
        let response
        response = await axios({
            method: "get",
            url: `https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=1`,
            headers: {
                "Content-Type": "application/json",
                "access_token": managerZalo.access_token
            }
        });
        if (response.data?.error == -124) {
            const responseRefreshToken = await refreshTokenZalo(managerZalo.app_id, managerZalo.secret_key, managerZalo.refresh_token, managerZalo.com_id)
            if (responseRefreshToken.err) {
                return functions.setError(res, responseRefreshToken.message);
            }
            else {
                access_token = responseRefreshToken.message
            }
            response = await axios({
                method: "get",
                url: `https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=1`,
                headers: {
                    "Content-Type": "application/json",
                    "access_token": access_token
                }
            })
            if (!response?.data?.data) {
                return functions.setError(res, { message: response.data.message });
            }
        }
        const listTemplate = response.data.data.map(template => {
            return {
                templateId: template.templateId,
                templateName: template.templateName
            }
        });
        return functions.success(res, "Lấy danh sách template thành công", { data: listTemplate });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.sendMessageZalo = async (req, res) => {
    try {
        const { phone, template_id } = req.body
        const response = await axios({
            method: "post",
            url: `https://business.openapi.zalo.me/message/template`,
            data: {
                "phone": phone,
                "template_id": template_id,
                "template_data": {},
                // "tracking_id": ""
            },
            headers: {
                "Content-Type": "application/json",
                "access_token": process.env.ACCESS_TOKEN_ZALO
            }
        })

    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.getQuota = async (req, res) => {
    try {
        const user = req.user
        const managerZalo = await ManagerZalo.findOne({ com_id: Number(user.data.com_id) })
        let access_token = managerZalo.access_token
        let response
        response = await axios({
            method: "get",
            url: `https://business.openapi.zalo.me/message/quota`,
            headers: {
                "Content-Type": "application/json",
                "access_token": access_token
            }
        });
        if (response.data?.error == -124) {
            responseRefreshToken = await refreshTokenZalo(managerZalo.app_id, managerZalo.secret_key, managerZalo.refresh_token, managerZalo.com_id)
            if (responseRefreshToken.err) {
                return functions.setError(res, responseRefreshToken.message);
            }
            else {
                access_token = responseRefreshToken.message
            }
            response = await axios({
                method: "get",
                url: `https://business.openapi.zalo.me/message/quota`,
                headers: {
                    "Content-Type": "application/json",
                    "access_token": access_token
                }
            });
            if (!response?.data?.data) {
                return functions.setError(res, response.data.message);
            }
        }
        return functions.success(res, "Lấy số lượng tin nhắn còn lại thành công", { data: response.data.data });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.managerZalo = async (req, res) => {
    try {
        const user = req.user
        const { app_id, secret_key, access_token, refresh_token } = req.body
        const managerZalo = await ManagerZalo.findOne({ com_id: user.data.com_id })
        if (user.data.type == 1) {
            if (managerZalo) {
                await ManagerZalo.updateOne({ com_id: user.data.com_id }, { app_id, secret_key, access_token, refresh_token })
                const responseRefreshToken = await refreshTokenZalo(managerZalo.app_id, managerZalo.secret_key, managerZalo.refresh_token, managerZalo.com_id)
                if (responseRefreshToken.err) {
                    return functions.setError(res, responseRefreshToken.message);
                }
            }
            else {
                await ManagerZalo.create({
                    com_id: user.data.com_id,
                    app_id,
                    secret_key,
                    access_token,
                    refresh_token,
                    create_at: new Date()
                })
                const responseRefreshToken = await refreshTokenZalo(app_id, secret_key, refresh_token, user.data.com_id)
                if (responseRefreshToken.err) {
                    return functions.setError(res, responseRefreshToken.message);
                }
            }
            return functions.success(res, "Kết nối thành công", {});
        } else {
            if (!managerZalo) {
                return functions.setError(res, 'Công ty chưa thiết lập kết nối zalo');
            }
            if (app_id === managerZalo.app_id && secret_key === managerZalo.secret_key && access_token === managerZalo.access_token && refresh_token === managerZalo.refresh_token) {
                return functions.success(res, "Kết nối thành công", {});
            }
            else {
                return functions.setError(res, 'Kết nối thất bại');
            }
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.getInforZalo = async (req, res) => {
    try {
        const user = req.user
        const managerZalo = await ManagerZalo.findOne({ com_id: user.data.com_id }, { app_id: 1, secret_key: 1, access_token: 1, refresh_token: 1 })
        if (managerZalo) {
            return functions.success(res, "Kết nối thành công", { data: managerZalo });
        } else {
            return functions.setError(res, 'Công ty chưa thiết lập tài khoản zalo');
        }
    } catch (err) {
        console.log(error);
        return functions.setError(res, error);
    }
}