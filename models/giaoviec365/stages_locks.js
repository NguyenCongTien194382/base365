const mongoose = require('mongoose');
const GV365StageLocks = new mongoose.Schema({
	id: { type: Number, required: true },
	process_id: { type: Number, default: null },
	stage_id_start: { type: Number, default: null },
	stage_id_end: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StageLocks', GV365StageLocks);
