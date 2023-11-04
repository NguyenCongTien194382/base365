const mongoose = require('mongoose');

const VideoNewSchema = new mongoose.Schema(
	{
		new: {
			type: {
				new_id: {
					type: Number,
					require: true,
				},
				new_user_id: {
					type: Number,
					require: true,
				},
				new_title: {
					type: String,
					default: '',
				},
				new_alias: {
					type: String,
					default: '',
				},
				new_video_type: {
					type: String,
					default: '',
				},
				usc_created_at: {
					type: Number,
					default: '',
				},
				new_create_time: {
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
		video_updated_at: {
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

module.exports = mongoose.model('VideoNew', VideoNewSchema);
