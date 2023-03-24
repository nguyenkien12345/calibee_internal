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
        worker_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        in_lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        in_long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        out_lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        out_long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        in_distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        out_distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        in_distance_coordinates: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        out_distance_coordinates: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        history_check_in: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        history_check_out: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        app_ids: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        job_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        in_images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        out_images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content_in_images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content_out_images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        compensate_info: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

module.exports = Attendance;
