const Cus_Chance = require('../../../models/crm/Customer/customer_chance');
const Share_Cus = require("../../../models/crm/tbl_share_customer");
const Share_Chance = require("../../../models/crm/tbl_shareChance");
const functions = require("../../../services/functions");

exports.listChance = async (req, res) => {
    try{
    let skip = req.body.skip ? req.body.skip : 1;
    let limit = req.body.limit ? req.body.limit : 10;
    let chances = await Cus_Chance.find().skip((skip - 1) * 10).limit(limit);
    return functions.success(res, 'Lấy dữ liệu thành công', { chances });
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
      }
   
}
exports.create_Chance = async (req, res) => {
    try{
    
        let { 
            id_customer, contact_id, chance_name, chance_type, commodities, money, stages, success_rate,
            expected_sales, expected_end_date, campaign_id, source, discount_total_rate, discount_total_money,
            total, description, country_chance, city_chance, district_chance, ward_chance, street_chance,
            area_code_chance, address_chance, share_all, emp_id
        } = req.body;
        let com_id = '';
        if(req.user.data.type ==1 ) {
        com_id = req.user.data.idQLC
        let maxID = await Cus_Chance.findOne({}, {}, { sort: { id: -11 } }).lean() || 0;
        let new_chance = new Cus_Chance({
            id: maxID.id + 1,
            name: chance_name,
            com_id: com_id,
            cus_id: id_customer,
            contact_id: contact_id,
            type: chance_type,
            group_commodities: commodities,
            money: money,
            stages: stages,
            success_rate: success_rate,
            expected_sales: expected_sales,
            expected_end_date: newDate(expected_end_date),
            campaign_id: campaign_id,
            soure: source,
            emp_id: emp_id,
            discount_total_rate: discount_total_rate.replace(",", ""),
            discount_total_money: discount_total_money.replace(",", ""),
            total_money: total,
            description: description,
            country_change: country_chance,
            city_chance: city_chance,
            district_chace: district_chance,
            ward_chance: ward_chance,
            street_chance: street_chance,
            area_code_chance: area_code_chance,
            address_chance: address_chance,
            share_all: share_all,
            user_id_create: emp_id,
            created_at: new Date(),
            update_at: new Date()
        });
        await new_chance.save();
        return functions.success(res, 'Lấy dữ liệu thành công', { new_chance });
        }
        if(req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id
            let maxID = await Cus_Chance.findOne({}, {}, { sort: { id: -11 } }).lean() || 0;
        let new_chance = new Cus_Chance({
            id: maxID.id + 1,
            name: chance_name,
            com_id: com_id,
            cus_id: id_customer,
            contact_id: contact_id,
            type: chance_type,
            group_commodities: commodities,
            money: money,
            stages: stages,
            success_rate: success_rate,
            expected_sales: expected_sales,
            expected_end_date: newDate(expected_end_date),
            campaign_id: campaign_id,
            soure: source,
            emp_id: emp_id,
            discount_total_rate: discount_total_rate.replace(",", ""),
            discount_total_money: discount_total_money.replace(",", ""),
            total_money: total,
            description: description,
            country_change: country_chance,
            city_chance: city_chance,
            district_chace: district_chance,
            ward_chance: ward_chance,
            street_chance: street_chance,
            area_code_chance: area_code_chance,
            address_chance: address_chance,
            share_all: share_all,
            user_id_create: emp_id,
            created_at: new Date(),
            update_at: new Date()
        });
        await new_chance.save();
        return functions.success(res, 'Lấy dữ liệu thành công', { new_chance });
        }
        else{
            return functions.setError(res, 'bạn không có quyền', 400)
        }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
      }
    
}
exports.update_chance = async (req, res) => {
    try{
        let { chance_id, id_customer, contact_id, name, chance_type, commodities, money, stages, success_rate,
            expected_sale, expected_end_date, campaign_id, source, discount_total_rate, discount_total_money,
            total, description, country_chance, city_chance, district_chance, ward_chance, street_chance,
            area_code_chance, address_chance, share_all, emp_id, } = req.body;
        let Contact_id;
        if (chance_id > 0 && id_customer > 0 && name != "" && expected_end_date != "") {
            let check_chance = await Cus_Chance.findOne({ id: chance_id, cus_id: id_customer, delete_chance: 0 });
            if (check_chance.contact_id != null && check_chance.contact_id != 0) {
                let arr_contact = check_chance.contact_id.split(",");//contact cũ
                //contact_id la 1 chuoi nhieu gtri
                let arr_contact_id = contact_id.split(",");
                for (let i = 0; i < arr_contact_id.length; i++) {
                    let index = arr_contact.indexOf(arr_contact_id[i]);
                    if (index != -1) {
                        arr_contact.splice(index, 1);
                    }
                }
                arr_contact.unshift(arr_contact_id);
                Contact_id = arr_contact.join(',');
            } else {
                Contact_id = contact_id;
            }
            let Chance_update = await Cus_Chance.findOneAndUpdate({ id: chance_id, cus_id: id_customer }, {
                name: name,
                contact_id: Contact_id,
                type: chance_type,
                group_commodities: commodities,
                money: money,
                stages: stages,
                success_rate: success_rate,
                expected_sales: expected_sale,
                expected_end_date: expected_end_date,
                campaign_id: campaign_id,
                source: source,
                emp_id: emp_id,
                discount_total_rate: discount_total_rate,
                discount_total_money: discount_total_money.replace(",", ""),
                total_money: total.replace(',', ''),
                description: description,
                country_chance: country_chance,
                city_chance: city_chance,
                district_chance: district_chance,
                ward_chance: ward_chance,
                street_chance: street_chance,
                area_code_chance: area_code_chance,
                address_chance: address_chance,
                share_all: share_all,
                user_id_edit: emp_id,
                update_at: new Date()
    
            })
            await Chance_update.save();
            return functions.success(res, 'sửa thành công', { Chance_update });
    
        } else {
            return functions.setError(res,'dieu kien  sai',400)
        }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
      }
}

exports.deleteChange = async (req, res) => {
    try{
    let { chance_id, cus_id } = req.body;
    if (chance_id > 0 && cus_id > 0) {
        let del_chance = await Cus_Chance.findOneAndUpdate({ id: chance_id, cus_id: cus_id }, { delete_chance: 1 });
        return functions.success(res, 'xóa thành công', { del_chance });
    } else {
        return functions.setError(res,'dieu kien  sai',400)
    }
    }catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
      }
    
}

