const mongoose = require('mongoose');

const VideoCompanySchema = new mongoose.Schema(
	{
		company: {
			type: {
				usc_id: {
					type: Number,
					require: true,
				},
				userName: {
					type: String,
					default: '',
				},
				phone: {
					type: String,
					default: '',
				},
				phoneTK: {
					type: String,
					default: '',
				},
				email: {
					type: String,
					default: '',
				},
				createdAt: {
					type: Number,
					required: true,
				},
			},
		},
		video_active: {
			type: Number,
			default: 0,
		},
		name_video: {
			type: String,
			required: true,
		},
		video_created_at: {
			type: Number,
			required: true,
		},
		video_type: {
			type: Number,
			required: true,
		},
		link_video: {
			type: String,
			default: '',
		},
	},
	{
		collection: 'VideoCompany',
		versionKey: false,
		timestamp: true,
	}
);

module.exports = mongoose.model('VideoCompany', VideoCompanySchema);
