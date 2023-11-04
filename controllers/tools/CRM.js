const fnc = require('../../services/functions')
const Campaign = require('../../models/crm/Campaign/Campaign')
const DetailCampaign = require('../../models/crm/Campaign/DetailCampaign')
const TablePriceList = require('../../models/crm/TablePriceList')
const DetailPriceList = require('../../models/crm/DetailPriceList')
const Form = require('../../models/crm/Form')
const FormEmail = require('../../models/crm/FormEmail')
const FormContract = require('../../models/crm/Contract/FormContract')
const FormRegister = require('../../models/crm/FormRegister')
const EmailPersonal = require('../../models/crm/EmailPersonal')
const EmailSms = require('../../models/crm/EmailSms')
const EmailSystem = require('../../models/crm/EmailSystem')
const GroupSupplier = require('../../models/crm/GroupSupplier')
const Survey = require('../../models/crm/CustomerCare/Survey')
const HistoryCustomerCare = require('../../models/crm/CustomerCare/HistoryCustomerCare')
const AppointmentSchedule = require('../../models/crm/CustomerCare/AppointmentSchedule')
const Fundbook = require('../../models/crm/FinanceManager/Fundbook')
const GroupPins = require('../../models/crm/GroupPins')
const Products = require('../../models/crm/Products')
const DetailSurvery = require('../../models/crm/CustomerCare/DetailSurvery')
const DetailForm = require('../../models/crm/DetailForm')
const DetailReturnProduct = require('../../models/crm/DetailReturnProduct')
const DetailListOrder = require('../../models/crm/DetailListOrder')
const DetailFormContract = require('../../models/crm/Contract/DetailFormContract')
const DetailEmailSms = require('../../models/crm/DetailEmailSms')
const ProductGroups = require('../../models/crm/ProductGroups')
const Contact = require('../../models/crm/Customer/contract');
const ContactCustomer = require('../../models/crm/Customer/contact_customer')
const Customer = require('../../models/crm/Customer/customer')
const CustomerCare = require('../../models/crm/Customer/customer_care')
const CustomerChance = require('../../models/crm/Customer/customer_chance')
const CustomerChanceFile = require('../../models/crm/Customer/customer_chance_file')
const CustomerChanceFoot = require('../../models/crm/Customer/customer_chance_foots')
const CustomerFile = require('../../models/crm/Customer/customer_file')
const CustomerGroup = require('../../models/crm/Customer/customer_group')
const CustomerMulti = require('../../models/crm/Customer/customer_multi')
const CustomerNote = require('../../models/crm/Customer/customer_note')
const CustomerStatus = require('../../models/crm/Customer/customer_status')
const Phieu = require("../../models/crm/tbl_phieu");
const share_campaign = require("../../models/crm/tbl_share_campaign");
const shareChance = require('../../models/crm/tbl_shareChance');
const shareCustomer = require("../../models/crm/tbl_share_customer");
const Ward = require("../../models/crm/ward");
const history_edit_customer = require("../../models/crm/history/history_edit_customer");
const history_stages = require("../../models/crm/history/history_stages");
const List_new = require("../../models/crm/list/list_new_3312");
const List_order = require("../../models/crm/list/list_order");
const Survey_register = require('../../models/crm/survey_register');
const Accept_role = require('../../models/crm/accept_role');
const Acount_api = require('../../models/crm/account_api');
const Appointment_content_call = require('../../models/crm/appointment_content_call');
const Bank = require('../../models/crm/bank');
const Call_history = require('../../models/crm/call_history');
const City2 = require('../../models/crm/city2');
const Connnect_api_config = require('../../models/crm/connnect_api_config');
const Detail_tbl_phieu = require('../../models/crm/detail_tbl_phieu');
const Return_product = require('../../models/crm/Return_product');
const Supplier = require('../../models/crm/Supplier');
const Receiver_email = require('../../models/crm/Receiver_email');
const Promotion_product = require('../../models/crm/promotion_product');
const ManageAdmin = require('../../models/crm/manage_admin')
const ManageExtension = require('../../models/crm/manager_extension')
const ModuleParent = require('../../models/crm/module_parent')
const NotifyCRM = require('../../models/crm/notify')
const Packages = require('../../models/crm/packages')
const SaveStatusCustomer = require('../../models/crm/save_status_customer')
    // const axios = require('axios');




