const CustomerContact = require("../../../models/crm/Customer/contact_customer");
const Customer = require("../../../models/crm/Customer/customer");
const functions = require("../../../services/functions");
const customerService = require("../../../services/CRM/CRMservice");
const User = require("../../../models/Users");
const ConnectApi = require("../../../models/crm/connnect_api_config");
const HistoryEditCustomer = require("../../../models/crm/history/history_edit_customer");
const ShareCustomer = require("../../../models/crm/tbl_share_customer");
const NhomKH = require("../../../models/crm/Customer/customer_group");
const GroupCustomer = require("../../crm/Customer/GroupCustomer");
const CustomerStatus = require("../../crm/Customer/CustomerStatus");
const moment = require('moment');
// hàm thêm mới khách hang
exports.addCustomer = async(req, res) => {
    try {
        let {
            email,
            name,
            stand_name,
            phone_number,
            cit_id,
            district_id,
            ward,
            address,
            ship_invoice_address,
            cmnd_ccnd_number,
            cmnd_ccnd_address,
            cmnd_ccnd_time,
            user_handing_over_work,
            resoure,
            description,
            tax_code,
            group_id,
            status,
            business_areas,
            category,
            business_type,
            classify,
            bill_city,
            bil_district,
            bill_ward,
            bill_address,
            bill_area_code,
            bill_invoice_address,
            bill_invoice_address_email,
            ship_city,
            ship_area,
            bank_id,
            bank_account,
            revenue,
            size,
            rank,
            website,
            number_of_day_owed,
            gender,
            deb_limit,
            share_all,
            is_input,
            is_delete,
            id_cus_from,
            cus_from,
            link,
            content,
        } = req.body;
        let type = req.body;
        let comId = "";
        let empId = "";

        let createDate = functions.getTimeNow();
        let linkDL = "";
        if (!type || ![1, 2].includes(type)) {
            type = 2;
        }
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            comId = req.user.data.com_id;
            empId = req.user.data.idQLC;
            let logo = null;
            let maxID = await customerService.getMaxIDCRM(Customer);
            let cus_id = 0;
            if (maxID) {
                cus_id = Number(maxID) + 1;
            }
            if (logo) {
                const imageValidationResult = await customerService.validateImage(logo);
                if (imageValidationResult === true) {
                    await customerService.uploadFileCRM(cus_id, logo);
                    linkDL = logo.name;
                } else {
                    return functions.setError(
                        res,
                        "Định dạng ảnh không hợp lệ. Chỉ hỗ trợ định dạng JPEG, JPG, PNG, GIF và BMP.",
                        400
                    );
                }
            }
            const validationResult = customerService.validateCustomerInput(
                name,
                comId
            );
            if (validationResult === true) {
                if (type == 2) {
                    // với yêu cầu là khach hàng cá nhân
                    let createCustomer = new Customer({
                        cus_id: cus_id,
                        email: email,
                        name: name,
                        stand_name: stand_name,
                        phone_number: phone_number,
                        cit_id: cit_id,
                        logo: linkDL,
                        district_id: district_id,
                        ward: ward,
                        address: address,
                        ship_invoice_address: ship_invoice_address,
                        cmnd_ccnd_number: cmnd_ccnd_number,
                        cmnd_ccnd_address: cmnd_ccnd_address,
                        cmnd_ccnd_time: cmnd_ccnd_time,
                        resoure: resoure,
                        description: description,
                        tax_code: tax_code,
                        group_id: group_id,
                        status: status,
                        business_areas: business_areas,
                        category: category,
                        business_type: business_type,
                        classify: classify,
                        bill_city: bill_city,
                        bil_district: bil_district,
                        bill_ward: bill_ward,
                        bill_address: bill_address,
                        bill_area_code: bill_area_code,
                        bill_invoice_address: bill_invoice_address,
                        bill_invoice_address_email: bill_invoice_address_email,
                        company_id: comId,
                        user_create_id: empId,
                        ship_city: ship_city,
                        ship_area: ship_area,
                        bank_id: bank_id,
                        bank_account: bank_account,
                        revenue: revenue,
                        rank: rank,
                        website: website,
                        number_of_day_owed: number_of_day_owed,
                        gender: gender,
                        deb_limit: deb_limit,
                        share_all: share_all,
                        type: type,
                        is_input: is_input,
                        is_delete: is_delete,
                        created_at: createDate,
                        id_cus_from: id_cus_from,
                        cus_from: cus_from,
                        link: link,
                    });
                    let saveCS = await createCustomer.save();
                    if (content) {
                        let maxID = await customerService.getMaxIDConnectApi(
                            HistoryEditCustomer
                        );
                        let id = 0;
                        if (maxID) {
                            id = Number(maxID) + 1;
                        }
                        let newHT = new HistoryEditCustomer({
                            id: id,
                            customer_id: cus_id,
                            content: content,
                            created_at: createDate,
                        });
                        let savehis = await newHT.save();
                        return functions.success(res, "get data success", {
                            saveCS,
                            savehis,
                        });
                    } else {
                        return functions.success(res, "get data success", { saveCS });
                    }
                }
                if (type == 1) {
                    // với yêu cầu là khach hàng doanh nghiệp
                    let createCustomer = new Customer({
                        cus_id: cus_id,
                        email: email,
                        name: name,
                        stand_name: stand_name,
                        phone_number: phone_number,
                        cit_id: cit_id,
                        logo: linkDL,
                        district_id: district_id,
                        ward: ward,
                        address: address,
                        ship_invoice_address: ship_invoice_address,
                        resoure: resoure,
                        description: description,
                        tax_code: tax_code,
                        group_id: group_id,
                        status: status,
                        business_areas: business_areas,
                        category: category,
                        business_type: business_type,
                        classify: classify,
                        bill_city: bill_city,
                        bil_district: bil_district,
                        bill_ward: bill_ward,
                        bill_address: bill_address,
                        bill_area_code: bill_area_code,
                        bill_invoice_address: bill_invoice_address,
                        bill_invoice_address_email: bill_invoice_address_email,
                        company_id: comId,
                        user_create_id: empId,
                        ship_city: ship_city,
                        ship_area: ship_area,
                        bank_id: bank_id,
                        bank_account: bank_account,
                        revenue: revenue,
                        size: size,
                        user_handing_over_work,
                        rank: rank,
                        website: website,
                        number_of_day_owed: number_of_day_owed,
                        deb_limit: deb_limit,
                        share_all: share_all,
                        type: type,
                        is_input: is_input,
                        is_delete: is_delete,
                        created_at: createDate,
                        id_cus_from: id_cus_from,
                        cus_from: cus_from,
                        link: link,
                    });
                    let saveCS = await createCustomer.save();
                    if (content) {
                        let maxID = await customerService.getMaxIDConnectApi(
                            HistoryEditCustomer
                        );
                        let id = 0;
                        if (maxID) {
                            cus_id = Number(maxID) + 1;
                        }
                        let newHT = new HistoryEditCustomer({
                            id: id,
                            customer_id: cus_id,
                            content: content,
                            created_at: createHtime,
                        });
                        let savehis = await newHT.save();
                        return functions.success(res, "get data success", {
                            saveCS,
                            savehis,
                        });
                    } else {
                        return functions.success(res, "get data success", { saveCS });
                    }
                } else {
                    return functions.setError(res, "type không hợp lệ", 400);
                }
            }
        } else {
            return functions.setError(res, "bạn không có quyền", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//Hien thi
exports.showKH = async(req, res) => {
    try {
        let { page, perPage, keyword, status, resoure, emp_id, time_s, time_e, group_id } = req.body; // Số lượng giá trị hiển thị trên mỗi trang
        const user = req.user.data;
        page = Number(page) || 1;
        perPage = Number(perPage) || 10;

        let startIndex = (page - 1) * perPage;
        let com_id = user.com_id;
        let query = {
            company_id: com_id,
            is_delete: 0,
        };

        if (keyword) {
            query = {
                $or: [
                    // { cus_id: keyword },
                    { name: { $regex: keyword, $options: "i" } },
                    { phone_number: { $regex: keyword, $options: "i" } },
                    { email: { $regex: keyword, $options: "i" } },
                ],
                ...query
            };
        }
        if (status) {
            query.status = Number(status);
        }
        if (resoure) {
            query.resoure = Number(resoure);
        }
        if (emp_id) {
            query.emp_id = Number(emp_id);
        }
        if (group_id) {
            query.group_id = group_id;
        }

        let listUser = await User.find({ 'inForPerson.employee.com_id': com_id, type: 2 }).select('idQLC userName').lean();
        if (time_s && time_e) {

            query.updated_at = { $gte: functions.convertTimestamp(time_s), $lte: functions.convertTimestamp(time_e) };
        }

        let checkUser = await User.findOne({ idQLC: user.idQLC, type: user.type });
        if (user.type == 2) {
            // trường hợp là nhân viên
            let idQLC = user.idQLC;

            /** Nếu tài khoản đăng nhập thuộc các chức vụ: Nhóm phó, trưởng nhóm,phó tổ trưởng, tổ trưởng,phó ban dự án,trưởng ban dự án
            Phó trưởng phòng,trường phòng */
            if ([20, 4, 12, 13, 11.10, 5, 6].includes(checkUser.inForPerson.employee.position_id)) {
                let dep_id = checkUser.inForPerson.employee.dep_id;
                let getListEmployeeInDep = await User.find({
                        "inForPerson.employee.dep_id": dep_id,
                        "inForPerson.employee.com_id": com_id,
                    })
                    .select("idQLC")
                    .lean();
                let ListIdInDepartment = getListEmployeeInDep.map(item => item.idQLC);

                query = { emp_id: { $in: ListIdInDepartment }, ...query };
            }
            /* Nếu tài khoản đăng là các chức vụ: Sinh viên thực tập,nhân viên thử việc,nhân viên part time, nhân viên chính thức */
            else if ([1, 2, 9, 3].includes(checkUser.inForPerson.employee.position_id)) {
                query.emp_id = idQLC;
            }

            let showCty = await Customer.find(query)
                .select("cus_id name phone_number email group_id emp_id user_create_id user_handing_over_work status description resoure  updated_at link count_call cus_from birthday company_id user_create_id created_at is_delete type")
                .sort({ updated_at: -1 })
                .skip(startIndex)
                .limit(perPage)
                .lean();
            for (let i = 0; i < showCty.length; i++) {
                let element = showCty[i];

                // Tìm thông tin người dùng dựa trên emp_id
                let emplopyee = await customerService.findUserByQLC(listUser, element.emp_id);
                element.userName = emplopyee.userName;

                // Tìm thông tin người tạo dựa trên user_create_id
                let employeeCreate = await customerService.findUserByQLC(listUser, element.user_create_id);
                element.userNameCreate = employeeCreate.userName;

                // Tìm thông tin người chuyển việc dựa trên user_handing_over_work
                let userHandingOverWork = await customerService.findUserByQLC(listUser, element.user_handing_over_work);
                element.NameHandingOverWork = userHandingOverWork.userName;
                element.created_at = moment(element.updated_at * 1000).format('DD/MM/YYYY HH:mm:ss');
                element.updated_at = moment(element.updated_at * 1000).format('DD/MM/YYYY HH:mm:ss');
            }
            let totalRecords = await Customer.countDocuments(query);

            return res.status(200).json({
                resule: true,
                message: "Danh sách khách hàng",
                data: showCty,
                total: totalRecords,
            });
        } else {
            return functions.setError(res, 'bạn không có quyền')
        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
};

//Xoa khach hang
exports.DeleteKH = async(req, res) => {
    try {
        let { cus_id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
        if (!cus_id || cus_id.length === 0) {
            return functions.setError(res, "Mảng cus_id không được bỏ trống", 400);
        }
        const existingCustomers = await Customer.find({
            cus_id: { $in: cus_id },
            company_id: com_id,
        });
        if (existingCustomers.length === 0) {
            return functions.setError(res, "Khách hàng không tồn tại", 400);
        }
        const deleteCustomers = existingCustomers.filter(
            (customer) => customer.is_delete === 0
        );
        if (deleteCustomers.length === 0) {
            return functions.setError(
                res,
                "Tất cả khách hàng đã bị xóa trước đó",
                400
            );
        }
        await Customer.updateMany({ cus_id: { $in: cus_id }, company_id: com_id }, { is_delete: 1 });
        return functions.success(res, "Xóa thành công");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// thêm mới Api kết nối
exports.addConnectCs = async(req, res) => {
    try {
        let { appID, webhook } = req.body;
        let comId = "";
        let userID = "";
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            comId = req.user.data.com_id;
            userID = req.user.data.idQLC;
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
        let tokenCn = req.headers["authorization"];
        let createDate = new Date();

        if (!appID) {
            return functions.setError(res, "appID không được bỏ trống", 400);
        }
        if (!webhook) {
            return functions.setError(res, "webhook không được bỏ trống", 400);
        }
        let maxID = await customerService.getMaxIDConnectApi(ConnectApi);
        let idAPI = 0;
        if (maxID) {
            idAPI = Number(maxID) + 1;
        }
        let checkCn = await ConnectApi.findOne({ company_id: comId });
        if (checkCn) {
            return functions.success(res, "Api kết nối đã có không thể tạo mới", {
                checkCn,
            });
        } else {
            let createApi = await new ConnectApi({
                id: idAPI,
                company_id: comId,
                appID: appID,
                webhook: webhook,
                token: tokenCn,
                user_edit_id: userID,
                user_edit_type: 1,
                stt_conn: 1,
                created_at: createDate,
            });
            let saveApi = await createApi.save();
            return functions.success(res, "thêm thành công", { saveApi });
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// sửa Api kết nối
exports.editConnectCs = async(req, res) => {
    try {
        let { appID, webhook } = req.body;
        let emp_id = "";
        let comId = "";
        let tokenCn = req.headers["authorization"];
        let updateDate = new Date();
        if (!appID) {
            return functions.setError(res, "appID không được bỏ trống", 400);
        }
        if (!webhook) {
            return functions.setError(res, "webhook không được bỏ trống", 400);
        }
        if (req.user.data.type == 2 || req.user.data.type == 1) {
            emp_id = req.user.data.idQLC;
            comId = req.user.data.com_id;
            await customerService.getDatafindOneAndUpdate(
                ConnectApi, { company_id: comId }, {
                    company_id: comId,
                    appID: appID,
                    webhook: webhook,
                    token: tokenCn,
                    user_edit_id: emp_id,
                    user_edit_type: 1,
                    stt_conn: 1,
                    updated_at: updateDate,
                }
            );
            return functions.success(res, "Api edited successfully");
        } else {
            return functions.setError(res, "bạn không có quyền", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// hiển thị Api kết nối
exports.ShowConnectCs = async(req, res) => {
    try {
        let comId = req.user.data.com_id;
        const check = await ConnectApi.findOne({ company_id: comId });
        return functions.success(res, "Lấy dữ liệu thành công", { check });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.searchSame = async(req, res) => {
    try {
        const {
            limit,
            start,
            choose,
            emp_id,
            com_id,
            slt_name_customer,
            name_customer,
            slt_phone_customer,
            phone_customer,
            slt_tax_code_customer,
            tax_code_customer,
            slt_website_customer,
            website_customer,
        } = req.body;

        const select =
            "cus_id email name phone_number tax_code website address resoure birthday status description group_id emp_id com_id is_delete type created_at updated_at cus_from user_handing_over_work";

        const query = {
            is_delete: 0,
            com_id: com_id,
        };

        if (emp_id !== "") {
            query.emp_id = { $in: emp_id };
        }

        if (choose === 2) {
            query.$or = [];
        }

        if (slt_name_customer && name_customer) {
            const nameCondition = getConditionObject(
                slt_name_customer,
                "name",
                name_customer
            );
            if (query.$or) {
                query.$or.push(nameCondition);
            } else {
                query.$or = [nameCondition];
            }
        }

        if (slt_phone_customer && phone_customer) {
            const phoneCondition = getConditionObject(
                slt_phone_customer,
                "phone_number",
                phone_customer
            );
            if (query.$or) {
                query.$or.push(phoneCondition);
            } else {
                query.$or = [phoneCondition];
            }
        }

        if (slt_tax_code_customer && tax_code_customer) {
            const taxCodeCondition = getConditionObject(
                slt_tax_code_customer,
                "tax_code",
                tax_code_customer
            );
            if (query.$or) {
                query.$or.push(taxCodeCondition);
            } else {
                query.$or = [taxCodeCondition];
            }
        }

        if (slt_website_customer && website_customer) {
            const websiteCondition = getConditionObject(
                slt_website_customer,
                "website",
                website_customer
            );
            if (query.$or) {
                query.$or.push(websiteCondition);
            } else {
                query.$or = [websiteCondition];
            }
        }

        if (choose === 2 && (!query.$or || query.$or.length === 0)) {
            query.$or = [{}];
        }

        const total = await Customer.countDocuments(query);
        const customers = await Customer.find(query)
            .select(select)
            .limit(limit)
            .skip(start)
            .sort({ cus_id: 1 });

        const data = {
            customer: customers,
            total: total,
        };

        return res.status(200).json(data);
    } catch (error) {
        console.error("Failed to search customers", error);
        res.status(500).json({ error: "Failed to search customers" });
    }
};

function getConditionObject(option, field, value) {
    const conditionObj = {};

    switch (option) {
        case 1:
            conditionObj[field] = value;
            break;
        case 2:
            conditionObj[field] = { $ne: value };
            break;
        case 3:
            conditionObj[field] = { $regex: value, $options: "i" };
            break;
        case 4:
            conditionObj[field] = { $not: { $regex: value, $options: "i" } };
            break;
    }

    return conditionObj;
}