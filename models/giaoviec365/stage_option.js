const mongoose = require('mongoose');
const GV365StageOption = new mongoose.Schema({
	id: { type: Number, required: true },
	process_id: { type: Number, default: null },
	stage_id: { type: Number, default: null },
	pull_back: { type: Number, default: null },
	stage_can_pull: { type: String, default: null },
	time_limit: { type: String, default: null },
	request: { type: Number, default: null },
	is_see_or_add_mission: { type: Number, default: null },
	com_id: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StageOption', GV365StageOption);
