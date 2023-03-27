const dotenv = require('dotenv');
const moment = require('moment');
const fetch = require('node-fetch');
const FormData = require('form-data');
dotenv.config();

const AppConfigs = require('../../models/config/AppConfig');
const { buildProdLogger } = require('../../logger/index');


const { getRefreshToken } = require('../../config/oauthCRM');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const { errorCallBackWithOutParams, error_missing_params } = require('../../config/response/ResponseError');

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const basic_services = [1, 2, 3, 4];
const subscription_service = [5, 6];

const Helper = {
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
				Customer_Type: 'Cá nhân',
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
			let data_respone = await Helper.onCreateBookingCRM(data_booking_crm, req, res, next);
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

	createBookingZoho: async (req, res, next) => {
		try {
			let {
				Booking_ID,
				Customer_Name,
				Location,
				Booking_Status,
				Payment_Status,
				Start_Date,
				End_Date,
				Sub_Total,
				Discount,
				Tip,
				Total,
				Booking_Payable_to_Worker,
				Worker_Information,
			} = req.body;
			let { env } = req.query;
			if (!env) return res.status(400).json(error_missing_params('env'));
			if (!Booking_ID) return res.status(400).json(error_missing_params('Booking_ID'));
			if (!Customer_Name) return res.status(400).json(error_missing_params('Customer_Name'));
			if (!Location) return res.status(400).json(error_missing_params('Location'));
			if (!Booking_Status) return res.status(400).json(error_missing_params('Booking_Status'));
			if (!Payment_Status) return res.status(400).json(error_missing_params('Payment_Status'));
			if (!Start_Date) return res.status(400).json(error_missing_params('Start_Date'));
			if (!End_Date) return res.status(400).json(error_missing_params('End_Date'));
			if (!Sub_Total) return res.status(400).json(error_missing_params('Sub_Total'));
			if (!Discount) return res.status(400).json(error_missing_params('Discount'));
			if (!Tip) return res.status(400).json(error_missing_params('Tip'));
			if (!Total) return res.status(400).json(error_missing_params('Total'));
			if (!Booking_Payable_to_Worker) return res.status(400).json(error_missing_params('Booking_Payable_to_Worker'));
			if (!Worker_Information) return res.status(400).json(error_missing_params('Worker_Information'));

			const formData = new FormData();
			formData.append("Booking_ID", Booking_ID);
			formData.append("Customer_Name", Customer_Name);
			formData.append("Location", Location);
			formData.append("Booking_Status", Booking_Status);
			formData.append("Payment_Status", Payment_Status);
			formData.append("Start_Date", Start_Date);
			formData.append("End_Date", End_Date);
			formData.append("Sub_Total", Sub_Total);
			formData.append("Discount", Discount);
			formData.append("Tip", Tip);
			formData.append("Total", Total);
			formData.append("Booking_Payable_to_Worker", Booking_Payable_to_Worker);
			formData.append("Worker_Information", JSON.stringify(Worker_Information));

			let environment = env === 'PRO' ? 'order-management' : 'om-sandbox';

			const url = `${base_url}/${environment}/form/Bookings1`;

			let check_failed = true;
			let data = null;
			while (check_failed) {
				let access_token_crm = await AppConfigs.findOne({
					where: {
						name : 'access_token_crm'
					}
				});

				const options = {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Zoho-oauthtoken ${access_token_crm.value}`,
					},
				};
				const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
				data = await response.json();

				if (data.code == 1030) {
					let accessToken = await getRefreshToken()
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm.value = accessToken.access_token;
					await access_token_crm.save();
				} else {
					check_failed = false;
				}

				buildProdLogger('info', 'DataCRM/data.log').info(
					`
					--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
					--- Booking_ID: ${Booking_ID}
					--- access_token_crm.value: ${access_token_crm.value}
					--- Data: ${JSON.stringify(data)}
					--- Code: ${data.code}
					--- Check: ${data.code == 1030}
					--- check_failed: ${check_failed}
					`,
				);
			};

			if (!data) {
				return res.status(500).json({
					status: false,
					data: []
				})
			};

			return res.status(200).json({
				data
			});
		} catch (err) {
			next(err);
		}
	},

	updateBookingZoho: async (req, res, next) => {
		try {
			let {
				App_Id_Booking,
				Booking_ID,
				Customer_Name,
				Location,
				Booking_Status,
				Payment_Status,
				Start_Date,
				End_Date,
				Sub_Total,
				Discount,
				Tip,
				Total,
				Booking_Payable_to_Worker,
				Worker_Information,
			} = req.body;
			let { env } = req.query;
			if (!env) return res.status(400).json(error_missing_params('env'));
			if (!App_Id_Booking) return res.status(400).json(error_missing_params('App_Id_Attendance'));
			if (!Booking_ID) return res.status(400).json(error_missing_params('Booking_ID'));
			if (!Customer_Name) return res.status(400).json(error_missing_params('Customer_Name'));
			if (!Location) return res.status(400).json(error_missing_params('Location'));
			if (!Booking_Status) return res.status(400).json(error_missing_params('Booking_Status'));
			if (!Payment_Status) return res.status(400).json(error_missing_params('Payment_Status'));
			if (!Start_Date) return res.status(400).json(error_missing_params('Start_Date'));
			if (!End_Date) return res.status(400).json(error_missing_params('End_Date'));
			if (!Sub_Total) return res.status(400).json(error_missing_params('Sub_Total'));
			if (!Discount) return res.status(400).json(error_missing_params('Discount'));
			if (!Tip) return res.status(400).json(error_missing_params('Tip'));
			if (!Total) return res.status(400).json(error_missing_params('Total'));
			if (!Booking_Payable_to_Worker) return res.status(400).json(error_missing_params('Booking_Payable_to_Worker'));
			if (!Worker_Information) return res.status(400).json(error_missing_params('Worker_Information'));

			// const formData = new FormData();
			// formData.append("Booking_ID", Booking_ID);
			// formData.append("Customer_Name", Customer_Name);
			// formData.append("Location", Location);
			// formData.append("Booking_Status", Booking_Status);
			// formData.append("Payment_Status", Payment_Status);
			// formData.append("Start_Date", Start_Date);
			// formData.append("End_Date", End_Date);
			// formData.append("Sub_Total", Sub_Total);
			// formData.append("Discount", Discount);
			// formData.append("Tip", Tip);
			// formData.append("Total", Total);
			// formData.append("Booking_Payable_to_Worker", Booking_Payable_to_Worker);
			// formData.append("Worker_Information", JSON.stringify(Worker_Information));

			let data_send = {
				Booking_ID,
				Customer_Name,
				Location,
				Booking_Status,
				Payment_Status,
				Start_Date,
				End_Date,
				Sub_Total,
				Discount,
				Tip,
				Total,
				Booking_Payable_to_Worker,
				Worker_Information: JSON.stringify(Worker_Information)
			}

			let environment = env === 'PRO' ? 'order-management' : 'om-sandbox';

			let accessToken = await getRefreshToken()
			.then((data) => Promise.resolve(data))
			.catch((err) => Promise.reject(err));

			// const url = `${base_url}/${environment}/report/All_Bookings1/${App_Id_Booking}`;

			let url = null;
			if (env === 'PRO') {
				url = `${base_url}/${environment}/report/Bookings_Report/${App_Id_Booking}`;
			} else {
				url = `${base_url}/${environment}/report/All_Bookings1/${App_Id_Booking}`;
			}

			const options = {
			    method: 'PATCH',
			    body: JSON.stringify({
					data: {
						...data_send,
					},
				}),
			    headers: {
					'Content-Type': 'application/json',
			        Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
			    },
			};
			const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
			const data = await response.json();
			if (!data) {
				return res.status(500).json({
					status: false,
					data: []
				})
			};

			return res.status(200).json({
				data
			});
		} catch (err) {
			next(err);
		}
	},
};

module.exports = CustomerFeatureController;
