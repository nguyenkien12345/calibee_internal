const moment = require('moment');

// Convert Time To Format Vietnam
const convertTime = (datetime) => {
    let formatTime = 'YYYY-MM-DD HH:mm:ss';
    return moment(datetime).format(formatTime);
};

// Convert Money To Format Vietnam
const convertMoney = (money) => {
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
};

module.exports = { convertTime, convertMoney };
