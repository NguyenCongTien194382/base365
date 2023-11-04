const functions = require("../../services/functions")
    // const appDelete = require("../../models/qlc/DelAppData")
const Tracking = require("../../models/qlc/TimeSheets")



exports.deleteAllTRacking = async(req, res) => {
    try {
        const request = req.body;
        let com_id = request.com_id,
            CreateAt = request.CreateAt || true
        TimeInputNewest = request.TimeInputNewest || null
        TimeInputOldest = request.TimeInputOldest || null
        Note = request.Note || null
        if (!com_id) {
            functions.setError(res, "Company id required");
        } else if (typeof com_id == "number") {
            functions.setError(res, "Company id must be a number");
        } else {
            const HisOfTracking = await functions.getDatafind(Tracking, { com_id: com_id, CreateAt: { $gte: TimeInputOldest, $lte: TimeInputNewest } });
            if (!HisOfTracking) {
                await functions.setError(res, "No HisOfTracking found in this company");
            } else {
                await Tracking.deleteMany({ com_id: com_id })
                    .then(() => functions.success(res, "HisOfTracking deleted successfully", HisOfTracking))
                    .catch((err) => functions.setError(res, err.message))
            }
        }
    } catch (error) {
        return functions.setError(res, err.message)

    }

}