const feedback = require("../../models/qlc/Feedback");
const functions = require('../../services/functions');

exports.create = async(req, res) => {
    try {
        let id_user = req.user.data._id;
        let { rating, feed_back, app_name, from_source } = req.body;

        if (rating && feed_back) {
            const max = await feedback.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            let new_id = 1;
            if (max) {
                new_id = Number(max.id) + 1;
            }
            let feedbacks = new feedback({
                id_user: id_user,
                feed_back: feed_back,
                rating: rating,
                create_date: functions.getTimeNow(),
                app_name: app_name,
                from_source: from_source,
            })

            await feedbacks.save();
            return functions.success(res, 'Thành công');
        }
        return functions.setError(res, "thiếu thông tin truyền lên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }

}