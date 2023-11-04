const mongoose = require('mongoose');
const GV365MeetingPeriodics = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	name_meeting: { type: String, default: null },
	frequency: { type: Number, default: null },
	day: { type: String, default: null },
	type_meeting: { type: Number, default: null },
	conent: { type: String },
	time_in: { type: Number, default: null },
	time_in: { type: String, default: null },
	date_start: { type: String, default: null },
	date_end: { type: String, default: null },
	department_id: { type: Number, default: null },
	staff_owner: { type: String, default: null },
	staff_ecretary: { type: String, default: null },
	staff_preparation: { type: String, default: null },
	address_links: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

module.exports = mongoose.model('GV365MeetingPeriodics', GV365MeetingPeriodics);
