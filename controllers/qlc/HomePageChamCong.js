const functions = require("../../services/functions");
const users = require("../../models/Users")
const calEmp = require("../../models/qlc/CalendarWorkEmployee")
const Tracking = require("../../models/qlc/TimeSheets");

//lấy danh sách user chưa đăng kí lịch làm việc
exports.getlistUserNoneSetCarlendar = async(req, res) => {
    try {
        let pageNumber1 = req.body.pageNumber1 || 1;
        let pageNumber2 = req.body.pageNumber2 || 1;
        let companyID = req.body.companyID;
        let data = [];
        let data2 = [];
        let results = [];
        let data3 = []
        shiftID = req.body.shiftID
        CreateAt = req.body.CreateAt || true
        inputNew = req.body.inputNew || null
        inputOld = req.body.inputOld || null
        if ((companyID) == undefined) {
            return functions.setError(res, "id must be a Number")
        } else if (isNaN(companyID)) {
            return functions.setError(res, "id must be a Number")
        } else {
            //ta tìm danh sách nhân viên của công ty
            data = await users.find({ "inForPerson.companyID": companyID, type: 2 }).select('_id idQLC depID companyID email phoneTK avatarUser')
                //ta tìm danh sách nhân viên đã có lịch làm việc của công ty
            data2 = await calEmp.find({ companyID: companyID }).select('idQLC companyID')
                //ta so sánh 2 mảng 
                // Lọc ra các phần tử không giống nhau trong cả hai mảng

            function compareObjects(obj1, obj2) {
                return JSON.stringify(obj1.idQLC) === JSON.stringify(obj2.idQLC);
            }

            function removeSimilarElements(data, data2) {
                const newArray = data.filter(
                    (item1) => !data2.some((item2) => compareObjects(item1, item2))
                );

                return newArray.concat(
                    data2.filter(
                        (item2) => !data.some((item1) => compareObjects(item1, item2))
                    )
                );
            }
            const ketQua = removeSimilarElements(data, data2);

            const pageSize = 20;
            const startIndex = (pageNumber1 - 1) * pageSize;
            const endIndex = pageNumber1 * pageSize;
            results = ketQua.slice(startIndex, endIndex);

            if (!ketQua) {
                return functions.setError(res, 'Không có dữ liệu danh sách NV chưa đăng kí lịch làm việc ', 404);
            }
            //lấy thành công danh sách NV đã chấm công gần nhất
            data3 = await Tracking.find({ companyID: companyID }).select('_id idQLC imageTrack Location CreateAt shiftID status Success ').skip((pageNumber2 - 1) * 20).limit(20).sort({ _id: -1 });
            if (!data3) {
                return functions.setError(res, 'Không có dữ liệu danh sách NV đã chấm công gần nhất ', 404);
            }
        }

        return functions.success(res, 'Lấy thành công danh sách NV chưa đăng kí lịch làm việc và danh sách NV đã chấm công gần nhất', { results, pageNumber1, data3, pageNumber2 });

    } catch (err) {
        return functions.setError(res, err.message);
    };
}