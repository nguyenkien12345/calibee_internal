const dotenv = require('dotenv');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const fetch = require('node-fetch');
const { errorCallBackWithOutParams, error_missing_params } = require('../../config/response/ResponseError');
const { getRefreshToken } = require('../../config/oauthCRM');
const { addListener } = require('nodemon');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const basic_services = [1, 2, 3, 4];
const subscription_service = [5, 6];

const Hepler = {
    onCreateBookingCRM: async (data_booking_crm, req, res, next) => {
        try {
            let { enviroment } = req.query;
            enviroment = enviroment === 'PRO' ? 'order-management' : 'om-sandbox';

            console.log('IN HELPER CREATE');
            const url = `${base_url}/${enviroment}/form/New_Order`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    data: {
                        ...data_booking_crm,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            console.log('END HELPER CREATE');
            const response = await fetch(url, options);
            const data = await response.json();

            console.log('data', data);

            return data;
        } catch (err) {
            next(err);
        }
    },
};

const CustomerFeatureController = {
    createBooking: async (req, res, next) => {
        try {
            let {
                customer_id,
                customer_id_crm,
                worker_id_crm,
                service_category_id,
                service_category_id_crm,
                now_date,
                start_day,
                end_day,
                start_time,
                end_time,
                location,
                district,
                product_code_name,
                total_payment,
                address,
            } = req.body;

            if (!customer_id) return res.status(400).json(error_missing_params('customer_id'));
            if (!worker_id_crm) worker_id_crm = null;
            if (!customer_id_crm) return res.status(400).json(error_missing_params('service_category_id'));
            if (!service_category_id) return res.status(400).json(error_missing_params('service_category_id'));
            if (!service_category_id_crm) return res.status(400).json(error_missing_params('service_category_id_crm'));
            if (!now_date) return res.status(400).json(error_missing_params('now_date'));
            if (!start_day) return res.status(400).json(error_missing_params('start_day'));
            if (!end_day) return res.status(400).json(error_missing_params('end_day'));
            if (!start_time) return res.status(400).json(error_missing_params('start_time'));
            if (!end_time) return res.status(400).json(error_missing_params('end_time'));
            if (!location) return res.status(400).json(error_missing_params('location'));
            if (!district) return res.status(400).json(error_missing_params('district'));
            //if (!product_code_name) return res.status(400).json(error_missing_params('product_code_name'));
            if (!total_payment) return res.status(400).json(error_missing_params('total_payment'));

            let address_split = address.split(', ');
            let street = '';
            for (let i = 0; i <= address_split.length - 4; i++) {
                street = i === 0 ? street + address_split[i] : street + ', ' + address_split[i];
            }

            // set up data before call API from Zoho
            let data_booking_crm = {
                Order_ID: 'Auto Generate',
                Status: 'Sent',
                Account_Type: 'Other Current Liability',
                Product_Name: service_category_id_crm,
                Invoice_Date: now_date,
                Contact_Name: customer_id_crm,
                Customer_Type: 'C?? nh??n',
                Net_Total: total_payment,
                Start: start_time,
                End_Time: end_time,
                Location: location,
                District: district,
                Street: street,
                App_ID: customer_id,
                Item_Rates_Are: 'Tax Inclusive',
                Source: 'App',
                Product_Code_Name: product_code_name ? product_code_name : 'O_Basic_079_II_P3h',
            };
            // Set Start_Date and End_Date
            if (basic_services.includes(service_category_id)) {
                data_booking_crm['Service_Type'] = 'One-off';
                data_booking_crm['Job_Date'] = start_day;
            } else if (subscription_service.includes(service_category_id)) {
                data_booking_crm['Service_Type'] = 'Subscription';
                data_booking_crm['Start_Date'] = start_day;
                data_booking_crm['End_Date'] = end_day;
            }
            // Set Worker_ID if have
            if (worker_id_crm) {
                data_booking_crm['Worker_ID'] = worker_id_crm;
            }

            console.log('data_booking_crm', data_booking_crm);

            console.log('CALL HELPER CREATE');
            let data_respone = await Hepler.onCreateBookingCRM(data_booking_crm, req, res, next);
            console.log('FINISH HELPER CREATE');
            let { code, data, error } = data_respone;

            console.log('data_respone', data_respone);
            if (code === 3000 && data) {
                return res.status(200).json({
                    ...successCallBack,
                    data: data,
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

module.exports = CustomerFeatureController;
