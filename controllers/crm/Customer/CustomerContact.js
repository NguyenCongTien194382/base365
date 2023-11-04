const functions = require('../../../services/CRM/CRMservice')
const contact = require('../../../models/crm/Customer/contact_customer')
const CustomerCare = require('../../../models/crm/Customer/customer_care')
const ManagerExtension = require('../../../models/crm/manager_extension')
const Callhistory = require('../../../models/crm/call_history')
const { create } = require('yallist')
    //them chi tiet lien he KH
exports.addContact = async(req, res) => {
    try{
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        
        const { id_customer, middle_name, name, fullname, vocative, contact_type, titles, department, office_phone, office_email, personal_phone, personal_email, social, social_detail, source, country_contact, city_contact, district_contact, ward_contact, street_contact, address_contact, area_code_contact, country_ship, city_ship, district_ship, ward_ship, street_ship, address_ship, area_code_ship, description, share_all, accept_phone, accept_email } = req.body;
        let File = req.files || null;
        let logo = null;
        if ((id_customer) == undefined) {
            functions.setError(res, " khong tim thay KH ")
        } else if ((name && fullname) == undefined) {
            functions.setError(res, " Nhập tên liên hệ ")
        } else {
            let maxID = await contact.findOne({}).select("contact_id").sort({ contact_id: -1 }).limit(1).lean();
            if (!maxID) {
                maxID = 0
            };
            const _id = Number(maxID.contact_id) + 1;
            if (File.logo) {
                let upload = functions.upFileCRM('Logo_detail_customer', _id, File.logo, ['.jpeg', '.jpg', '.png']);
                if (!upload) {
                    return functions.setError(res, 'file không hỗ trợ', 400)
                }
                logo = functions.createLinkFileCRM('Logo_detail_customer', _id, File.logo.name)
                const data = new contact({
                    contact_id: _id,
                    id_customer: id_customer,
                    middle_name: middle_name,
                    name: name,
                    logo: logo,
                    fullname: fullname,
                    vocative: vocative,
                    contact_type: contact_type,
                    titles: titles,
                    department: department,
                    office_phone: office_phone,
                    office_email: office_email,
                    personal_phone: personal_phone,
                    personal_email: personal_email,
                    social: social,
                    social_detail: social_detail,
                    source: source,
                    country_contact: country_contact,
                    city_contact: city_contact,
                    district_contact: district_contact,
                    ward_contact: ward_contact,
                    street_contact: street_contact,
                    address_contact: address_contact,
                    area_code_contact: area_code_contact,
                    country_ship: country_ship,
                    city_ship: city_ship,
                    district_ship: district_ship,
                    ward_ship: ward_ship,
                    street_ship: street_ship,
                    address_ship: address_ship,
                    area_code_ship: area_code_ship,
                    description: description,
                    share_all: share_all,
                    accept_phone: accept_phone,
                    accept_email: accept_email,
                    created_at: new Date(),


                })
                let save = await data.save()
                return functions.success(res, " tạo  thành công!",{save});
            }
        }
        } else {
        return functions.setError(res, 'không có quyền truy cập', 400);
        }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
      }
    }
    //sua lien he KH
exports.editContact = async(req, res) => {
    try{
    
    let { contact_id, id_customer, middle_name, name, fullname, vocative, contact_type, titles, department, office_phone, office_email, personal_phone, personal_email, social, social_detail, source, country_contact, city_contact, district_contact, ward_contact, street_contact, address_contact, area_code_contact, country_ship, city_ship, district_ship, ward_ship, street_ship, address_ship, area_code_ship, description, share_all, accept_phone, accept_email } = req.body;
    let logo = null;
    let File = req.files || null;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
    
    if ((id_customer) == undefined) {
        functions.setError(res, " khong tim thay KH ")
    } else if ((name && fullname) == undefined) {
        functions.setError(res, " Nhập tên liên hệ ")
    } else {
        let maxID = await functions.getMaxID(contact);
        if (!maxID) {
            maxID = 0
        };
        const _id = Number(maxID) + 1;
        if (File.logo) {
            // xoa logo
            functions.deleteFileCRM({ contact_id }, { logo })
                // upload new logo 
            let upload = functions.upFileCRM('Logo_detail_customer', _id, File.logo, ['.jpeg', '.jpg', '.png']);
            if (!upload) {
                return functions.setError(res, 'file không hỗ trợ', 400)
            }
            logo = functions.createLinkFileCRM('Logo_detail_customer', _id, File.logo.name)
        }

        await contact.findOneAndUpdate({ contact_id: contact_id, id_customer: id_customer }, {
                contact_type: contact_type,
                vocative: vocative,
                logo: logo,
                middle_name: middle_name,
                titles: titles,
                department: department,
                office_phone: office_phone,
                office_email: office_email,
                personal_phone: personal_phone,
                personal_email: personal_email,
                source: source,
                area_code_contact: area_code_contact,
                area_code_ship: area_code_ship,
                street_contact: street_contact,
                street_ship: street_ship,
                address_contact: address_contact,
                address_ship: address_ship,
                city_contact: city_contact,
                city_ship: city_ship,
                district_contact: district_contact,
                district_ship: district_ship,
                ward_contact: ward_contact,
                ward_ship: ward_ship,
                updated_at: new Date(),
            })
            return functions.success(res, " chỉnh sửa  thành công!");
    }
    } else {
    return functions.setError(res, 'không có quyền truy cập', 400);
    }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }

}

//xoa lien he KH
exports.deleteContact = async(req, res) => {
    try {
        let { contact_id, id_customer } = req.body;
        const data = await contact.findOne({ contact_id: contact_id, id_customer: id_customer })
        if (!data) {
            functions.setError(res, " lien he k ton tai ")
        } else {
            const result = await contact.findOneAndUpdate({ contact_id: contact_id, id_customer: id_customer }, { $set: { is_delete: 1 } })
            functions.success(res, " xoa thanh cong ", { result })
        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}

exports.getContact = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const id_customer = req.body.id_customer;

        if (!id_customer) {
            functions.setError(res, 'không tìm thấy khách hàng')
        } else {
            const data = contact.find({ id_customer: id_customer, is_delete: 0 }).select("contact_type vocative titles office_phone office_email personal_phone personal_email facebook zalo ").skip((pageNumber - 1) * 10).limit(10).sort({ contact_id: -1 })
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data, pageNumber });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}