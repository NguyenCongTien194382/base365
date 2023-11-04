const functions = require('../../../services/functions');
const DataCvUngVien = require('../../../models/Timviec365/CvNew/DataCvUngVien.js');
const DataSampleCv = require('../../../models/Timviec365/CvNew/DataSampleCv.js');


exports.InsertDataCvUngVien = async(req, res) => {
    try {
        if (req.body.idUV && req.body.idCV) {
            let maxId = 0;
            let obj = await DataCvUngVien.find({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (obj && obj.length) {
                maxId = obj[0].id;
            };
            maxId = maxId + 1;
            let newobj = new DataCvUngVien({
                id: maxId,
                idCV: Number(req.body.idCV),
                idUV: Number(req.body.idUV),
                data: JSON.parse(req.body.data)
            })
            let newobjsaved = await newobj.save();
            return functions.success(res, "", { newobjsaved });
        } else {
            return functions.setError(res, "Truyển thông tin không đầy đủ");
        }
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.InsertDataSampleCv = async(req, res) => {
    try {
        if (req.body.idUV && req.body.idCV) {
            let maxId = 0;
            let obj = await DataSampleCv.find({}, { idCV: 1 }).sort({ idCV: -1 }).limit(1).lean();
            if (obj && obj.length) {
                maxId = obj[0].idCV;
            };
            maxId = maxId + 1;
            let newobj = new DataCvUngVien({
                idCV: maxId,
                data: JSON.parse(req.body.data)
            })
            let newobjsaved = await newobj.save();
            return functions.success(res, "", { newobjsaved });
        } else {
            return functions.setError(res, "Truyển thông tin không đầy đủ");
        }
    } catch (error) {
        return functions.setError(res, error);
    }
}