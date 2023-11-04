const mongoose = require('mongoose');
const GV365StageLocations = new mongoose.Schema({
	id: { type: Number, required: true },
	stage_id: { type: Number, default: null },
	locations: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StageLocations', GV365StageLocations);
