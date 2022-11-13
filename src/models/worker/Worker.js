const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');

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
        app_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        language_on_devices: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        is_test: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        worker_id_crm: {
            type: DataTypes.STRING(100),
        },
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

Workers.beforeCreate(async (workers) => {
    workers.password = await bcrypt.hash(workers.password, 10);
});

Workers.afterCreate(async (workers) => {
    delete workers.dataValues.password;
});

Workers.prototype.verifyPassword = async function (password) {
    return bcrypt.compareSync(password, this.password, (err) => {
        if (err) {
            console.log('verifyPassword -> error:', err);
        }
    });
};

module.exports = Workers;
