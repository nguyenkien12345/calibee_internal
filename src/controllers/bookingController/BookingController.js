const dotenv = require('dotenv');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const ServiceCommon = require('../common/ServiceCommon');
const BookingCommon = require('../common/BookingCommon');
const WorkerCommon = require('../common/WorkerCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const Bookings = require('../../models/booking/Booking');
const BookingDetails = require('../../models/booking/BookingDetail');
const Attendances = require('../../models/booking/Attendance');
const fetch = require('node-fetch');
const {
    error_db_querry,
    errorCallBackWithOutParams,
    error_missing_params,
    onBuildResponseErr,
} = require('../../config/response/ResponseError');
const { getRefreshToken } = require('../../config/oauthCRM');
const moment = require('moment');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const Helper = {
    // Function update Sale_Order
    onUpdateSaleOrderCRM: async (sale_order_id, data_update, req, next) => {
        try {
            let { enviroment } = req.query;
            enviroment = enviroment === 'PRO' ? 'order-management' : 'om-sandbox';

            console.log('IN HELPER UPDATE BOOKING');
            const url = `${base_url}/${enviroment}/report/All_Orders/${sale_order_id}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'PATCH',
                body: JSON.stringify({
                    data: {
                        ...data_update,
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

    // Function update Sale_Order
    onUpdateBookingCRM: async (booking_id, data_update, req, next) => {
        try {
            let { enviroment } = req.query;
            enviroment = enviroment === 'PRO' ? 'order-management' : 'om-sandbox';

            console.log('IN HELPER UPDATE BOOKING');
            const url = `${base_url}/${enviroment}/report/All_Bookings/${booking_id}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'PATCH',
                body: JSON.stringify({
                    data: {
                        ...data_update,
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

    // Function create contract in zoho
    onCreateContractCRM: async (data_contract_crm, req, res, next) => {
        try {
            let { enviroment } = req.query;
            enviroment = enviroment === 'PRO' ? 'order-management' : 'om-sandbox';

            console.log('IN HELPER CREATE');
            const url = `${base_url}/${enviroment}/form/Contracts`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    data: {
                        ...data_contract_crm,
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

const BookingController = {
    // Update info booking from Zoho => save info to database
    updateInfoBookingFromCRM: async (req, res, next) => {
        try {
            let { Sale_Order_ID, Order_ID, Status, Booking_ID } = req.body;

            if (!Sale_Order_ID) return res.status(400).json(error_missing_params('Sale_Order_ID'));

            let booking = await BookingCommon.onGetBookingByID_CRM(Sale_Order_ID);
            if (!booking) {
                return res.json(onBuildResponseErr('error_not_found_booking'));
            }

            let booking_detail = await BookingCommon.onGetBookingDetailByBookingID(booking.booking_id);
            if (!booking_detail) {
                return res.json(onBuildResponseErr('error_not_found_booking_detail'));
            }

            let status_booking = booking_detail.status;
            let app_ids = booking_detail.app_ids;
            let zoho_ids = booking_detail.booking_id_crm;

            Order_ID = !Order_ID ? booking.booking_id_crm : Order_ID;
            if (Status) {
                switch (Status) {
                    case 'Draft': {
                        status_booking = 0;
                        break;
                    }
                    case 'Confirmed': {
                        status_booking = 1;
                        break;
                    }
                    case 'Received': {
                        status_booking = 2;
                        break;
                    }
                    case 'Processing': {
                        status_booking = 3;
                        break;
                    }
                    case 'Completed': {
                        status_booking = 4;
                        break;
                    }
                    case 'Canceled': {
                        status_booking = 5;
                        break;
                    }
                }
            }
            console.log('Booking_ID', Booking_ID);
            if (Booking_ID) {
                Booking_ID = JSON.parse(Booking_ID);
                app_ids = JSON.stringify(Object.keys(Booking_ID));
                zoho_ids = JSON.stringify(Object.values(Booking_ID));
                console.log('app_ids', app_ids);
            }

            // Save info booking
            booking.booking_id_crm = Order_ID;
            await booking.save();
            booking_detail.app_ids = app_ids;
            booking_detail.booking_id_crm = zoho_ids;
            booking_detail.status = status_booking;
            await booking_detail.save();

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    Booking_ID,
                    booking,
                    booking_detail,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    // Update info booking to Zoho
    updateInfoBookingToCRM: async (req, res, next) => {
        try {
            let { Sale_Order_ID, Booking_ID, Worker_ID, Status, Check_In, Check_Out, Contract_ID } = req.body;

            // Update Sale_Order
            if (Sale_Order_ID) {
                if (Status) {
                    let data_update = {
                        Status: Status,
                    };

                    await Helper.onUpdateSaleOrderCRM(Sale_Order_ID, data_update, req, next);
                }

                if (Worker_ID) {
                    let data_update = {
                        Worker_ID: Worker_ID,
                    };

                    await Helper.onUpdateSaleOrderCRM(Sale_Order_ID, data_update, req, next);
                }

                if (Contract_ID) {
                    let data_update = {
                        Contract_ID: Contract_ID,
                    };

                    await Helper.onUpdateSaleOrderCRM(Sale_Order_ID, data_update, req, next);
                }
            }

            // Update Status Booking (In_Processing or Completed or Canceled)
            if (Booking_ID) {
                if (Status) {
                    let data_update = {
                        Job_Status: Status,
                    };

                    if (Check_In) {
                        data_update.Check_In = Check_In;
                    }

                    if (Check_Out) {
                        data_update.Check_Out = Check_Out;
                    }

                    const length = Booking_ID.length;
                    for (let i = 0; i < length; i++) {
                        await Helper.onUpdateBookingCRM(Booking_ID[i], data_update, req, next);
                    }
                }
            }

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    // Create a contract in zoho
    createContract: async (req, res, next) => {
        try {
            let {
                booking_id_crm,
                customer_id_crm,
                //worker_id_crm,
                service_category_id,
                service_category_id_crm,
                now_date,
                start_day,
                end_day,
                week_days,
                start_time,
                end_time,
                address,
                location,
                district,
                total_payment,
            } = req.body;

            if (!booking_id_crm) return res.status(400).json(error_missing_params('booking_id_crm'));
            //if (!worker_id_crm) worker_id_crm = null;
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
            if (!total_payment) return res.status(400).json(error_missing_params('total_payment'));

            const week_days_define = {
                2: 'Mon',
                3: 'Tue',
                4: 'Wed',
                5: 'Thu',
                6: 'Fri',
                7: 'Sat',
                8: 'Sun',
            };

            const week_days_name = week_days.map((ele) => week_days_define[ele]);

            let address_split = address.split(', ');
            let street = '';
            for (let i = 0; i <= address_split.length - 4; i++) {
                street = i === 0 ? street + address_split[i] : street + ', ' + address_split[i];
            }

            // set up data before call API from Zoho
            let data_contract_crm = {
                Contract_ID: 'Auto Generate',
                Contract_Owner: 'tracy.nguyen@wolfsolutions.vn',
                Contract_Type: 'Cá nhân',
                Contact_Name: customer_id_crm,
                Service_Name: service_category_id_crm,
                Signed_Date: now_date,
                Contract_Value: total_payment,
                Discount_Amount: 0,
                Contract_Status: 'Deposit Paid',
                City_Province: location,
                Street: street,
                District: district,
                Start_Date: start_day,
                End_Date: end_day,
                Week_Days: week_days_name,
                Invoice_Details: [
                    {
                        Invoice_ID: booking_id_crm,
                        Status: 'Sent',
                        Account_Type: 'Other Current Liability',
                        Invoice_Date: now_date,
                        Start_Date: start_day,
                        End_Date: end_day,
                        Amount: total_payment,
                    },
                ],
                Percent_for_worker: 80,
            };

            for (let i = 0; i < week_days.length; i++) {
                let index = week_days[i] === 8 ? 1 : week_days[i];
                data_contract_crm[`From${index}`] = start_time;
                data_contract_crm[`To${index}`] = end_time;
            }

            console.log('data_booking_crm', data_contract_crm);

            console.log('CALL HELPER CREATE');
            let data_respone = await Helper.onCreateContractCRM(data_contract_crm, req, res, next);
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

    // Get A Booking In Zoho
    getBookingFromCRM: async (req, res, next) => {
        try {
            let { booking_id } = req.query;

            if (!booking_id) return res.status(400).json(error_missing_params('booking_id'));

            console.log('IN HELPER CREATE');
            const url = `${base_url}/om-sandbox/report/All_Orders/${booking_id}`;
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
            console.log('END HELPER CREATE');
            const response = await fetch(url, options);
            const data_response = await response.json();

            let { code, data, error } = data_response;

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

			let accessToken = await getRefreshToken()
			.then((data) => Promise.resolve(data))
			.catch((err) => Promise.reject(err));

			const url = `${base_url}/${environment}/form/Jobs1`;

			const options = {
			    method: 'POST',
			    body: formData,
			    headers: {
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
	}
};

module.exports = BookingController;
