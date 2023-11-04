

function stringToNumberArray(inputString) {
    if (typeof inputString !== 'string') {
        return []; // Trả về mảng trống nếu không phải chuỗi
    }
    // Tách chuỗi dựa trên dấu phẩy và chuyển đổi thành mảng số
    const numberArray = inputString.split(',').map(Number);
    return numberArray;
}

module.exports = { stringToNumberArray }