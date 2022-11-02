const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Workers = sequelize.define(
    'worker',
    {
        worker_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(100),
            allowNul: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        nid: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        sex: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        skills: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        working_area: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        working_place: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_verify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fcm_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        time_key: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        referral_code: {
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

module.exports = Workers;
