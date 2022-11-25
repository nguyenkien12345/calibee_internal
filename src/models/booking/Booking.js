const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const BookingDetail = require('../../models/booking/BookingDetail');

const Booking = sequelize.define(
    'booking',
    {
        booking_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        service_category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        province_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        bulding_floor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        gate: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        note: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        parent_type_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        have_pets: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ironing_clothes: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ironing_clothes_fee: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        favorite_worker: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        premium: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        days: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        start_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        package: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        promotion_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        payment_method_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        tip: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        working_time: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: true,
        },
        total_time: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: true,
        },
        worker_earnings: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        service_fee: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        total: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        priority: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        priority_worker: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        end_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        time_key: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        package_detail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_test: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        app_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        booking_id_crm: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        momo_order_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        show_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        amount_worker: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1,
        },
        district: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

// Booking (1 -> 1) Booking Detail
Booking.hasOne(BookingDetail, {
    as: 'booking_detail',
    foreignKey: 'booking_id',
});

BookingDetail.belongsTo(Booking, {
    as: 'booking',
    foreignKey: 'booking_id',
});

module.exports = Booking;
