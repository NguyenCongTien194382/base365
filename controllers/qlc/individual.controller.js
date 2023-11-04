const Individual = require("../../models/Users");
const functions = require("../../services/functions");
const md5 = require('md5');

//tao moi 1 ca nhan
exports.createIndividual = async(req, res) => {

    const type = 0;
    const phoneTK = req.body.phoneTK;
    const userName = req.body.userName;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;

    if (!phoneTK) {
        //Kiểm tra id company khác null
        functions.setError(res, "companyID required", 405);
    } else if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 406);
    } else if (!password) {
        //Kiểm tra password khác null
        functions.setError(res, "password required", 407);

    } else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 408);
    } else if (!await functions.checkPhoneNumber(phoneTK)) {

        functions.setError(res, "phonenumber is not valid", 409);
    } else {
        let checkUser = await functions.getDatafindOne(Individual, { phoneTK: phoneTK, type: type });
        if (checkUser) {
            return functions.setError(res, "registered phonenumber", 200);
        }
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxIDQLC(Individual);
        if (!maxID) {
            maxID = 0
        };
        let idQLC = Number(maxID) + 1;
        const maxIDUser = await Individual.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDUser;
        if (maxIDUser) {
            newIDUser = Number(maxIDUser._id) + 1;
        } else newIDUser = 1;
        const individual = new Individual({
            _id: newIDUser,
            idQLC: idQLC,
            userName: userName,
            phoneTK: phoneTK,
            password: md5(password),
            phone: phone ? phone : null,
            address: address,
            type: type,
            createdAt: new Date(Date.now())
        });

        await individual.save()
            .then(() => {
                functions.success(res, "individual created successfully", individual)
            })
            .catch((err) => {
                functions.setError(res, err.message, 500);
            })
    }
};

//chinh sua thong tin ca nhan
exports.editIndividual = async(req, res) => {
    const idQLC = req.body.idQLC;
    const type = 0;
    const userName = req.body.userName;
    const emailContact = req.body.emailContact;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;
    const startWorkingTime = req.body.startWorkingTime;
    let fields = [
        idQLC,
        userName,
        emailContact,
        phone,
        address,
        gender,
        birthday,
        candiHocVan,
        married,
        exp,
        startWorkingTime
    ];
    for (let i = 0; i < fields.length; i++) {
        if (!fields[i])
            return functions.setError(res, `Missing input`, 400);
    }
    const individual = await functions.getDatafindOne(Individual, { idQLC: idQLC, type: type });
    if (!individual) {
        functions.setError(res, "individual does not exist!", 500);
    } else {
        await functions.getDatafindOneAndUpdate(Individual, { idQLC: idQLC, type: type }, {
                userName: userName,
                emailContact: emailContact,
                phone: phone,
                address: address,
                updatedAt: new Date(Date.now()),
                inForPerson: {
                    gender: gender,
                    birthday: birthday,
                    candiHocVan: candiHocVan,
                    married: married,
                    exp: exp,
                    startWorkingTime: startWorkingTime
                }
            })
            .then((manager) => functions.success(res, "Individual edited successfully", manager))
            .catch((err) => functions.setError(res, err.message, 500));
    }
};

exports.deleteIndividual = async(req, res, next) => {
    try {
        let idQLC = req.query.idQLC;
        let type = 0;
        if (idQLC) {
            let individual = await functions.getDataDeleteOne(Individual, { idQLC: idQLC, type: type });
            if (individual.deletedCount === 1) {
                return functions.success(res, "Delete individual by idQLC success");
            } else {
                return functions.success(res, "Individual not found");
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//tim kiem danh sach ca nhan theo cac dieu kien---------------------------------------------------------------------------

exports.getListIndividualByFields = async(req, res, next) => {
    try {
        if (req.body) {
            let type = 0;
            if (!req.body.page) {
                return functions.setError(res, "Missing input page", 401);
            }
            if (!req.body.pageSize) {
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let idQLC = req.body.idQLC;
            let exp = req.body.exp;
            let candiHocVan = req.body.candiHocVan;
            let phoneTK = req.body.phoneTK;
            let phone = req.body.phone;
            let userName = req.body.userName;
            let address = req.body.address;
            let listIndividual = [];
            let listCondition = { type: type };

            // dua dieu kien vao ob listCondition
            if (idQLC) listCondition.idQLC = idQLC;
            if (phone) listCondition.phone = new RegExp(phone);
            if (phoneTK) listCondition.phoneTK = new RegExp(phoneTK);
            if (userName) listCondition.userName = new RegExp(userName);
            if (address) listCondition.address = new RegExp(address);
            if (exp) listCondition[`inForPerson.exp`] = Number(exp);
            if (candiHocVan) listCondition[`inForPerson.candiHocVan`] = Number(candiHocVan);

            let fieldsGet = {
                phoneTK: 1,
                userName: 1,
                phone: 1,
                emailContact: 1,
                address: 1,
                inForPerson: { gender: 1, birthday: 1, candiHocVan: 1, married: 1, positionID: 1, depID: 1, groupID: 1 }
            }
            listIndividual = await functions.pageFindWithFields(Individual, listCondition, fieldsGet, { _id: 1 }, skip, limit);
            return functions.success(res, "get individual success", { data: listIndividual });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}