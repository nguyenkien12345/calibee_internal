const dotenv = require('dotenv');
const fetch = require('node-fetch');
const Customers = require('../../models/customer/Customer');
const { getRefreshToken } = require('../../config/oauthCRM');
const { error_missing_params, error_db_querry } = require('../../config/response/ResponseError');
const { Op } = require('sequelize');
const { buildProdLogger } = require('../../logger/index');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const CustomerCRMCommon = {
    onGetAllCustomer: async (req, res, next) => {
        try {
            const url = `${base_url}/order-management/report/Sheet1_Report`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onGetAllCustomerNotRegisterCRM: async (req, res, next) => {
        try {
            const customers = await Customers.findAll({
                where: {
                    [Op.or]: [
                        { app_id: null, customer_id_crm: null },
                        { app_id: null, customer_id_crm: '' },
                        { app_id: '', customer_id_crm: null },
                    ],
                },
            }).catch((err) => res.json(error_db_querry(err)));

            return customers;
        } catch (err) {
            next(err);
        }
    },

    onGetDetailCustomer: async (zohoId, res, next) => {
        try {
            const url = `${base_url}/order-management/report/Sheet1_Report/${zohoId}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onRegisterCRM: async (customer, next) => {
        try {
            const url = `${base_url}/order-management/form/Contacts`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    data: {
                        ...customer,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onHandleRegisterCRM: async (name, email, phone, customer_id, req, next) => {
        try {
            if (!name) return res.status(400).json(error_missing_params('name'));
            if (!email) return res.status(400).json(error_missing_params('email'));
            if (!phone) return res.status(400).json(error_missing_params('phone'));
            if (!customer_id) return res.status(400).json(error_missing_params('customer_id'));

            let customer_crm = {
                Email: email,
                Mobile: phone.replace('0', '+84'),
                Contact_Name: name,
                App_ID: customer_id,
                Source: 'App',
                Customer_ID: '',
            };
            let data_customer_crm = await CustomerCRMCommon.onRegisterCRM(customer_crm, next);
            let { code, data, error } = data_customer_crm.data;
            if (code === 3000 && data) {
                buildProdLogger('info', 'register_crm_customer_success.log').info(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Common: CustomerCRMCommon
					--- Message: ${phone} registered crm successfully --- Data: ${JSON.stringify(data)}`,
                );
                return true;
            } else {
                buildProdLogger('error', 'register_crm_customer_fail.log').error(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Common: CustomerCRMCommon
					--- Message: ${phone} registered crm failure --- Error: ${JSON.stringify(error)}`,
                );
                return false;
            }
        } catch (err) {
            next(err);
        }
    },

    onUpdateCRM: async (app_id, customer, next) => {
        try {
            const url = `${base_url}/order-management/report/Sheet1_Report/${app_id}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'PATCH',
                body: JSON.stringify({
                    data: {
                        ...customer,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onSearchByCustomerId: async (Customer_ID, next) => {
        try {
            const url = `${base_url}/order-management/report/Sheet1_Report?Customer_ID=${Customer_ID}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerCRMCommon;
