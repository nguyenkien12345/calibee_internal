const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Otp = sequelize.define('otp', {
    otp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    max_verify_count: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false,
    },
    verify_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Otp;
