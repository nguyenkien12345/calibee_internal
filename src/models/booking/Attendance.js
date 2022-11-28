const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Attendance = sequelize.define(
    'attendance',
    {
        attendance_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        booking_detail_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        working_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        check_in: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        check_out: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        number_job: {
            type: DataTypes.INTEGER,
            defaultValue: -1,
            allowNull: true,
        },
        now_cron: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        add_time: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

module.exports = Attendance;
