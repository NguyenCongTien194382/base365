const functions = require("../../services/functions")
const user = require("../../models/Users")


exports.afterLogin = async(req, res) => {
    try {
        const idQLC = req.user.data.idQLC
        let data = []
        let count = 0;
        let is_add = false;
        let vip = false;
        const timeStart = "2023-05-20 23:59:59"

        data = await user.findOne({ idQLC: idQLC, type: 1 }).select("inForCompany.cds.com_vip inForCompany.cds.com_vip_time inForCompany.cds.com_ep_vip createdAt").lean()
        if (data) {
            const createdAt = data.createdAt
            count = await user.countDocuments({ idQLC: idQLC }).lean()
            const comVip = data.inForCompany.cds.com_vip
            const timeVip = data.inForCompany.cds.com_vip_time
            const userVip = data.inForCompany.cds.com_ep_vip
            const startTime = new Date(timeStart);
            const createdTime = new Date(createdAt);
            const now = new Date()

            const timeVips = new Date(timeVip)

            if (createdTime < startTime) {
                if (comVip == 1) {
                    vip = true

                    return functions.success(res, "Cong ty tạo trước 20/05/20 va VIP", { vip })
                } else if (comVip == 0) {
                    vip = false

                    return functions.success(res, "Cong ty tạo trước 20/05/20 va thường", { vip, is_add: false })
                } else {
                    return functions.setError(res, "Công ty tạo trước 20/05/20, vip không xác định ")

                }
            } else if (createdTime > startTime) {
                if (timeVip == 0) { //vip

                    if (count >= userVip) {
                        if (comVip == 0) {
                            is_add = false
                            vip = false

                            return functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và số lượng nhân viên vượt quá gói mặc định", { is_add, vip })

                        } else {
                            is_add = false
                            vip = true

                            return functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và số lượng nhân viên vượt quá gói mặc định", { is_add, vip })

                        }
                    } else {
                        if (comVip == 0) {
                            is_add = true
                            vip = false
                            return functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và con them duoc nhan vien ", { is_add, vip })
                        } else {
                            is_add = true
                            vip = true

                            return functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và con them duoc nhan vien ", { is_add, vip })

                        }
                    }


                } else { //
                    if (now >= timeVips) { //het han vip
                        if (count >= userVip) {
                            vip = false
                            is_add = false

                            return functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va số lượng nhân viên vượt quá góp vip", { is_add, vip })

                        } else {
                            is_add = true
                            vip = false

                            return functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va con  them duoc nhân viên vip", { is_add, vip })
                        }

                    } else { // con han vip
                        if (count >= userVip) {
                            is_add = false
                            vip = true

                            return functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va số lượng nhân viên vượt quá góp vip", { is_add, vip })
                        } else {
                            is_add = true
                            vip = true

                            return functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va con  them duoc nhân viên vip", { is_add, vip })

                        }
                    }
                }
            } else {
                return functions.success(res, "Thời gian tạo lập và thời gian bắt đầu bằng nhau");
            }
        } else {
            return functions.success(res, " Công ty không tồn tại ")
        }

    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.beforeLogin = async(req, res) => {
    try {
        const com_id = req.body.com_id
        let count = 0;

        const timeStart = new Date("2023-05-20 23:59:59");

        // const data = await user.findOne({ idQLC: com_id, type: 1 }).select("inForCompany.cds.com_vip inForCompany.cds.com_vip_time inForCompany.cds.com_ep_vip createdAt").lean();
        const data = await user.aggregate([
            { $match: { idQLC: Number(com_id), type: 1 } },
            {
                $project: {
                    com_vip: "$inForCompany.cds.com_vip",
                    com_vip_time: "$inForCompany.cds.com_vip",
                    com_ep_vip: "$inForCompany.cds.com_vip",
                    com_create_time: "$createdAt",
                }
            }
        ]);
        if (data.length > 0) {
            const now = functions.getTimeNow();

            const count_emp = await user.countDocuments({
                "inForPerson.employee.com_id": Number(com_id),
                "inForPerson.employee.ep_status": "Active",
            });

            let is_add = false;
            /* Nếu công ty đó là vip và có số lượng nhân viên cho phép với gói được mua
             hoặc công ty đó có số lượng nhân viên < 5
             */
            // if ((data.com_vip_time > now && count_emp < data.com_ep_vip) || count_emp < 5) {
            //     is_add = true;
            // }
            is_add = true;
            return functions.success(res, "Kết quả", { is_add });
        }
        return functions.setError(res, " Công ty không tồn tại ");
    } catch (e) {
        return functions.setError(res, e.message)
    }
}