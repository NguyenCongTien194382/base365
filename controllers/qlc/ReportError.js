const report = require('../../models/qlc/ReportError')
const functions = require('../../services/functions')
const fnc = require('../../services/qlc/functions')



exports.create = async(req, res) => {
    try {
        const user = req.user.data,
            user_id = user._id,
            idQLC = user.idQLC;
        let { device_id, detail_error, gallery_image_error, from_source } = req.body;
        let File = req.files || null;
        gallery_image_error = null;
        let now = new Date()
        if (detail_error) {
            if (File && File.gallery_image_error) {
                upload = await fnc.uploadErrQLC(user.type, idQLC, File.gallery_image_error, ['.jpeg', '.jpg', '.png']);
                if (!upload) {
                    return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                }
                gallery_image_error = upload
            }


            let max = await report.findOne({}, {}, { sort: { id_report: -1 } }).lean() || 0
            let reports = new report({
                id_report: Number(max.id_report) + 1 || 1,
                user_id: user_id,
                device_id: device_id,
                detail_error: detail_error,
                gallery_image_error: gallery_image_error,
                time_create: Date.parse(now),
                from_source: from_source
            })
            await reports.save()
            return functions.success(res, "Đánh giá của bạn đã được gửi đi");
        }
        return functions.setError(res, "Bạn chưa truyền nội dung báo cáo")
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
    return functions.setError(res, "chua nhap chi tiet")
}