exports.toolCampaign = async(req, res, next) => {
    try {
        await Campaign.deleteMany({});
        let page = 1;
        let result = true;
        do {

            let data = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listCampaign?page' + page)

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = DB[i];
                    const Campaigns = new Campaign({
                        _id: element.id,
                        groupID: element.group_id,
                        nameCampaign: element.name,
                        typeCampaign: element.campaign_type,
                        timeStart: element.start_date,
                        timeEnd: element.end_date,
                        money: element.money,
                        expectedSales: element.expected_sales,
                        chanelCampaign: element.campaign_chanel,
                        investment: element.investment,
                        empID: element.emp_id,
                        description: element.description,
                        shareAll: element.share_all,
                        companyID: element.company_id,
                        countEmail: element.count_email,
                        status: element.status,
                        type: element.type,
                        userIdCreate: element.user_id_create,
                        userIdUpdate: element.user_id_update,
                        site: element.site,
                        isDelete: element.is_delete,
                        hidden_null: element.hidden_null,
                        createdAt: element.created_at,
                        updatedAt: element.updated_at,
                    })
                    await Campaigns.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolContact = async(req, res, next) => {
    try {
        await Contact.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listContract?page=${page}`, )
            let data = listItems.data;

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(Contact, { id: data[i].id })
                    if (post == null) {
                        let newC = new Contact({
                            id: data[i].id,
                            id_customer: data[i].id_customer,
                            user_created: data[i].user_created,
                            id_form_contract: data[i].id_form_contract,
                            status: data[i].status,
                            emp_id: data[i].emp_id,
                            comp_id: data[i].comp_id,
                            path_dowload: data[i].path_dowload,
                            is_delete: data[i].is_delete,
                            created_at: createAt,
                            updated_at: updateAt,

                        });
                        await newC.save();
                    }
                }
                page += 1;
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolTablePriceList = async(req, res, next) => {

    try {
        await TablePriceList.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listTablePriceList?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const PriceList = new TablePriceList({
                        _id: element.id,
                        company_id: element.company_id,
                        emp_id: element.emp_id,
                        id_customer: element.id_customer,
                        image_logo: element.image_logo,
                        name: element.name,
                        website: element.website,
                        user_bank: element.user_bank,
                        name_bank: element.name_bank,
                        number_bank: element.number_bank,
                        branch_bank: element.branch_bank,
                        count: element.count,
                        discount: element.discount,
                        type_discount: element.type_discount,
                        content: element.content,
                        is_delete: element.is_delete,
                        status_save: element.status_save,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await PriceList.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolDetailCampaign = async(req, res, next) => {

    try {
        await DetailCampaign.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailCampaign?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await DetailCampaign.findById(element.id)
                    if (check) continue
                    const Detail = new DetailCampaign({
                        _id: element.id,
                        id_campagin: element.id_campagin,
                        id_cus: element.id_cus,
                        status: element.status,
                        note: element.note,
                        emp_id: element.emp_id,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await Detail.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolAppointmentSchedule = async(req, res, next) => {
    try {
        await AppointmentSchedule.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listAppointmentSchedule?page' + page)
            let data = listItems.data;

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await AppointmentSchedule.findById(element.id)
                    if (check) continue
                        // let post = await fnc.getDatafindOne(AppointmentSchedule, { _id: element.new_id });
                        // if (post == null) {
                    const schedule = new AppointmentSchedule({
                        _id: element.id,
                        schedule_name: element.schedule_name,
                        cus_id: element.cus_id,
                        id_customer: element.id_customer,
                        ep_id: element.ep_id,
                        address: element.address,
                        start_date_schedule: element.start_date_schedule,
                        end_date_schedule: element.end_date_schedule,
                        schedule_status: element.schedule_status,
                        reason_cancel: element.reason_cancel,
                        description: element.description,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await schedule.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolHistoryCustomerCare = async(req, res, next) => {

    try {
        await HistoryCustomerCare.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listHistoryCustomerCare?page' + page)
            let data = listItems.data;
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await HistoryCustomerCare.findById(element.id);
                    if (check) continue
                        // let post = await fnc.getDatafindOne(HistoryCustomerCare, { _id: element.new_id });
                        // if (post == null) {
                    const schedule = new HistoryCustomerCare({
                        _id: element.id,
                        id_customer: element.id_customer,
                        id_customer_care: element.id_customer_care,
                        days: element.days,
                        weeks: element.weeks,
                        month: element.month,
                        count: element.count,
                        start_date: element.start_date,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await schedule.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolFundbook = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFundbook?page' + page)
            let data = listItems.data;
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await Fundbook.findById(element.id)
                    if (check) continue
                        // let post = await fnc.getDatafindOne(Fundbook, { _id: element.new_id });
                        // if (post == null) {
                    const datas = new Fundbook({
                        _id: element.id,
                        name: element.name,
                        total_money: element.total_money,
                        id_supplier: element.id_supplier,
                        id_company: element.id_company,
                        description: element.description,
                        id_manager: element.id_manager,
                        status: element.status,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await datas.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolDetailPriceList = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailPriceList?page' + page)
            let data = listItems.data;
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await DetailPriceList.findById(element.id)
                    console.log(check)
                    if (check) continue
                        // let post = await fnc.getDatafindOne(DetailPriceList, { _id: element.new_id });
                        // if (post == null) {
                    const datas = new DetailPriceList({
                        _id: element.id,
                        id_table_price: element.id_table_price,
                        sum_1: element.sum_1,
                        id_product: element.id_product,
                        quantity: element.quantity,
                        tax: element.tax,
                        discount: element.discount,
                        type_discount: element.type_discount,
                        sum: element.sum,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await datas.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toollistSurvey = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listSurvey?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                let check = await Survey.findById(data[i].id)
                if (check) continue
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new Survey({
                        _id: element.id,
                        title: element.title,
                        url_survey: element.url_survey,
                        description: element.description,
                        create_date: element.create_date,
                        company_id: element.company_id,
                        emp_id: element.emp_id,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}


exports.toolForm = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listForm?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new Form({
                        _id: element.id,
                        name: element.name,
                        phone_number: element.phone_number,
                        email: element.email,
                        gender: element.gender,
                        birthday: element.birthday,
                        address: element.address,
                        name_form: element.name_form,
                        url_form: element.url_form,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        emp_id: element.emp_id,
                        company_id: element.company_id,
                        type: element.type,
                        status: element.status,
                        name_add_field: element.name_add_field,
                        add_field: element.add_field,
                        field_right: element.field_right,
                        count_open: element.count_open,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolFormContract = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormContract?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new FormContract({
                        _id: element.id,
                        name: element.name,
                        path_file: element.path_file,
                        com_id: element.com_id,
                        ep_id: element.ep_id,
                        id_file: element.id_file,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolFormEmail = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormEmail?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new FormEmail({
                        _id: element.id,
                        company_id: element.company_id,
                        name_form_email: element.name_form_email,
                        title_form_email: element.title_form_email,
                        content_form_email: element.content_form_email,
                        user_create_id: element.user_create_id,
                        user_create_type: element.user_create_type,
                        user_edit_id: element.user_edit_id,
                        user_edit_type: element.user_edit_type,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
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

exports.toolFormRegister = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormEmail?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new FormRegister({
                        _id: element.id,
                        id_form: element.id_form,
                        name: element.name,
                        phone_number: element.phone_number,
                        email: element.email,
                        gender: element.gender,
                        birthday: element.birthday,
                        address: element.address,
                        question: element.question,
                        answer: element.answer,
                        choose_answer: element.choose_answer,
                        type: element.type,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
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

exports.toolEmailPersonal = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailPersonal?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const listSurvey = new EmailPersonal({
                        _id: element.id,
                        company_id: element.company_id,
                        server_mail: element.server_mail,
                        port_number: element.port_number,
                        address_send_mail: element.address_send_mail,
                        name_mail: element.name_mail,
                        name_login: element.name_login,
                        password: element.password,
                        method_security: element.method_security,
                        number_email_sent: element.number_email_sent,
                        time_send_mail: element.time_send_mail,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolEmailSms = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailSms?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await EmailSms.findById(data[i].id)
                    console.log(check)
                    if (check) continue

                    const element = data[i];
                    const listSurvey = new EmailSms({
                        _id: element.id,
                        company_id: element.company_id,
                        type: element.type,
                        campaign_id: element.campaign_id,
                        email_id: element.email_id,
                        title: element.title,
                        name: element.name,
                        content: element.content,
                        supplier: element.supplier,
                        all_receiver: element.all_receiver,
                        list_receiver: element.list_receiver,
                        email_reply: element.email_reply,
                        info_system: element.info_system,
                        date_send_email: element.date_send_email,
                        time_send_email: element.time_send_email,
                        user_create_id: element.user_create_id,
                        user_create_type: element.user_create_type,
                        user_edit_id: element.user_edit_id,
                        user_edit_type: element.user_edit_type,
                        status: element.status,
                        customer_id: element.customer_id,
                        time_service: element.time_service,
                        sell_value: element.sell_value,
                        time_service_end: element.time_service_end,
                        sell_value_end: element.sell_value_end,
                        cit_id: element.cit_id,
                        birth_day: element.birth_day,
                        birthday_end: element.birthday_end,
                        emp_id: element.emp_id,
                        cus_date: element.cus_date,
                        cus_date_end: element.cus_date_end,
                        resoure: element.resoure,
                        gender: element.gender,
                        gr_id: element.gr_id,
                        start_date: element.start_date,
                        send_time: element.send_time,
                        site: element.site,
                        id_color: element.id_color,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolEmailSystem = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailSystem?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await EmailSystem.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new EmailSystem({
                        _id: element.id,
                        company_id: element.company_id,
                        server_mail: element.server_mail,
                        port_number: element.port_number,
                        address_send_mail: element.address_send_mail,
                        name_mail: element.name_mail,
                        name_login: element.name_login,
                        password: element.password,
                        method_security: element.method_security,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolGroupSupplier = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listGroupSupplier?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await GroupSupplier.findById(data[i].gr_id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new GroupSupplier({

                        _id: element.gr_id,
                        gr_name: element.gr_name,
                        gr_description: element.gr_description,
                        company_id: element.company_id,
                        emp_id: element.emp_id,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolGroupPins = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listGroupPins?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await GroupPins.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new GroupPins({

                        _id: element.id,
                        user_id: element.user_id,
                        user_type: element.user_type,
                        group_id: element.group_id,
                        status: element.status,
                        is_parent: element.is_parent,
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    })
                    await listSurvey.save()
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolDetailSurvery = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailSurvery?page' + page)
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await DetailSurvery.findById(data[i].id)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailSurvery({

                        _id: element.id,
                        id_survey: element.id_survey,
                        title: element.title,
                        description: element.description,
                        question: element.question,
                        answer: element.answer,
                        answer_right: element.answer_right,
                        small_title: element.small_title,
                        small_description: element.small_description,
                        url_image: element.url_image,
                        url_video: element.url_video,
                        type: element.type,
                        type_part: element.type_part,
                        created_at: element.created_at,
                        updated_at: element.updated_at,


                    })
                    await listSurvey.save()
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

exports.toolDetailReturnProduct = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailReturnProduct?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await DetailReturnProduct.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailReturnProduct({

                        _id: element.id,
                        parent_id: element.parent_id,
                        product_id: element.product_id,
                        price: element.price,
                        quantity: element.quantity,
                        created_at: element.created_at,


                    })
                    await listSurvey.save()
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

exports.toolContactCustomer = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listContactCustomer?page=${page}`);
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(ContactCustomer, { contact_id: data[i].contact_id })
                    if (post == null) {
                        let newCC = new ContactCustomer({
                            contact_id: data[i].contact_id,
                            id_customer: data[i].id_customer,
                            middle_name: data[i].middle_name,
                            name: data[i].name,
                            fullname: data[i].fullname,
                            vocative: data[i].vocative,
                            logo: data[i].logo,
                            contact_type: data[i].contact_type,
                            titles: data[i].titles,
                            department: data[i].department,
                            office_phone: data[i].office_phone,
                            office_email: data[i].office_email,
                            personal_phone: data[i].personal_phone,
                            personal_email: data[i].personal_email,
                            social: data[i].social,
                            social_detail: data[i].social_detail,
                            source: data[i].source,
                            country_contact: data[i].country_contact,
                            city_contact: data[i].city_contactl,
                            district_contact: data[i].district_contact,
                            ward_contact: data[i].ward_contact,
                            address_contact: data[i].address_contact,
                            area_code_contact: data[i].area_code_contact,
                            country_ship: data[i].country_ship,
                            city_ship: data[i].city_ship,
                            district_ship: data[i].district_ship,
                            ward_ship: data[i].ward_ship,
                            address_ship: data[i].address_ship,
                            area_code_ship: data[i].area_code_ship,
                            description: data[i].description,
                            share_all: data[i].share_all,
                            accept_phone: data[i].accept_phone,
                            accept_email: data[i].accept_email,
                            user_create_id: data[i].user_create_id,
                            user_create_type: data[i].user_create_type,
                            user_edit_id: data[i].user_edit_id,
                            user_edit_type: data[i].user_edit_type,
                            is_delete: data[i].is_delete,
                            created_at: createAt,
                            updated_at: updateAt,

                        });
                        await newCC.save();
                    }
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomer = async(req, res, next) => {
    try {
        const request = req.body;
        await Customer.deleteOne({ cus_id: request.cus_id });
        let newCS = new Customer({
            cus_id: request.cus_id,
            email: request.email,
            phone_number: request.phone_number,
            name: request.name,
            stand_name: request.stand_name,
            logo: request.logo,
            birthday: request.birthday,
            tax_code: request.tax_code,
            cit_id: request.cit_id,
            district_id: request.district_id,
            ward: request.ward,
            address: request.address,
            ship_invoice_address: request.ship_invoice_address,
            gender: request.gender,
            cmnd_ccnd_number: request.cmnd_ccnd_number,
            cmnd_ccnd_address: request.cmnd_ccnd_address,
            cmnd_ccnd_time: request.cmnd_ccnd_time,
            resoure: request.resoure,
            description: request.description,
            district_contact: request.district_contact,
            introducer: request.introducer,
            contact_name: request.contact_name,
            contact_email: request.contact_email,
            contact_phone: request.contact_phone,
            contact_gender: request.contact_gender,
            company_id: request.company_id,
            emp_id: request.emp_id,
            user_handing_over_work: request.user_handing_over_work,
            user_create_id: request.user_create_id,
            user_create_type: request.user_create_type,
            user_edit_id: request.user_edit_id,
            user_edit_type: request.user_edit_type,
            group_id: request.group_id,
            status: request.status,
            business_areas: request.business_areas,
            classify: request.classify,
            user_edit_type: request.user_edit_type,
            business_type: request.business_type,
            category: request.category,
            bill_city: request.bill_city,
            bill_district: request.bill_district,
            bill_ward: request.bill_ward,
            bill_address: request.bill_address,
            bill_area_code: request.bill_area_code,
            bill_invoice_address: request.bill_invoice_address,
            bill_invoice_address_email: request.bill_invoice_address_email,
            ship_city: request.ship_city,
            ship_area: request.ship_area,
            bank_id: request.bank_id,
            bank_account: request.bank_account,
            revenue: request.revenue,
            size: request.size,
            rank: request.rank,
            website: request.website,
            number_of_days_owed: request.number_of_days_owed,
            debt_limit: request.debt_limit,
            share_all: request.share_all,
            type: request.type,
            is_input: request.is_input,
            is_delete: request.is_delete,
            created_at: request.created_at,
            updated_at: request.updated_at,
            id_cus_from: request.id_cus_from,
            cus_from: request.cus_from,
            link: request.link
        });
        await newCS.save();
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomerCare = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerCare?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    let createDate = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    if (data[i].create_date != 0) {
                        createDate = new Date(data[i].create_date * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerCare, { id: data[i].id })
                    if (post == null) {
                        let newCR = new CustomerCare({
                            id: data[i].id,
                            name: data[i].name,
                            id_creator: data[i].id_creator,
                            create_date: createDate,
                            option_care: data[i].option_care,
                            set_up_calendar: data[i].set_up_calendar,
                            description: data[i].description,
                            count: data[i].count,
                            company_id: data[i].company_id,
                            emp_id: data[i].emp_id,
                            is_delete: data[i].is_delete,
                            site: data[i].site,
                            created_at: createAt,
                            updated_at: updateAt,
                        });
                        await newCR.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolDetailListOrder = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailListOrder?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // let check = await DetailListOrder.findById(data[i].id)
                    // console.log(check)
                    // if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailListOrder({

                        _id: element.id,
                        id_product: element.id_product,
                        id_parent: element.id_parent,
                        product_name: element.product_name,
                        product_unit: element.product_unit,
                        quantity: element.quantity,
                        price: element.price,
                        total: element.total,
                        type_discount: element.type_discount,
                        percent_discount: element.percent_discount,
                        discount: element.discount,
                        vat: element.vat,
                        percent_tax: element.percent_tax,
                        tax_in_money: element.tax_in_money,
                        total_after_process: element.total_after_process,
                        status: element.status,
                        is_delete: element.is_delete,
                        created_at: element.created_at,

                    })
                    await listSurvey.save()
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

exports.toolCustomerChance = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChance?page=${page}`);
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    let expectedDate = null;

                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    if (data[i].expected_end_date != 0) {
                        expectedDate = new Date(data[i].expected_end_date * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerChance, { id: data[i].id })
                    if (post == null) {
                        let newCS = new CustomerChance({
                            id: data[i].id,
                            name: data[i].name,
                            com_id: data[i].com_id,
                            cus_id: data[i].cus_id,
                            contact_id: data[i].contact_id,
                            type: data[i].type,
                            group_commodities: data[i].group_commodities,
                            money: data[i].money,
                            stages: data[i].stages,
                            success_rate: data[i].success_rate,
                            expected_sales: data[i].expected_sales,
                            expected_end_date: expectedDate,
                            campaign_id: data[i].campaign_id,
                            source: data[i].source,
                            emp_id: data[i].emp_id,
                            discount_total_rate: data[i].discount_total_rate,
                            discount_total_money: data[i].discount_total_money,
                            total_money: data[i].total_money,
                            description: data[i].description,
                            country_chance: data[i].country_chance,
                            city_chance: data[i].city_chance,
                            district_chance: data[i].district_chance,
                            ward_chance: data[i].ward_chance,
                            street_chance: data[i].street_chance,
                            area_code_chance: data[i].area_code_chance,
                            address_chance: data[i].address_chance,
                            share_all: data[i].share_all,
                            user_id_create: data[i].user_id_create,
                            user_id_edit: data[i].user_id_edit,
                            result: data[i].result,
                            reason: data[i].reason,
                            time_complete: data[i].time_complete,
                            delete_chance: data[i].delete_chance,
                            created_at: createAt,
                            updated_at: updateAt
                        });
                        await newCS.save();
                    }
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomerChanceFile = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChanceFile?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].update_at != 0) {
                        updateAt = new Date(data[i].update_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerChanceFile, { id: data[i].id })
                    if (post == null) {
                        let newCF = new CustomerChanceFile({
                            id: data[i].id,
                            file_name: data[i].file_name,
                            cus_id: data[i].cus_id,
                            user_created_id: data[i].user_created_id,
                            chance_id: data[i].chance_id,
                            file_size: data[i].file_size,
                            created_at: createAt,
                            update_at: updateAt
                        });
                        await newCF.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolDetailFormContract = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailFormContract?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const listSurvey = new DetailFormContract({

                        _id: data[i].id,
                        id_form_contract: data[i].id_form_contract,
                        new_field: data[i].new_field,
                        old_field: data[i].old_field,
                        index_field: data[i].index_field,
                        default_field: data[i].default_field,

                    })
                    await listSurvey.save()
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

exports.toolChanFoots = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChanceFoots?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {

                    let post = await fnc.getDatafindOne(CustomerChanceFoot, { id: data[i].id })
                    if (post == null) {
                        let newCFO = new CustomerChanceFoot({
                            id: data[i].id,
                            chance_id: data[i].chance_id,
                            foots_id: data[i].foots_id,
                            foots_name: data[i].foots_name,
                            unit_of_measure: data[i].unit_of_measure,
                            quantity: data[i].quantity,
                            price: data[i].price,
                            discount_rate: data[i].discount_rate,
                            discount_money: data[i].discount_money,
                            tax: data[i].tax,
                            tax_money: data[i].tax_money,

                        });
                        await newCFO.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolDetailEmailSms = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailEmailSms?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // let check = await DetailListOrder.findById(data[i].id)
                    // console.log(check)
                    // if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailEmailSms({

                        _id: element.id,
                        id_email_sms: element.id_email_sms,
                        id_cus: element.id_cus,
                        created_at: element.created_at,
                        updated_at: element.updated_at,

                    })
                    await listSurvey.save()
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

exports.toolCusFile = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerFile?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerFile, { id: data[i].id })
                    if (post == null) {
                        let newCuF = new CustomerFile({
                            id: data[i].id,
                            file_name: data[i].file_name,
                            cus_id: data[i].cus_id,
                            user_created_id: data[i].user_created_id,
                            file_size: data[i].file_size,
                            created_at: createAt,

                        });
                        await newCuF.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerGroup = async(req, res, next) => {
    try {

        const request = req.body;
        await CustomerGroup.deleteOne({ gr_id: request.gr_id })
        let newCG = new CustomerGroup({
            gr_id: request.gr_id,
            gr_name: request.gr_name,
            gr_description: request.gr_description,
            group_parent: request.group_parent,
            company_id: request.company_id,
            dep_id: request.dep_id,
            emp_id: request.emp_id,
            count_customer: request.count_customer,
            is_delete: request.is_delete,
            created_at: request.created_at,
            updated_at: request.updated_at
        });
        await newCG.save();
        return fnc.success(res, 'Thành Công');

    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomeMulti = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerMulti?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {

                    let post = await fnc.getDatafindOne(CustomerMulti, { id: data[i].id })
                    if (post == null) {
                        let newCM = new CustomerMulti({
                            id: data[i].id,
                            customer_id: data[i].customer_id,
                            link: data[i].link,

                        });
                        await newCM.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerNote = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerNote?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerNote, { id: data[i].id })
                    if (post == null) {
                        let newCN = new CustomerNote({
                            id: data[i].id,
                            content: data[i].content,
                            cus_id: data[i].cus_id,
                            user_created_id: data[i].user_created_id,
                            created_at: createAt,
                            updated_at: updateAt

                        });
                        await newCN.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerStatus = async(req, res, next) => {
    try {
        await CustomerStatus.deleteMany({});
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerStatus?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(CustomerStatus, { stt_id: data[i].stt_id })
                    if (post == null) {
                        let newCS = new CustomerStatus({
                            stt_id: data[i].stt_id,
                            stt_name: data[i].stt_name,
                            com_id: data[i].com_id,
                            created_user: data[i].created_user,
                            type_created: data[i].type_created,
                            status: data[i].status,
                            is_delete: data[i].is_delete,
                            created_at: data[i].created_at,
                            updated_at: data[i].updated_at

                        });
                        await newCS.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.tool_phieu = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblPhieu?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_phieu = new Phieu({
                        id: listItem[i].id,
                        company_id: listItem[i].company_id,
                        name: listItem[i].name,
                        number: listItem[i].number,
                        user_create: listItem[i].user_create,
                        money: listItem[i].money,
                        money_history: listItem[i].money_history,
                        contract_id: listItem[i].contract_id,
                        content: listItem[i].content,
                        supplier_id: listItem[i].supplier_id,
                        id_customer: listItem[i].id_customer,
                        name_unit: listItem[i].name_unit,
                        user_contact_name: listItem[i].user_contact_name,
                        user_contact_phone: listItem[i].user_contact_phone,
                        type: listItem[i].type,
                        status: listItem[i].status,
                        accepted: listItem[i].accepted,
                        site: listItem[i].site,
                        is_delete: listItem[i].is_delete,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                        date_created: listItem[i].date_created,
                        date_receit: listItem[i].date_receit,
                    })
                    await new_phieu.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tbl_share_campaign = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareCampaign?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_share_campaign = new share_campaign({
                        id: listItem[i].id,
                        campaign_id: listItem[i].campaign_id,
                        emp_share: listItem[i].emp_share,
                        type: listItem[i].type,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        receiver_name: listItem[i].receiver_name,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,



                    })
                    await new_share_campaign.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tbl_share_chance = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareChance?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_shareChance = new shareChance({
                        id: listItem[i].id,
                        chance_id: listItem[i].chance_id,
                        emp_share: listItem[i].emp_share,
                        type: listItem[i].type,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        receiver_name: listItem[i].receiver_name,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                    })
                    await new_shareChance.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tbl_share_customer = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareCustomer?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_shareCustormer = new shareCustomer({
                        id: listItem[i].id,
                        customer_id: listItem[i].customer_id,
                        emp_share: listItem[i].emp_share,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        created_at: listItem[i].created_at,

                    })
                    await new_shareCustormer.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.ward = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listWard?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_ward = new Ward({
                        ward_id: listItem[i].ward_id,
                        ward_name: listItem[i].ward_name,
                        district_id: listItem[i].district_id,
                    })
                    await new_ward.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.history_edit_customer = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listHistoryEditEustomer?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_history_edit_customer = new history_edit_customer({
                        id: listItem[i].id,
                        customer_id: listItem[i].customer_id,
                        content: listItem[i].content,
                        contact_id: listItem[i].contact_id,
                        type: listItem[i].type,
                        created_at: listItem[i].created_at,

                    })
                    await new_history_edit_customer.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.history_stages = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listHistoryStages?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_history_stages = new history_stages({
                        id: listItem[i].id,
                        chance_id: listItem[i].chance_id,
                        stages_id: listItem[i].stages_id,
                        stages_name: listItem[i].stages_name,
                        money: listItem[i].money,
                        success_rate: listItem[i].success_rate,
                        expected_sales: listItem[i].expected_sales,
                        time_complete: listItem[i].time_complete,
                        user_id_edit: listItem[i].user_id_edit,
                        created_at: listItem[i].created_at,
                        update_at: listItem[i].update_at,


                    })
                    await new_history_stages.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.list_new_3321 = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listNew3312?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_List_new = new List_new({
                        id: listItem[i].id,
                        com_id: listItem[i].com_id,
                        cus_id: listItem[i].cus_id,
                        id_new: listItem[i].id_new,
                        title: listItem[i].title,
                        content: listItem[i].content,
                        link: listItem[i].link,
                        resoure: listItem[i].resoure,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,

                    })
                    await new_List_new.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.list_order = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listOrder?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_List_order = new List_order({
                        id: listItem[i].id,
                        comp_id: listItem[i].comp_id,
                        id_customer: listItem[i].id_customer,
                        emp_id: listItem[i].emp_id,
                        order_date: listItem[i].order_date,
                        quote_id: listItem[i].quote_id,
                        chance_id: listItem[i].chance_id,
                        campaign_id: listItem[i].campaign_id,
                        explanation: listItem[i].explanation,
                        category_order: listItem[i].category_order,
                        number_of_days_owed: listItem[i].number_of_days_owed,
                        delivery_term: listItem[i].delivery_term,
                        payment_expires_date: listItem[i].payment_expires_date,
                        discount: listItem[i].discount,
                        percent_discount: listItem[i].percent_discount,
                        discount_type: listItem[i].discount_type,
                        is_delete: listItem[i].is_delete,
                        status: listItem[i].status,
                        delivery_status: listItem[i].delivery_status,
                        actual_amount_earned: listItem[i].actual_amount_earned,
                        order_fulfillment_costs: listItem[i].order_fulfillment_costs,
                        status_pay: listItem[i].status_pay,
                        invoicing: listItem[i].invoicing,
                        contact_user_id: listItem[i].contact_user_id,
                        country_bill: listItem[i].country_bill,
                        city_bill: listItem[i].city_bill,
                        district_bill: listItem[i].district_bill,
                        ward_bill: listItem[i].ward_bill,
                        address_bill: listItem[i].address_bill,
                        area_code_bill: listItem[i].area_code_bill,
                        address_in_bill: listItem[i].address_in_bill,
                        email_receive: listItem[i].email_receive,
                        receive_user: listItem[i].receive_user,
                        phone: listItem[i].phone,
                        receive_country: listItem[i].receive_country,
                        receive_city: listItem[i].receive_city,
                        receive_district: listItem[i].receive_district,
                        receive_ward: listItem[i].receive_ward,
                        receive_address: listItem[i].receive_address,
                        receive_area_code: listItem[i].receive_area_code,
                        address_delivery: listItem[i].address_delivery,
                        description: listItem[i].description,
                        sum: listItem[i].sum,
                        share_all: listItem[i].share_all,
                        created_date: listItem[i].created_date,
                        type: listItem[i].type,
                        active_by_warehouse: listItem[i].active_by_warehouse,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,


                    })
                    await new_List_order.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

//trung
exports.toolDetailForm = async(req, res, next) => {
        try {
            let page = 1;
            let result = true;
            do {
                let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailForm?page' + page)
                let data = listItems.data;
                // console.log(data)
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let check = await DetailForm.findById(data[i].id)
                        console.log(check)
                        if (check) continue
                        const element = data[i];
                        const listSurvey = new DetailForm({

                            _id: element.id,
                            id_form: element.id_form,
                            question: element.question,
                            answer: element.answer,
                            answer_right: element.answer_right,
                            type: element.type,
                            created_at: element.created_at,
                            updated_at: element.updated_at,

                        })
                        await listSurvey.save()
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
    //lâm
exports.toolmanageAdmin = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listManageAdmin?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(ManageAdmin, { id: data[i].id })
                    if (post == null) {
                        let newCS = new ManageAdmin({
                            id: data[i].id,
                            usc_kd: data[i].usc_kd,
                            id_qlc: data[i].id_qlc,
                            name: data[i].name,

                        });
                        await newCS.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};
//trung
exports.toolProducts = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailForm?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await Products.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new Products({

                        id: element.id,
                        group_id: element.group_id,
                        prod_name: element.prod_name,
                        dvt: element.dvt,
                        product_image: element.product_image,
                        size: element.size,
                        min_inventory: element.min_inventory,
                        price_import: element.price_import,
                        retail_prices: element.retail_prices,
                        wholesale_prices: element.wholesale_prices,
                        bao_hanh: element.bao_hanh,
                        expiration_date: element.expiration_date,
                        product_origin: element.product_origin,
                        inventory: element.inventory,
                        status: element.status,
                        emp_id: element.emp_id,
                        company_id: element.company_id,
                        prod_from_id: element.prod_from_id,
                        is_delete: element.is_delete,
                        created_at: element.created_at,
                        updated_at: element.updated_at,




                    })
                    await listSurvey.save()
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
};

//lâm
exports.toolmanageExtension = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listManagerExtension?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(ManageExtension, { id: data[i].id })
                    if (post == null) {
                        let newME = new ManageExtension({
                            id: data[i].id,
                            company_id: data[i].company_id,
                            ext_id: data[i].ext_id,
                            ext_number: data[i].ext_number,
                            ext_password: data[i].ext_password,
                            emp_id: data[i].emp_id,
                            created_at: createAt,
                            updated_at: updateAt

                        });
                        await newME.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

//lâm
exports.toolmoduleParent = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listModuleParent?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(ModuleParent, { id: data[i].id })
                    if (post == null) {
                        let newMP = new ModuleParent({
                            id: data[i].id,
                            module_name: data[i].module_name,
                            mod_order: data[i].mod_order,

                        });
                        await newMP.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

//trung
exports.toolProductGroups = async(req, res, next) => {


    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listProductGroups?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await ProductGroups.findById(data[i].gr_id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new ProductGroups({

                        _id: element.gr_id,
                        gr_name: element.gr_name,
                        count_product: element.count_product,
                        description: element.description,
                        company_id: element.company_id,
                        emp_id: element.emp_id,
                        is_delete: element.is_delete,
                        from_id: element.from_id,
                        created_at: element.created_at,
                        updated_at: element.updated_at,




                    })
                    await listSurvey.save()
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

//lâm
exports.toolNotify = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listNotify?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(NotifyCRM, { notify_id: data[i].notify_id })
                    if (post == null) {
                        let newN = new NotifyCRM({
                            notify_id: data[i].notify_id,
                            notify_type: data[i].notify_type,
                            notify_cus_name: data[i].notify_cus_name,
                            notify_group_name: data[i].notify_group_name,
                            notify_cus_id: data[i].notify_cus_id,
                            emp_id: data[i].emp_id,
                            seen: data[i].seen,
                            created_at: createAt,

                        });
                        await newN.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

//lam
exports.toolPackages = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listPackages?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(Packages, { id: data[i].id })
                    if (post == null) {
                        let newPA = new Packages({
                            id: data[i].id,
                            id_cus: data[i].id_cus,
                            id_service: data[i].id_service,
                            number: data[i].number,
                            name: data[i].name,
                            email: data[i].email,
                            phone: data[i].phone,
                            address: data[i].address,
                            tax: data[i].tax,
                            represent: data[i].represent,
                            position: data[i].position,
                            vat: data[i].vat,
                            discount: data[i].discount,
                            option_discount: data[i].option_discount,
                            bank: data[i].bank,
                            type: data[i].type,
                            usc_type: data[i].usc_type,
                            usc_source_web: data[i].usc_source_web,
                            total: data[i].total,
                            created_at: createAt,
                            updated_at: updateAt

                        });
                        await newPA.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};
exports.toolSavestatusC = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listSaveStatusCustomer?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].save_created_at != 0) {
                        createAt = new Date(data[i].save_created_at * 1000)
                    }
                    if (data[i].save_updated_at != 0) {
                        updateAt = new Date(data[i].save_updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(SaveStatusCustomer, { save_status_id: data[i].save_status_id })
                    if (post == null) {
                        let newSS = new SaveStatusCustomer({
                            save_status_id: data[i].save_status_id,
                            user_id: data[i].user_id,
                            customer_id: data[i].customer_id,
                            type_user: data[i].type_user,
                            save_status: data[i].save_status,
                            save_created_at: createAt,
                            save_updated_at: updateAt

                        });
                        await newSS.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
}

//Tinh
exports.survey_register = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listSurveyRegister?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Survey_register = new Survey_register({
                        id: listItem[i].id,
                        id_survey: listItem[i].id_survey,
                        phone_cus: listItem[i].phone_cus,
                        email_cus: listItem[i].email_cus,
                        name_cus: listItem[i].name_cus,
                        address: listItem[i].address,
                        question: listItem[i].question,
                        answer: listItem[i].answer,



                    })
                    await new_Survey_register.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.accept_role = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listAcceptRole?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Accept_role = new Accept_role({
                        id: listItem[i].id,
                        id_role: listItem[i].id_role,
                        id_module: listItem[i].id_module,
                        id_user: listItem[i].id_user,
                        add: listItem[i].add,
                        edit: listItem[i].edit,
                        delete: listItem[i].delete,
                        seen: listItem[i].seen,




                    })
                    await new_Accept_role.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.account_api = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listAccountApi?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Acount_api = new Acount_api({
                        id: listItem[i].id,
                        com_id: listItem[i].id_company,
                        account: listItem[i].account,
                        password: listItem[i].password,
                        switchboard: listItem[i].switchboard,
                        domain: listItem[i].domain,
                        status: listItem[i].status,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,




                    })
                    await new_Acount_api.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.appointment_content_call = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listAppointmentContentCall?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Appointment_content_call = new Appointment_content_call({
                        id: listItem[i].id,
                        id_appointment: listItem[i].id_appointment,
                        id_cus: listItem[i].id_cus,
                        content_call: listItem[i].content_call,
                        created_at: listItem[i].created_at,

                    })
                    await new_Appointment_content_call.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.bank = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listBank?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Bank = new Bank({
                        bank_code: listItem[i].bank_code,
                        bank_name: listItem[i].bank_name,
                    })
                    await new_Bank.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.call_history = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCallHistory?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Call_history = new Call_history({
                        id: listItem[i].id,
                        phone: listItem[i].phone,
                        extension: listItem[i].extension,
                        com_id: listItem[i].com_id,
                        created_at: listItem[i].created_at,

                    })
                    await new_Call_history.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.city2 = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCity2?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_City2 = new City2({
                        cit_id: listItem[i].cit_id,
                        cit_name: listItem[i].cit_name,
                        cit_order: listItem[i].cit_order,
                        cit_parent: listItem[i].cit_parent,
                    })
                    await new_City2.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.connnect_api_config = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listConnnectApiConfig?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Connnect_api_config = new Connnect_api_config({
                        id: listItem[i].id,
                        company_id: listItem[i].company_id,
                        appID: listItem[i].appID,
                        webhook: listItem[i].webhook,
                        token: listItem[i].token,
                        user_edit_id: listItem[i].user_edit_id,
                        user_edit_type: listItem[i].user_edit_type,
                        stt_conn: listItem[i].stt_conn,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,

                    })
                    await new_Connnect_api_config.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.detail_tbl_phieu = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listDetailTblPhieu?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Detail_tbl_phieu = new Detail_tbl_phieu({
                        id: listItem[i].id,
                        id_phieu: listItem[i].id_phieu,
                        pay_option: listItem[i].pay_option,
                        price: listItem[i].price,
                        id_fundbook: listItem[i].id_fundbook,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                    })
                    await new_Detail_tbl_phieu.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.return_product = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listReturnProduct?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Return_product = new Return_product({
                        id: listItem[i].id,
                        comp_id: listItem[i].comp_id,
                        customer_id: listItem[i].customer_id,
                        emp_id: listItem[i].emp_id,
                        contact_customer_id: listItem[i].contact_customer_id,
                        user_name: listItem[i].user_name,
                        user_phone: listItem[i].user_phone,
                        order_id: listItem[i].order_id,
                        explanation: listItem[i].explanation,
                        status: listItem[i].status,
                        status_action: listItem[i].status_action,
                        country_bill: listItem[i].country_bill,
                        city_bill: listItem[i].city_bill,
                        district_bill: listItem[i].district_bill,
                        ward_bill: listItem[i].ward_bill,
                        address_bill: listItem[i].address_bill,
                        area_code_bill: listItem[i].area_code_bill,
                        address_in_bill: listItem[i].address_in_bill,
                        suggested_date: listItem[i].suggested_date,
                        sum: listItem[i].sum,
                        description: listItem[i].description,
                        is_delete: listItem[i].is_delete,
                        active_by_warehouse: listItem[i].active_by_warehouse,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                    })
                    await new_Return_product.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.supplier = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listSupplier?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Supplier = new Supplier({
                        id: listItem[i].id,
                        name: listItem[i].name,
                        email: listItem[i].email,
                        phone_number: listItem[i].phone_number,
                        address: listItem[i].address,
                        contact_name: listItem[i].contact_name,
                        contact_phone: listItem[i].contact_phone,
                        bank_id: listItem[i].bank_id,
                        account_number: listItem[i].account_number,
                        ctk: listItem[i].ctk,
                        mst: listItem[i].mst,
                        description: listItem[i].description,
                        emp_id: listItem[i].emp_id,
                        company_id: listItem[i].company_id,
                        group_id: listItem[i].group_id,
                        is_delete: listItem[i].is_delete,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,

                    })
                    await new_Supplier.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.receiver_email = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listReceiverEmail?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Receiver_email = new Receiver_email({
                        id: listItem[i].id,
                        name_group: listItem[i].name_group,
                        supplier: listItem[i].supplier,
                        company_id: listItem[i].company_id,
                        user_create_id: listItem[i].user_create_id,
                        user_create_type: listItem[i].user_create_type,
                        user_edit_id: listItem[i].user_edit_id,
                        user_edit_type: listItem[i].user_edit_type,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                        is_delete: listItem[i].is_delete

                    })
                    await new_Receiver_email.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.promotion_product = async(req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listPromotionProduct?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_Promotion_product = new Promotion_product({
                        id: listItem[i].id,
                        promotion_id: listItem[i].promotion_id,
                        product_id: listItem[i].product_id,
                        buy_product_type: listItem[i].buy_product_type,
                        quantity: listItem[i].quantity,
                        price_endow: listItem[i].price_endow,
                        price_endow_max: listItem[i].price_endow_max,
                        percent_endow: listItem[i].percent_endow,
                        bonus_product_type: listItem[i].bonus_product_type,
                        bonus_product_list: listItem[i].bonus_product_list,
                        bonus_product_quantity: listItem[i].bonus_product_quantity,
                        bonus_product_max: listItem[i].bonus_product_max,
                        min_money: listItem[i].min_money,
                        is_delete: listItem[i].is_delete

                    })
                    await new_Promotion_product.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}