const dotenv = require('dotenv');
const Customers = require('../../models/customer/Customer');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const {
    errorCallBackWithOutParams,
    error_missing_params,
    onBuildResponseErr,
} = require('../../config/response/ResponseError');
const AuthenHelper = require('../../helpers/authen');

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
                App_ID: customer_id,
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

    updateCRM: async (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },

    CRMregister: async (req, res, next) => {
        try {
            const { name, email, phone, password, app_id } = req.body;

            if (!name) return res.status(400).json(error_missing_params('name'));
            if (!email) return res.status(400).json(error_missing_params('email'));
            if (!phone) return res.status(400).json(error_missing_params('phone'));
            if (!password) return res.status(400).json(error_missing_params('password'));
            if (!app_id) return res.status(400).json(error_missing_params('app_id'));

            let is_exists_phone = await CustomerCommon.onGetCustomerByPhone(phone, res, next);
            if (is_exists_phone) {
                return res.json(onBuildResponseErr('error_exist_phone'));
            }

            let is_exists_email = await CustomerCommon.onGetCustomerByEmail(email, res, next);
            if (is_exists_email) {
                return res.json(onBuildResponseErr('error_exist_email'));
            }

            const new_refresh_token = AuthenHelper.generateRefreshToken(phone, email);
            let customer = await Customers.create({
                name: name,
                email: email,
                phone: phone.replace('+84', '0'),
                password: password,
                app_id: app_id,
                refresh_token: new_refresh_token,
                customer_id_crm: '',
            }).catch((err) => res.json(error_db_querry(err)));
            const new_access_token = AuthenHelper.generateAccessToken(customer.id, customer.phone, customer.email);

            let { password: password_user, createdAt, updatedAt, ...other } = customer.dataValues;

            return res.status(201).json({
                ...successCallBack,
                data: {
                    success: true,
                    access_token: new_access_token,
                    refresh_token: new_refresh_token,
                    user: { ...other },
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerController;
