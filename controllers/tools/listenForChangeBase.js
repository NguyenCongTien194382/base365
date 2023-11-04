const Users = require('../../models/Users')

async function updateMany() {
    try {
        // Sử dụng phương thức `updateMany` để cập nhật các bản ghi có idTimViec365 là 1111111526 và 1111111527
        const result = await Users.updateMany({ idTimViec365: { $in: ['1111111526', '1111111527'] } }, // Điều kiện cập nhật
            { $set: { status: 'updated' } } // Dữ liệu cập nhật
        );

        // In kết quả sau khi cập nhật (nếu cần)
        console.log(`${result.nModified} bản ghi đã được cập nhật`);
    } catch (error) {
        console.error('Lỗi khi cập nhật nhiều bản ghi:', error);
    }
}

// Gọi hàm updateMany để cập nhật các bản ghi
updateMany();