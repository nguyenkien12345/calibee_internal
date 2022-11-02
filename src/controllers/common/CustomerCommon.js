const Customers = require('../../models/customer/Customer');

const CustomerCommon = {
    // Get Customer by id
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

    // Get Customer by phone
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

    // Get all customers
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
