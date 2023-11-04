const functions = require("../../services/functions");
const Users = require("../../models/Users");
const CalendarWorkEmployee = require("../../models/qlc/CalendarWorkEmployee");
const Shift = require("../../models/qlc/Shifts");
const Tracking = require("../../models/qlc/TrackingQR")
    //lấy danh sách vị trí công ty chấm công bằng QR

const CompanyCoordinate = require("../../models/qlc/CompanyCoordinate");

//tạo Api
exports.CreateQR = async(req, res) => {
    const { companyID, QRlogo, latitude, longtitude, Location, CreateAt, radius, isDefaul, status, QRstatus } = req.body;


    if ((companyID && QRlogo && latitude && longtitude && Location && radius && isDefaul && status) == undefined) {
        functions.setError(res, "some field required");
    } else if (isNaN(companyID)) {
        functions.setError(res, "Company id must be a number");
    } else {
        let maxId = await functions.getMaxID(Tracking);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const tracking = new Tracking({
            _id: _id,
            companyID: companyID,
            QRstatus: QRstatus,
            status: status,
            QRlogo: QRlogo,
            CreateAt: new Date(),
            isDefaul: isDefaul,
            latitude: latitude,
            longtitude: longtitude,
            Location: Location,
            radius: radius,



        });
        await tracking.save()
            .then(() => {
                functions.success(res, "Tracking statusful", tracking)
            })
            .catch(err => {
                functions.setError(res, err.message)
            })
    }
};

exports.update_enable_qr = async() => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const enable_scan_qr = req.body.enable_scan_qr;
            if (enable_scan_qr) {
                await Users.updateOne({ _id: user._id }, {
                    $set: {
                        "inForCompany.cds.enable_scan_qr": enable_scan_qr
                    }
                });
                return functions.success(res, "Cập nhật thành công")
            }
            return functions.setError(res, "Chưa truyền enable_scan_qr");
        }
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.getlist = async(req, res) => {
    try {
        const companyID = req.body.companyID;
        if (!companyID) {
            functions.setError(res, "company Id required")
        } else if (isNaN(companyID)) {
            functions.setError(res, "company Id must be a number")
        } else {
            const data = await Tracking.find({ companyID: companyID }).select("Location latitude longtitude QRlogo");
            if (data) {
                return await functions.success(res, 'Lấy lich thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }

    } catch (err) {
        functions.setError(res, err.message);
    };

}

exports.get_config_timekeeping_qr = async(req, res) => {
    try {
        const user = req.user.data;
        const com_id = user.com_id;
        const getDataUser = await Users.findOne({
                idQLC: com_id,
                type: 1
            })
            .select("inForCompany.cds.enable_scan_qr")
            .lean();
        const list_cor = await CompanyCoordinate.find({ com_id: com_id, qr_status: 1 }).lean();
        const list_shift = await Shift.find({ com_id }).lean();
        const config_timekeeping = {
            enable_scan_qr: getDataUser.inForCompany.cds.enable_scan_qr,
            list_cor: list_cor,
            list_shift: list_shift
        };
        return functions.success(res, "Danh sách qr chấm công", { config_timekeeping });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.delete = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const com_id = user.com_id;
            const cor_id = req.body.cor_id;
            if (cor_id) {
                const coordinate = await CompanyCoordinate.findOne({ cor_id, qr_status: 1 });
                if (coordinate) {
                    await CompanyCoordinate.updateOne({ cor_id }, {
                        $set: { qr_status: 0 }
                    });
                    return functions.success(res, 'Cập nhật thành công');
                }
                return functions.setError(res, "Tọa độ chấm công không tồn tại");
            }
            return functions.setError(res, "Chưa truyền tham số cor_id");
        }
        return functions.setError(res, "Tài khoản không phải công ty");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}