const moment = require('moment');

const diffInMinutes = (dt1, dt2) => {
    const DAY = 86400000;
    const HOUR = 3600000;
    const MINUTE = 60000;

    let diffMs = dt2 - dt1; // milliseconds
    let diffMins = Math.round(((diffMs % DAY) % HOUR) / MINUTE); // minutes
    return diffMins;
};

// Calculating difference between two dates (hours, minutes, seconds, days, months, years)
const diffTime = (dateInPast) => {
    let date1 = moment(dateInPast); // Time in past
    let date2 = moment(new Date()).add(7, 'hours'); // Current time
    return {
        years: date2.diff(date1, 'years'),
        months: date2.diff(date1, 'months'),
        days: date2.diff(date1, 'days'),
        hours: date2.diff(date1, 'hours'),
        minutes: date2.diff(date1, 'minutes'),
        seconds: date2.diff(date1, 'seconds'),
    };
};

const notificationDatetime = (datetime) => {
    let alert = '';
    let dataDatetime = diffTime(datetime);
    if (dataDatetime.months > 0 && dataDatetime.months <= 12) {
        alert = `${dataDatetime.months} tháng trước`;
    } else if (dataDatetime.days > 0 && dataDatetime.days <= 31) {
        alert = `${dataDatetime.days} ngày trước`;
    } else if (dataDatetime.hours > 0 && dataDatetime.hours <= 24) {
        alert = `${dataDatetime.hours} giờ trước`;
    } else if (dataDatetime.minutes > 0 && dataDatetime.minutes <= 60) {
        alert = `${dataDatetime.minutes} phút trước`;
    } else if (dataDatetime.minutes === 0) {
        alert = '1 phút trước';
    }
    return alert;
};

module.exports = { diffInMinutes, diffTime, notificationDatetime };
