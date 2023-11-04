const functions = require('../../../services/functions');
const DataCvUngVien = require('../../../models/Timviec365/CvNew/DataCvUngVien.js');
const DataSampleCv = require('../../../models/Timviec365/CvNew/DataSampleCv.js');


exports.TakeDataCvUngVien = async(req, res) => {
    try {
        if (req.body.idUV) {
            let listCvUv = await DataCvUngVien.find({ idUV: Number(req.body.idUV) }).lean()
            let tempt = [];
            for (let i = 0; i < listCvUv.length; i++) {
                let obj = listCvUv[i];
                tempt.push({...obj, data: JSON.parse(JSON.stringify(obj.data)) });
            };
            listCvUv = tempt;
            return functions.success(res, "", { listCvUv });
        } else {
            return functions.setError(res, "Truyển thông tin không đầy đủ");
        }
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.TakeDataSampleCv = async(req, res) => {
    try {
        if (req.body.idCV) {
            let CvInfor = await DataSampleCv.findOne({ idCV: Number(req.body.idCV) }).lean();
            return functions.success(res, "", { CvInfor });
        } else {
            return functions.setError(res, "Truyển thông tin không đầy đủ");
        }
    } catch (error) {
        return functions.setError(res, error);
    }
}