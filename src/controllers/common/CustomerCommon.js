const Customers = require('../../models/customer/Customer');
const { error_missing_params, error_db_querry } = require('../../config/response/ResponseError');

const CustomerCommon = {
    onGetCustomerByID: async (customer_id, res, next) => {
        try {
            let customer = await Customers.findOne({
                where: {
                    customer_id: customer_id,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (customer) {
                return customer;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetCustomerByID_CRM: async (customer_id_crm, res, next) => {
        try {
            let customer = await Customers.findOne({
                where: {
                    app_id: customer_id_crm,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (customer) {
                return customer;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetCustomerByCustomer_ID_CRM: async (customer_id_crm, res, next) => {
        try {
            let customer = await Customers.findOne({
                where: {
                    customer_id_crm: customer_id_crm,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (customer) {
                return customer;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetCustomerByPhone: async (phone, res, next) => {
        try {
            let customer = await Customers.findOne({
                where: {
                    phone: phone,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (customer) {
                return customer;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetCustomerByEmail: async (email, res, next) => {
        try {
            let customer = await Customers.findOne({
                where: {
                    email: email,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (customer) {
                return customer;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetCustomers: async () => {
        try {
            const customers = await Customers.findAll({
                attributes: { exclude: ['password'] },
            }).catch((err) => res.json(error_db_querry(err)));

            return customers;
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerCommon;
