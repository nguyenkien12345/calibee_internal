const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Bookings = require('../../models/booking/Booking');

const ServiceCategory = sequelize.define('service_category', {
    service_category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    name_en: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    price_default: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    icon: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    group: {
        type: DataTypes.INTEGER.UNSIGNED, // 1: book one; 2: package; 3: get quotation
        allowNull: false,
    },
    language_key: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    app_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    priority_sort: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

// Service Category (1 -> n) Booking
ServiceCategory.hasMany(Bookings, {
    as: 'bookings',
    foreignKey: 'service_category_id',
});

Bookings.belongsTo(ServiceCategory, {
    as: 'booking_service_category',
    foreignKey: 'service_category_id',
});

module.exports = ServiceCategory;
