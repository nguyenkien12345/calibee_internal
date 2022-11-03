const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Customer = sequelize.define(
    'customer',
    {
        customer_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        province: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        province_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fcm_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        suggest_locations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        uid: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        provider: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isExternal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        app_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

module.exports = Customer;
