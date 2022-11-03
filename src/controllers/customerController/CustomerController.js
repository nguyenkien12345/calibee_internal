const dotenv = require('dotenv');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const { error_missing_params, errorCallBackWithOutParams } = require('../../config/response/ResponseError');

dotenv.config();

const CustomerController = {
    getAllCustomer: async (req, res, next) => {
        try {
            let customers = await CustomerCommon.onGetCustomers();
            return res.status(200).json({
                ...successCallBack,
                data: {
                    length: customers.length,
                    customers,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    getAllCustomerCRM: async (req, res, next) => {
        try {
            let customers_crm = await CustomerCRMCommon.onGetAllCustomer(req, res, next);
            return res.status(200).json({
                ...successCallBack,
                data: {
                    length: customers_crm.data.data.length,
                    customers_crm: customers_crm.data.data,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    registerCRM: async (req, res, next) => {
        try {
            const { name, email, phone, customer_id } = req.body;

            if (!name) return res.status(400).json(error_missing_params('name'));
            if (!email) return res.status(400).json(error_missing_params('email'));
            if (!phone) return res.status(400).json(error_missing_params('phone'));
            if (!customer_id) return res.status(400).json(error_missing_params('customer_id'));

            let customer_crm = {
                Email: email,
                Mobile: phone.replace('0', '+84'),
                Contact_Name: name,
            };
            let data_customer_crm = await CustomerCRMCommon.onRegisterCRM(customer_crm, next);
            let { code, data, error } = data_customer_crm.data;
            if (code === 3000 && data) {
                return res.status(200).json({
                    ...successCallBack,
                    data: data,
                    user: customer_crm,
                });
            } else {
                return res.json({
                    ...errorCallBackWithOutParams,
                    error: error,
                });
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerController;
