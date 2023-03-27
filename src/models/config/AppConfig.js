const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AppConfig = sequelize.define(
    'app_config',
    {
        app_config_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

module.exports = AppConfig;
