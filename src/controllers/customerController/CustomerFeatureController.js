const dotenv = require('dotenv');
const moment = require('moment');
const fetch = require('node-fetch');
const FormData = require('form-data');
dotenv.config();

const { buildProdLogger } = require('../../logger/index');

const AppConfigs = require('../../models/config/AppConfig');
const { getRefreshToken } = require('../../config/oauthCRM');
const { error_missing_params } = require('../../config/response/ResponseError');

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const CustomerFeatureController = {

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
						name: 'access_token_crm'
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
					buildProdLogger('info', 'DataCRM/create_booking.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm.value: ${access_token_crm.value}
						--- check_failed: ${check_failed}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'CREATE BOOKING')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm.value = accessToken.access_token
					await access_token_crm.save();
				} else {
					check_failed = false;
					buildProdLogger('info', 'DataCRM/create_booking.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm.value: ${access_token_crm.value}
						--- check_failed: ${check_failed}
						`,
					);
				}
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

			let url = null;
			if (env === 'PRO') {
				url = `${base_url}/${environment}/report/Bookings_Report/${App_Id_Booking}`;
			} else {
				url = `${base_url}/${environment}/report/All_Bookings1/${App_Id_Booking}`;
			}


			let check_failed = true;
			let data = null;

			while (check_failed) {
				let access_token_crm = await AppConfigs.findOne({
					where: {
						name: 'access_token_crm'
					}
				});

				const options = {
					method: 'PATCH',
					body: JSON.stringify({
						data: {
							...data_send,
						},
					}),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Zoho-oauthtoken ${access_token_crm.value}`,
					},
				};
				const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
				data = await response.json();

				if (data.code == 1030) {
					buildProdLogger('info', 'DataCRM/data_is_1030.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm.value: ${access_token_crm.value}
						--- check_failed: ${check_failed}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'UPDATE BOOKING')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm.value = accessToken.access_token
					await access_token_crm.save();
				} else {
					check_failed = false;
					buildProdLogger('info', 'DataCRM/data_not_1030.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm.value: ${access_token_crm.value}
						--- check_failed: ${check_failed}
						`,
					);
				};
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
};

module.exports = CustomerFeatureController;
