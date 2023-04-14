const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BookingDetail = sequelize.define(
    'booking_detail',
    {
        id: {
			primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
        },
		booking_detail_id: {
			primaryKey: true,
            type: DataTypes.STRING(50),
			allowNull: false,
        },
        booking_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        worker_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        working_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        rest_work: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        payment_status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        time_key: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        add_time: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
        time_key_detail: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        current_job: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        total_job: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        app_ids: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        payment_status_details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        booking_id_crm: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        shift_detail_fee: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        report_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sub_status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        user_at: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        payment_bills: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
		worker_earnings: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
		booking_detail_current: {
			type: DataTypes.BOOLEAN,
            defaultValue: true,
		}
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

module.exports = BookingDetail;
