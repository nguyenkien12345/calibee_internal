const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');

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
            type: DataTypes.TEXT,
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
        language_on_devices: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_test: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        customer_id_crm: {
            type: DataTypes.STRING(100),
        },
        is_zoho_test: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        default_payment_method: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        show_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        total_stars: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        total_feedbacks: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
		ref_code: {
            type: DataTypes.STRING(100),
			allowNull: false,
			unique: false,
        },
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

Customer.beforeCreate(async (customer) => {
    if (customer.password) {
        customer.password = await bcrypt.hash(customer.password, 10);
    }
});

Customer.afterCreate(async (customer) => {
    delete customer.dataValues.password;
});

Customer.prototype.verifyPassword = async function (password) {
    return bcrypt.compareSync(password, this.password, (err) => {
        if (err) {
            console.log('verifyPassword -> error:', err);
        }
    });
};

module.exports = Customer;
