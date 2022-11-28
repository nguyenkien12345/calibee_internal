const dotenv = require('dotenv');
const Customers = require('../../models/customer/Customer');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const CallAPICommon = require('../../callAPI/Common/index');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const {
    errorCallBackWithOutParams,
    error_missing_params,
    onBuildResponseErr,
} = require('../../config/response/ResponseError');
const { buildProdLogger } = require('../../logger/index');

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
                Contact_Name: name.toUpperCase(),
                App_ID: customer_id,
                Source: 'App',
                Customer_ID: '',
            };
            let data_customer_crm = await CustomerCRMCommon.onRegisterCRM(customer_crm, next);
            buildProdLogger('info', 'register_crm_customer_information.log').info(
                `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
				--- Method: ${req.method} --- Controller: CustomerController
				--- Message: ${phone} register crm customer information --- Data: ${JSON.stringify(data_customer_crm)}`,
            );

            let { code, data, error } = data_customer_crm.data;
            if (code === 3000 && data) {
                buildProdLogger('info', 'register_crm_customer_success.log').info(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Controller: CustomerController
					--- Message: ${phone} registered crm successfully --- Data: ${JSON.stringify(data)}`,
                );
                return res.status(200).json({
                    ...successCallBack,
                    data: data,
                    user: customer_crm,
                });
            } else {
                buildProdLogger('error', 'register_crm_customer_fail.log').error(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Controller: CustomerController
					--- Message: ${phone} registered crm failure --- Error: ${JSON.stringify(error)}`,
                );
                return res.json({
                    ...errorCallBackWithOutParams,
                    error: error,
                });
            }
        } catch (err) {
            next(err);
        }
    },

    registerCRMMany: async (req, res, next) => {
        try {
            let customersNotRegister = await CustomerCRMCommon.onGetAllCustomerNotRegisterCRM(req, res, next);
            for (let i = 0; i < customersNotRegister.length; i++) {
                await CustomerCRMCommon.onHandleRegisterCRM(
                    customersNotRegister[i].name,
                    customersNotRegister[i].email,
                    customersNotRegister[i].phone,
                    customersNotRegister[i].customer_id,
                    req,
                    next,
                );
            }
            return res.status(200).json({
                count: customersNotRegister.length,
                ...successCallBack,
            });
        } catch (err) {
            next(err);
        }
    },

    updateCRM: async (req, res, next) => {
        try {
            const zohoId = req.body.zohoId;

            if (!zohoId) {
                return res.status(400).json(error_missing_params('zohoId'));
            }

            const { name, province, address, email, district, street } = req.body;

            let cities_data = await CallAPICommon.getAllCities();
            let result_cities = [];
            result_cities = JSON.parse(cities_data.data).data.cities;
            let cityData = result_cities.find((x) => x.city_id.toString() === province.toString());

            let customer = await CustomerCRMCommon.onGetDetailCustomer(zohoId, res, next);
            if (customer.data.code === 3100) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            } else if (customer.data.code === 3000 && customer.data.data) {
                let updatedCustomer = {
                    Contact_Name: name ? name : customer.data.data.Contact_Name,
                    City_Province: province ? cityData.name : customer.data.data.City_Province,
                    Email: email ? email : customer.data.data.Email,
                    Districts: district ? district : customer.data.data.Districts,
                    Street: street ? street : customer.data.data.Street,
                };
                let data_customer_crm = await CustomerCRMCommon.onUpdateCRM(zohoId, updatedCustomer, next);
                let { code, data, error } = data_customer_crm.data;
                if (code === 3000 && data) {
                    buildProdLogger('info', 'update_crm_customer_success.log').info(
                        `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
						--- Method: ${req.method} --- Controller: CustomerController
						--- Message: ${zohoId} updated crm successfully --- Data: ${JSON.stringify(data)} 
						--- Body: ${JSON.stringify(updatedCustomer)}`,
                    );
                    return res.status(200).json({
                        ...successCallBack,
                        data: data,
                    });
                } else {
                    buildProdLogger('info', 'update_crm_customer_fail.log').info(
                        `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
						--- Method: ${req.method} --- Controller: CustomerController
						--- Message: ${zohoId} updated crm failure --- Error: ${JSON.stringify(error)} 
						--- Body: ${JSON.stringify(updatedCustomer)}`,
                    );
                    return res.json({
                        ...errorCallBackWithOutParams,
                        error: error,
                    });
                }
            }
        } catch (err) {
            next(err);
        }
    },

    updateAppId: async (req, res, next) => {
        try {
            const Customer_ID = req.body.Customer_ID;

            if (!Customer_ID) {
                return res.status(400).json(error_missing_params('Customer_ID'));
            }

            let customer = await CustomerCRMCommon.onSearchByCustomerId(Customer_ID, next);
            if (customer.data.code === 3100) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            } else if (customer.data.code === 3000 && customer.data.data) {
                let customer_updated = await CustomerCommon.onGetCustomerByCustomer_ID_CRM(
                    customer.data.data[0].Customer_ID,
                    res,
                    next,
                );
                customer_updated.app_id = customer.data.data[0].ID;
                await customer_updated
                    .save()
                    .then((data) =>
                        res.status(201).json({
                            ...successCallBack,
                            data: data,
                        }),
                    )
                    .catch((err) => res.json(error_db_querry(err)));
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerController;
