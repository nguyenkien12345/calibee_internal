const moment = require('moment');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const FormData = require('form-data');

const AppConfigs = require('../../models/config/AppConfig');

const {
    error_missing_params,
} = require('../../config/response/ResponseError');

const { getRefreshToken } = require('../../config/oauthCRM');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const BookingController = {

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

			// let accessToken = await getRefreshToken()
			// .then((data) => Promise.resolve(data))
			// .catch((err) => Promise.reject(err));

			let url = null;
			if (env === 'PRO') {
				url = `${base_url}/${environment}/form/Jobs`;
			} else {
				url = `${base_url}/${environment}/form/Jobs1`;
			};

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
					buildProdLogger('info', 'DataCRM/data_is_1030.log').info(
						`
						--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
						--- data: ${JSON.stringify(data)}
						--- access_token_crm.value: ${access_token_crm.value}
						--- check_failed: ${check_failed}
						`,
					);

					let accessToken = await getRefreshToken(Booking_ID, 'CREATE JOB')
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

			// let accessToken = await getRefreshToken()
			// .then((data) => Promise.resolve(data))
			// .catch((err) => Promise.reject(err));

			const url = `${base_url}/${environment}/report/All_Jobs/${App_Id_Attendance}`;
			
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

					let accessToken = await getRefreshToken(Booking_ID, 'CREATE BOOKING')
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
	}
};

module.exports = BookingController;
