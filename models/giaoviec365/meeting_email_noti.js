const mongoose = require('mongoose');
const GV365MeetingEmailNoti = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	staff_id: { type: Number, default: null },
	com_id: { type: Number, required: true },
	email_noti_id: { type: String, required: true }, //1 nhận email khi có cuộc họp mới cần tham gia
	//2 nhận email khi có cuộc họp được chỉnh sửa
	//3 nhận email khi cập nhập kết quả và biên bản họp
	//4 nhận emil khi xóa cuộc họp
});

module.exports = mongoose.model('GV365MeetingEmailNoti', GV365MeetingEmailNoti);
