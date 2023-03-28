const moment = require('moment');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const FormData = require('form-data');
dotenv.config();

const { buildProdLogger } = require('../../logger/index');
const { getRefreshToken } = require('../../config/oauthCRM');
const { error_missing_params} = require('../../config/response/ResponseError');

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

let access_token_crm = null;

const BookingController = {
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

			let run_while = true;
			let count = 0;
			let data = null;
			while (run_while) {
				const options = {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Zoho-oauthtoken ${access_token_crm}`,
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
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'CREATE BOOKING')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm = accessToken.access_token;
					count = count + 1;

				} else {
					run_while = false;
					buildProdLogger('info', 'DataCRM/create_booking.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);
				};

				if (count == 3) {
					run_while = false;
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


			let run_while = true;
			let count = 0
			let data = null;

			while (run_while) {
				const options = {
					method: 'PATCH',
					body: JSON.stringify({
						data: {
							...data_send,
						},
					}),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Zoho-oauthtoken ${access_token_crm}`,
					},
				};
				const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
				data = await response.json();

				if (data.code == 1030) {
					buildProdLogger('info', 'DataCRM/update_booking.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'UPDATE BOOKING')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm = accessToken.access_token;
					count = count + 1;

				} else {
					run_while = false;
					buildProdLogger('info', 'DataCRM/update_booking.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);
				};

				if (count == 3) {
					run_while = false;
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

	createJobZoho: async (req, res, next) => {
		try {
			let {
				Job_ID,
				Bookings1,
				Job_Status,
				Start_Time,
				End_Time,
				Job_Date,
				Check_In,
				Check_Out,
				Revenue_from_Services_Rendered,
				Payable_to_Worker,
				Worker_Information,
			} = req.body;
			let { env } = req.query;

			if (!env) return res.status(400).json(error_missing_params('env'));
			if (!Job_ID) return res.status(400).json(error_missing_params('Job_ID'));
			if (!Bookings1) return res.status(400).json(error_missing_params('Bookings1'));
			if (!Job_Status) return res.status(400).json(error_missing_params('Job_Status'));
			if (!Start_Time) return res.status(400).json(error_missing_params('Start_Time'));
			if (!End_Time) return res.status(400).json(error_missing_params('End_Time'));
			if (!Job_Date) return res.status(400).json(error_missing_params('Job_Date'));
			if (!Check_In) return res.status(400).json(error_missing_params('Check_In'));
			if (!Check_Out) return res.status(400).json(error_missing_params('Check_Out'));
			if (!Revenue_from_Services_Rendered) return res.status(400).json(error_missing_params('Revenue_from_Services_Rendered'));
			if (!Payable_to_Worker) return res.status(400).json(error_missing_params('Payable_to_Worker'));
			if (!Worker_Information) return res.status(400).json(error_missing_params('Worker_Information'));

			const formData = new FormData();
			formData.append("Job_ID", Job_ID);
			formData.append("Bookings1", Bookings1);
			formData.append("Job_Status", Job_Status);
			formData.append("Start_Time", Start_Time);
			formData.append("End_Time", End_Time);
			formData.append("Job_Date", Job_Date);
			formData.append("Check_In", Check_In);
			formData.append("Check_Out", Check_Out);
			formData.append("Revenue_from_Services_Rendered", Revenue_from_Services_Rendered);
			formData.append("Payable_to_Worker", Payable_to_Worker);
			formData.append("Worker_Information", JSON.stringify(Worker_Information));

			let environment = env === 'PRO' ? 'order-management' : 'om-sandbox';

			let url = null;
			if (env === 'PRO') {
				url = `${base_url}/${environment}/form/Jobs`;
			} else {
				url = `${base_url}/${environment}/form/Jobs1`;
			};

			let run_while = true;
			let count = 0;
			let data = null;
			while (run_while) {
				const options = {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Zoho-oauthtoken ${access_token_crm}`,
					},
				};
				const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
				data = await response.json();

				if (data.code == 1030) {
					buildProdLogger('info', 'DataCRM/create_job.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'CREATE JOB')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));
					
					access_token_crm = accessToken.access_token;
					count = count + 1;

				} else {
					run_while = false;
					buildProdLogger('info', 'DataCRM/create_job.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);
				};

				if (count == 3) {
					run_while = false;
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

	updateJobZoho: async (req, res, next) => {
		try {
			let {
				App_Id_Attendance,
				Job_ID,
				Bookings1,
				Job_Status,
				Start_Time,
				End_Time,
				Job_Date,
				Check_In,
				Check_Out,
				Revenue_from_Services_Rendered,
				Payable_to_Worker,
				Worker_Information,
			} = req.body;
			let { env } = req.query;

			if (!env) return res.status(400).json(error_missing_params('env'));
			if (!App_Id_Attendance) return res.status(400).json(error_missing_params('App_Id_Attendance'));
			if (!Job_ID) return res.status(400).json(error_missing_params('Job_ID'));
			if (!Bookings1) return res.status(400).json(error_missing_params('Bookings1'));
			if (!Job_Status) return res.status(400).json(error_missing_params('Job_Status'));
			if (!Start_Time) return res.status(400).json(error_missing_params('Start_Time'));
			if (!End_Time) return res.status(400).json(error_missing_params('End_Time'));
			if (!Job_Date) return res.status(400).json(error_missing_params('Job_Date'));
			if (!Check_In) return res.status(400).json(error_missing_params('Check_In'));
			if (!Check_Out) return res.status(400).json(error_missing_params('Check_Out'));
			if (!Revenue_from_Services_Rendered) return res.status(400).json(error_missing_params('Revenue_from_Services_Rendered'));
			if (!Payable_to_Worker) return res.status(400).json(error_missing_params('Payable_to_Worker'));
			if (!Worker_Information) return res.status(400).json(error_missing_params('Worker_Information'));

			let data_send = {
				Job_ID,
				Bookings1,
				Job_Status,
				Start_Time,
				End_Time,
				Job_Date,
				Check_In,
				Check_Out,
				Revenue_from_Services_Rendered,
				Payable_to_Worker,
				Worker_Information: JSON.stringify(Worker_Information)
			}
			let environment = env === 'PRO' ? 'order-management' : 'om-sandbox';

			const url = `${base_url}/${environment}/report/All_Jobs/${App_Id_Attendance}`;
			
			let run_while = true;
			let count = 0;
			let data = null;
			while (run_while) {
				const options = {
					method: 'PATCH',
					body: JSON.stringify({
						data: {
							...data_send,
						},
					}),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Zoho-oauthtoken ${access_token_crm}`,
					},
				};
				const response = await fetch(url, options).catch(err => {return res.status(500).json({status: false, message: err})});
				data = await response.json();
				
				if (data.code == 1030) {
					buildProdLogger('info', 'DataCRM/update_job.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- Booking_ID: ${Booking_ID}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm}
						--- run_while: ${run_while}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'UPDATE JOB')
					.then((data) => Promise.resolve(data))
					.catch((err) => Promise.reject(err));

					access_token_crm = accessToken.access_token;
					count = count + 1;

				} else {
					run_while = false;
					buildProdLogger('info', 'DataCRM/data_not_1030.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm: ${access_token_crm.value}
						--- run_while: ${run_while}
						`,
					);
				};

				if (count == 3) {
					run_while = false;
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
	}
};

module.exports = BookingController;
