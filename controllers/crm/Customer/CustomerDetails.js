const Customer = require("../../../models/crm/Customer/customer");
const CustomerStt = require("../../../models/crm/Customer/customer_status");
const functions = require("../../../services/functions");
const customerService = require("../../../services/CRM/CRMservice");
const HistoryEditCustomer = require("../../../models/crm/history/history_edit_customer");
const ShareCustomer = require("../../../models/crm/tbl_share_customer");
const User = require("../../../models/Users");
const City = require("../../../models/City");
const District = require("../../../models/District");
const Ward = require("../../../models/crm/ward");
const NhomKH = require("../../../models/crm/Customer/customer_group");
const AppointmentContentCall = require("../../../models/crm/appointment_content_call");
const { log } = require("console");

// hàm hiển thị chi tiết khách hàng
exports.detail = async(req, res) => {
    try {
        let { cus_id } = req.body;
        let com_id = "";
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
        if (typeof cus_id === "undefined") {
            return functions.setError(res, "cus_id không được bỏ trống", 400);
        }
        if (typeof cus_id !== "number" && isNaN(Number(cus_id))) {
            return functions.setError(res, "cus_id phải là 1 số", 400);
        }
        let findCus = await Customer.findOne({ cus_id, company_id: com_id });
        if (!findCus) {
            return functions.setError(res, "không tìm thấy bản ghi phù hợp", 400);
        }
        let name_tao = await User.findOne({ idQLC: findCus.user_create_id }).select(
            "userName"
        );
        if (!name_tao) {
            name_tao = "";
        }
        let name_sua = await User.findOne({ idQLC: findCus.user_edit_id }).select(
            "userName"
        );
        if (!name_sua) {
            name_sua = "";
        }
        let name_phu_trach = await User.findOne({ idQLC: findCus.emp_id }).select(
            "userName"
        );
        if (!name_phu_trach) {
            name_phu_trach = "";
        }
        let name_nhom = await NhomKH.findOne({ gr_id: findCus.group_id }).select(
            "gr_name"
        );
        if (!name_nhom) {
            name_nhom = "";
        }
        //stt
        let name_stt = await CustomerStt.findOne({ stt_id: findCus.status }).select(
            "stt_name"
        );
        if (!name_stt) {
            name_nhom = "";
        }

        let thanh_pho = await City.findOne({ _id: findCus.cit_id }).select("name");
        let info_thanh_pho = await City.findOne({ _id: findCus.cit_id }).select(
            "_id"
        );
        if (!thanh_pho) {
            thanh_pho = "";
        }
        let huyen = await District.findOne({ _id: findCus.district_id }).select(
            "name"
        );
        let info_huyen = await District.findOne({
            _id: findCus.district_id,
        }).select("_id");
        if (!huyen) {
            huyen = "";
        }

        let ten_xa = await Ward.findOne({ ward_id: findCus.ward }).select(
            "ward_name"
        );
        let info_ten_xa = await Ward.findOne({ ward_id: findCus.ward }).select(
            "district_id"
        );
        if (!ten_xa) {
            ten_xa = "";
        }
        let hd_thanh_pho = await City.findOne({ _id: findCus.cit_id }).select(
            "name"
        );
        let info_hd_thanh_pho = await City.findOne({ _id: findCus.cit_id }).select(
            "_id"
        );
        if (!hd_thanh_pho) {
            hd_thanh_pho = "";
        }
        let hd_huyen = await District.findOne({ _id: findCus.district_id }).select(
            "name"
        );
        let info_hd_huyen = await District.findOne({
            _id: findCus.district_id,
        }).select("_id");
        if (!hd_huyen) {
            hd_huyen = "";
        }
        let hd_ten_xa = await Ward.findOne({ ward_id: findCus.ward }).select(
            "ward_name"
        );
        let info_hd_ten_xa = await Ward.findOne({ ward_id: findCus.ward }).select(
            "ward_id"
        );
        if (!hd_ten_xa) {
            hd_ten_xa = "";
        }
        if (findCus.type == 2) {
            let data = {
                cus_id: findCus.cus_id, // id khách hàng
                email: {
                    info: findCus.email,
                    detail: findCus.email,
                }, // địa chỉ email khách hàng
                phone_number: {
                    info: findCus.phone_number,
                    detail: findCus.phone_number,
                },
                name: findCus.name, // tên khách hàng
                stand_name: {
                    info: findCus.stand_name,
                    detail: findCus.stand_name,
                },
                logo: findCus.logo, // ảnh đại diện
                birthday: findCus.birthday, // ngày sinh nếu là cá nhân
                tax_code: findCus.tax_code, // mã số thuế
                cit_id: {
                    info: info_thanh_pho,
                    detail: thanh_pho,
                }, //thành phố
                district_id: {
                    info: info_huyen,
                    detail: huyen,
                }, // huyện
                ward: {
                    info: info_ten_xa,
                    detail: ten_xa,
                }, //phường hoặc xã
                address: {
                    info: findCus.address,
                    detail: findCus.address,
                }, // số nhà đường phố
                ship_invoice_address: {
                    info: findCus.ship_invoice_address,
                    detail: findCus.ship_invoice_address,
                }, // địa chỉ đơn hàng
                gender: findCus.gender, // giới tính
                cmnd_ccnd_number: findCus.cmnd_ccnd_number, // số chứng minh thư nhân dân
                cmnd_ccnd_address: findCus.cmnd_ccnd_address, // đia chỉ nơi cấp
                cmnd_ccnd_time: findCus.cmnd_ccnd_time, // thời gian cấp
                resoure: {
                    info: findCus.resoure,
                    detail: findCus.resoure,
                }, // ngưồn khách hàng
                description: {
                    info: findCus.description,
                    detail: findCus.description,
                }, // thông tin mô tả
                introducer: findCus.introducer, // Người giới thiệu
                contact_name: findCus.contact_name,
                contact_email: findCus.contact_email,
                contact_phone: findCus.contact_phone,
                contact_gender: findCus.contact_gender,
                company_id: findCus.company_id,
                emp_id: {
                    info: findCus.emp_id,
                    detail: name_phu_trach,
                },
                user_handing_over_work: findCus.user_handing_over_work, //id người bàn giao
                user_create_id: findCus.user_create_id, //id nhân viên tạo
                user_create_type: findCus.user_create_type, //id người tạo
                user_edit_id: findCus.user_edit_id, //id người sửa
                group_id: {
                    info: findCus.group_id,
                    detail: name_nhom,
                }, // id nhóm khách hàng
                status: {
                    info: findCus.status,
                    detail: name_stt,
                }, // trạng thái khach hàng
                business_areas: {
                    info: findCus.business_areas,
                    detail: findCus.business_areas,
                }, // lĩnh vực
                classify: {
                    info: findCus.classify,
                    detail: findCus.classify,
                }, // loại khách hàng
                business_type: {
                    info: findCus.business_type,
                    detail: findCus.business_type,
                },
                category: {
                    info: findCus.category,
                    detail: findCus.category, //
                },
                bill_city: {
                    info: info_hd_thanh_pho,
                    detail: hd_thanh_pho,
                }, // hóa đơn id thành phố
                bill_district: {
                    info: info_hd_huyen,
                    detail: hd_huyen,
                }, // hóa đơn id huyện
                bill_ward: {
                    info: info_hd_ten_xa,
                    detail: hd_ten_xa,
                }, // hóa đơn id phường xã
                bill_address: {
                    info: findCus.bill_address,
                    detail: findCus.bill_address,
                }, // địa chỉ đơn hàng
                bill_area_code: {
                    info: findCus.bill_area_code,
                    detail: findCus.bill_area_code,
                }, // Mã vùng thông tin viết hóa đơn
                bill_invoice_address: {
                    info: findCus.bill_invoice_address,
                    detail: findCus.bill_invoice_address,
                }, // Địa chỉ giao hàng
                bill_invoice_address_email: findCus.bill_invoice_address_email, // địa chỉ đơn hàng email
                ship_city: hd_thanh_pho, // giao hàng tại thành phố
                ship_area: {
                    info: findCus.ship_area,
                    detail: findCus.ship_area,
                }, // Mã vùng thông tin giao hàng
                bank_id: {
                    info: findCus.bank_id,
                    detail: findCus.bank_id,
                }, // id của ngân hàng
                bank_account: {
                    info: findCus.bank_account,
                    detail: findCus.bank_account,
                }, // tài khoản ngân hàng
                revenue: {
                    info: findCus.revenue,
                    detail: findCus.revenue,
                }, // doanh thu
                size: {
                    info: findCus.size,
                    detail: findCus.size,
                }, //Quy mô nhân sự
                rank: {
                    info: findCus.rank,
                    detail: findCus.rank,
                }, // xếp hạng khách hàng

                website: {
                    info: findCus.website,
                    detail: findCus.website,
                }, // website ngân hàng
                number_of_day_owed: findCus.number_of_day_owed, // số ngày được nợ
                share_all: findCus.share_all,
                type: findCus.type, //Loại công ty
                is_input: findCus.is_input,
                is_delete: findCus.is_delete,
                created_at: findCus.created_at,
                updated_at: findCus.updated_at,
                id_cus_from: findCus.id_cus_from,
                cus_from: findCus.cus_from,
                link: findCus.link,
                user_create_name: name_tao.userName,
                user_edit_name: name_sua.userName,
                giao_hang_huyen: hd_huyen, // giao hàng tại huyện
                giao_hang_xa: hd_ten_xa, // giao hàng tại phường,xã
                website: findCus.website, // website ngân hàng
                han_muc_no: findCus.deb_limit, // hạn mức nợ
                loai_hinh_khach_hang: findCus.type, // loại hình khách hàng
                la_khach_hang_tu: findCus.created_at, // là khách hàng từ ngày
                nguoi_tao: name_tao.userName, // tên nhân viên tạo
                nguoi_sua: name_sua.userName, // tên nhân viên sửa
                ngay_tao: findCus.created_at,
                ngay_sua: findCus.updated_at,
            };
            return res.status(200).json({
                result: true,
                message: "Thông tin khách hàng",
                data: {...data },
            });
        } else if (findCus.type == 1) {
            let data2 = {
                ma_khach_hang: findCus.cus_id, // id khách hàng
                email: findCus.email, // địa chỉ email khách hàng
                ten_khach_hang: findCus.name, // tên khách hàng
                ten_viet_tat: findCus.stand_name, // tên viết tắt
                dien_thoai: findCus.phone_number, // số điện thoại
                anh_dai_dien: findCus.logo, // ảnh đại diện
                thanh_pho: thanh_pho, //thành phố
                huyen: huyen, // huyện
                phuong_xa: ten_xa, //phường hoặc xã
                so_nha_duong_pho_hd: findCus.address, // số nhà đường phố
                ship_invoice_address: findCus.ship_invoice_address, // địa chỉ đơn hàng
                resoure: findCus.resoure, // ngưồn khách hàng
                thong_tin_mo_ta: findCus.description, // thông tin mô tả
                ma_so_thue: findCus.tax_code, // mã số thuế
                group_id: name_nhom.gr_name, // id nhóm khách hàng
                status: findCus.status, // trạng thái khach hàng
                linh_vuc: findCus.business_areas, // lĩnh vực
                category: findCus.category, //
                nhan_vien_phu_trach: name_phu_trach, // tên nhân viên phụ trách
                loai_hinh: findCus.business_type, // loại hình
                phan_loai_khach_hang: findCus.classify, // loại khách hàng
                hoa_don_tp: hd_thanh_pho, // hóa đơn id thành phố
                hoa_don_huyen: hd_huyen, // hóa đơn id huyện
                hoa_don_xa: hd_ten_xa, // hóa đơn id phường xã
                so_nha_duong_pho_gh: findCus.bill_address, // địa chỉ đơn hàng
                ma_vung_hoa_don: findCus.bill_area_code, // Mã vùng thông tin viết hóa đơn
                bill_invoice_address: findCus.bill_invoice_address, // Địa chỉ giao hàng
                bill_invoice_address_email: findCus.bill_invoice_address_email, // địa chỉ đơn hàng email
                giao_hang_tp: hd_thanh_pho, // giao hàng tại thành phố
                giao_hang_huyen: hd_huyen, // giao hàng tại huyện
                giao_hang_xa: hd_ten_xa, // giao hàng tại phường,xã
                ma_vung_giao_hang: findCus.ship_area, // Mã vùng thông tin giao hàng
                bank_id: findCus.bank_id, // id của ngân hàng
                bank_account: findCus.bank_account, // tài khoản ngân hàng
                rank: findCus.rank, // xếp hạng khách hàng
                website: findCus.website, // website ngân hàng
                so_ngay_duoc_no: findCus.number_of_day_owed, // số ngày được nợ
                quy_mo_nhan_su: findCus.size, // quy mô nhân sự
                han_muc_no: findCus.deb_limit, // hạn mức nợ
                loai_hinh_khach_hang: findCus.type, // loại hình khách hàng
                doanh_thu: findCus.revenue, // doanh thu
                la_khach_hang_tu: findCus.created_at, // là khách hàng từ ngày
                nguoi_tao: name_tao.userName, // tên nhân viên tạo
                nguoi_sua: name_sua.userName, // tên nhân viên sửa
                ngay_tao: findCus.created_at,
                ngay_sua: findCus.updated_at,
            };
            return functions.success(res, "get data success", { data2 });
        } else {
            return functions.setError(res, "không tìm thấy bản ghi phù hợp", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.listCity = async(req, res) => {
    try {
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            let listCity = await City.find({}).select("_id name");
            return functions.success(res, "get data success", { listCity });
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.listDistrict = async(req, res) => {
    try {
        let { _id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            let listDistrict = await District.find({ parent: _id }).select(
                "_id name"
            );
            if (!listDistrict) {
                listDistrict = [];
            }
            return functions.success(res, "get data success", { listDistrict });
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.listWard = async(req, res) => {
    try {
        let { _id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            let listWard = await Ward.find({ district_id: _id }).select(
                "ward_id ward_name"
            );
            if (!listWard) {
                listWard = [];
            }
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};
// hàm chỉnh sửa khách hàng
exports.editCustomer = async(req, res) => {
    try {
        let {
            cus_id,
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
            type,
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
            created_at,
            cus_from,
            link,
            content,
        } = req.body;
        // let logo = req.files.logo;
        let updateDate = functions.getTimeNow();
        let createHtime = functions.getTimeNow();
        let linkDL = "";
        // if (logo) {
        //     const imageValidationResult = await customerService.validateImage(logo);
        //     if (imageValidationResult === true) {
        //         await customerService.uploadFileCRM(cus_id, logo);
        //         linkDL = customerService.createLinkFileCRM(cus_id, logo.name);
        //     }
        // }
        if (typeof cus_id === "undefined") {
            return functions.setError(res, "cus_id không được bỏ trống", 400);
        }
        if (typeof cus_id !== "number" && isNaN(Number(cus_id))) {
            return functions.setError(res, "cus_id phải là 1 số", 400);
        }
        let dataUpdate = { updated_at: updateDate };
        if (group_id) { dataUpdate.group_id = group_id; }
        if (status) { dataUpdate.status = status; }
        if (resoure) { dataUpdate.resoure = resoure; }
        if (description) { dataUpdate.description = description };

        await Customer.updateOne({ cus_id }, { $set: dataUpdate });
        return functions.success(res, "Customer edited successfully");
        // if (type == 1) {
        //     await customerService.getDatafindOneAndUpdate(
        //         Customer, { cus_id: cus_id }, {
        //             cus_id: cus_id,
        //             email: email,
        //             name: name,
        //             stand_name: stand_name,
        //             phone_number: phone_number,
        //             logo: linkDL,
        //             cit_id: cit_id,
        //             district_id: district_id,
        //             ward: ward,
        //             address: address,
        //             ship_invoice_address: ship_invoice_address,
        //             resoure: resoure,
        //             description: description,
        //             tax_code: tax_code,
        //             group_id: group_id,
        //             status: status,
        //             business_areas: business_areas,
        //             category: category,
        //             business_type: business_type,
        //             classify: classify,
        //             bill_city: bill_city,
        //             bil_district: bil_district,
        //             bill_ward: bill_ward,
        //             bill_address: bill_address,
        //             bill_area_code: bill_area_code,
        //             bill_invoice_address: bill_invoice_address,
        //             bill_invoice_address_email: bill_invoice_address_email,
        //             ship_city: ship_city,
        //             ship_area: ship_area,
        //             bank_id: bank_id,
        //             bank_account: bank_account,
        //             revenue: revenue,
        //             size: size,
        //             user_handing_over_work,
        //             rank: rank,
        //             website: website,
        //             number_of_day_owed: number_of_day_owed,
        //             deb_limit: deb_limit,
        //             share_all: share_all,
        //             type: type,
        //             is_input: is_input,
        //             is_delete: is_delete,
        //             updated_at: updateDate,
        //             id_cus_from: id_cus_from,
        //             cus_from: cus_from,
        //             link: link,
        //         }
        //     );
        //     if (typeof content === "undefined") {
        //         return functions.success(res, "Customer edited successfully");
        //     } else {
        //         let maxID = await customerService.getMaxIDConnectApi(
        //             HistoryEditCustomer
        //         );
        //         let id = 0;
        //         if (maxID) {
        //             id = Number(maxID) + 1;
        //         }
        //         let newHT = new HistoryEditCustomer({
        //             id: id,
        //             customer_id: cus_id,
        //             content: content,
        //             created_at: createHtime,
        //         });
        //         let savehis = await newHT.save();
        //         return functions.success(res, "Customer edited successfully", {
        //             savehis,
        //         });
        //     }
        // }
        // if (type == 2) {
        //     await customerService.getDatafindOneAndUpdate(
        //         Customer, { cus_id: cus_id }, {
        //             cus_id: cus_id,
        //             email: email,
        //             name: name,
        //             stand_name: stand_name,
        //             phone_number: phone_number,
        //             logo: linkDL,
        //             cit_id: cit_id,
        //             district_id: district_id,
        //             ward: ward,
        //             address: address,
        //             ship_invoice_address: ship_invoice_address,
        //             cmnd_ccnd_number: cmnd_ccnd_number,
        //             cmnd_ccnd_address: cmnd_ccnd_address,
        //             cmnd_ccnd_time: cmnd_ccnd_time,
        //             resoure: resoure,
        //             description: description,
        //             tax_code: tax_code,
        //             group_id: group_id,
        //             status: status,
        //             business_areas: business_areas,
        //             category: category,
        //             business_type: business_type,
        //             classify: classify,
        //             bill_city: bill_city,
        //             bil_district: bil_district,
        //             bill_ward: bill_ward,
        //             bill_address: bill_address,
        //             bill_area_code: bill_area_code,
        //             bill_invoice_address: bill_invoice_address,
        //             bill_invoice_address_email: bill_invoice_address_email,
        //             ship_city: ship_city,
        //             ship_area: ship_area,
        //             bank_id: bank_id,
        //             bank_account: bank_account,
        //             revenue: revenue,
        //             rank: rank,
        //             website: website,
        //             number_of_day_owed: number_of_day_owed,
        //             gender: gender,
        //             deb_limit: deb_limit,
        //             share_all: share_all,
        //             type: type,
        //             is_input: is_input,
        //             is_delete: is_delete,
        //             created_at: created_at,
        //             updated_at: updateDate,
        //             id_cus_from: id_cus_from,
        //             cus_from: cus_from,
        //             link: link,
        //         }
        //     );
        //     if (typeof content === "undefined") {
        //         return functions.success(res, "Customer edited successfully");
        //     } else {
        //         let maxID = await customerService.getMaxIDConnectApi(
        //             HistoryEditCustomer
        //         );
        //         let id = 0;
        //         if (maxID) {
        //             id = Number(maxID) + 1;
        //         }
        //         let newHT = new HistoryEditCustomer({
        //             id: id,
        //             customer_id: cus_id,
        //             content: content,
        //             created_at: createHtime,
        //         });
        //         let savehis = await newHT.save();
        //         return functions.success(res, "Customer edited successfully", {
        //             savehis,
        //         });
        //     }
        // } else {
        //     return functions.setError(res, "không có loại khách hang đó", 400);
        // }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// hàm hiển thị lịch sử trợ lý kinh doanh (theo id khach hang)
exports.showHisCus = async(req, res) => {
    try {
        let { cus_id } = req.body;
        if (!cus_id) {
            return functions.setError(res, "cus_id không được bỏ trống", 400);
        }
        if (typeof cus_id !== "number" && isNaN(Number(cus_id))) {
            return functions.setError(res, "cus_id phải là 1 số", 400);
        }
        let checkHis = await AppointmentContentCall.find({ id_cus: cus_id })
            .sort({ id: -1 })
            .lean();
        return functions.success(res, "get data success", { checkHis });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//Ham ban giao cong viec
exports.banGiao = async(req, res) => {
    try {
        let { cus_id, userID } = req.body;
        let comId = req.user.data.com_id;
        if (!Array.isArray(cus_id) || cus_id.length === 0) {
            return functions.setError(res, "Không có mục tiêu được chọn", 400);
        }
        for (let i = 0; i < cus_id.length; i++) {
            let customer = await Customer.findOne({ cus_id: cus_id[i] });

            if (!customer) {
                // Xử lý nếu không tìm thấy khách hàng
                continue;
            }
            await customerService.getDatafindOneAndUpdate(
                Customer, { cus_id: cus_id[i] }, {
                    cus_id: cus_id[i],
                    company_id: comId,
                    emp_id: userID,
                    user_handing_over_work: customer.emp_id,
                }
            );
        }
        return functions.success(res, "edited successfully");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//hàm chia sẻ khách hàng
exports.ShareCustomer = async(req, res) => {
    try {
        let { customer_id, role, dep_id, receiver_id } = req.body;
        let NVshare = "";
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
            NVshare = req.user.data.idQLC;
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
        let updateAt = new Date();
        let createAt = new Date();
        const maxID = await customerService.getMaxIDConnectApi(ShareCustomer);
        const maxId = maxID ? Number(maxID) + 1 : 0;
        const shareCustomers = [];
        const minLength = Math.min(
            customer_id.length,
            dep_id.length,
            role.length,
            receiver_id.length
        );
        for (let i = 0; i < minLength; i++) {
            const id = maxId + i;
            const createShareCustomer = new ShareCustomer({
                id: id,
                customer_id: customer_id[i] || 0,
                emp_share: NVshare,
                dep_id: dep_id[i] || 0,
                role: role[i] || "all",
                receiver_id: receiver_id[i] || 0,
                created_at: createAt,
                updated_at: updateAt,
            });
            shareCustomers.push(createShareCustomer);
        }

        const saveSC = await ShareCustomer.insertMany(shareCustomers);
        return functions.success(res, "share thành công", { saveSC });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//Api hiển thị chọn khách hàng gộp

exports.ChosseCustomer = async(req, res) => {
    try {
        let { arrCus } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            if (!arrCus || !Array.isArray(arrCus) || arrCus.length === 0) {
                return functions.setError(res, "Mảng arrCus không được bỏ trống", 400);
            }
            if (!arrCus.every((item) => Number.isInteger(parseInt(item)))) {
                return functions.setError(
                    res,
                    "Tất cả các giá trị trong mảng arrCus phải là số nguyên",
                    400
                );
            }
            const customers = await Customer.find({
                cus_id: { $in: arrCus },
                company_id: com_id,
            });
            return functions.success(res, "get data success", { customers });
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

//Api thực hiện gộp khách hàng và xóa những giá trị cũ
exports.CombineCustome = async(req, res) => {
    try {
        let {
            arrCus,
            email,
            name,
            logo,
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
            user_edit_id,
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
            comId,
            empId,
        } = req.body;
        if (req.user.data.type == 1 || req.user.type == 2) {} else {
            return functions.setError(res, "arrCus phải là 1 mảng", 400);
        }
        if (!Array.isArray(arrCus)) {
            return functions.setError(res, "arrCus phải là 1 mảng", 400);
        }
        const type = req.body.type || 2;
        if (![1, 2].includes(type)) {
            return functions.setError(res, "loại khách hàng không hợp lệ", 400);
        }
        let createDate = new Date();
        const validationResult = customerService.validateCustomerInput(name, comId);
        if (validationResult !== true) {
            res.status(400).json({ error: "Invalid customer input" });
            return;
        }

        const maxID = await customerService.getMaxIDCRM(Customer);
        const cus_id = maxID ? Number(maxID) + 1 : 0;

        let createCustomer = new Customer({
            cus_id: cus_id,
            email: email,
            name: name,
            stand_name: stand_name,
            phone_number: phone_number,
            cit_id: cit_id,
            logo: logo,
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
            user_handing_over_work: user_handing_over_work,
            user_edit_id: user_edit_id,
            user_create_id: empId,
            company_id: comId,
            emp_id: empId,
            ship_city: ship_city,
            ship_area: ship_area,
            bank_id: bank_id,
            size: size,
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
        // Xóa các id khách hàng từ danh sách
        await customerService.deleteCustomerByIds(arrCus);
        return functions.success(res, "get data success", { saveCS });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};