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
    onBeforeSaveInfoBookingCRM: (days, start_day, start_time, working_time, package, next) => {
        try {
            // Cal days
            const days_week = {
                Mon: 2,
                Tue: 3,
                Wed: 4,
                Thu: 5,
                Fri: 6,
                Sat: 7,
                Sun: 8,
            };
            let time_key = [];
            let days_tmp = null;
            if (package !== 1 && days) {
                days_tmp = days.map((item) => days_week[item]);
                // Lấy ra thứ trong tuần của start_day
                let current_day = moment(start_day).day() + 1;
                current_day = current_day === 1 ? 8 : current_day;

                // index of start_day in days
                let index = days_tmp.indexOf(current_day);
                index = index === -1 ? 0 : index;

                // Khoảng cách của các thứ mà customer chọn
                let tmp_days = [...days_tmp, days_tmp[0]];
                let distance_days = [];
                for (let i = 1; i < tmp_days.length; i++) {
                    distance_days.push(
                        tmp_days[i] - tmp_days[i - 1] > 0
                            ? tmp_days[i] - tmp_days[i - 1]
                            : tmp_days[i] - tmp_days[i - 1] + 7,
                    );
                }
                distance_days = [...distance_days.slice(index, days_tmp.length), ...distance_days.slice(0, index)];

                // Cal time key
                let start = moment(moment(start_day).format('YYYY-MM-DD') + ' ' + start_time + '+0700').valueOf();
                const run = Math.ceil(working_time);

                for (let i = 0; i < package; i++) {
                    for (let j = 0; j <= run; j++) {
                        time_key.push(start + j * 3600000);
                    }
                    start = start + 3600000 * 24 * distance_days[i % distance_days.length];
                }
            } else {
                const start = moment(start_day + ' ' + start_time + '+0700').valueOf();
                const run = Math.ceil(working_time);

                for (let i = 0; i <= run; i++) {
                    time_key.push(start + i * 3600000);
                }
            }
            return { days_tmp, time_key };
        } catch (err) {
            next(err);
        }
    },

    // Function to create booking detail when create booking ---- (Done) ----
    onCreateBookingDetail: async (
        booking_id,
        worker_id,
        working_day,
        start_time,
        rest_work,
        time_key,
        total_job,
        total_time,
        booking_ids,
        status,
        app_ids,
        res,
        next,
    ) => {
        try {
            const tmp_time_key = JSON.parse(time_key);
            const run = Math.ceil(total_time) + 1;
            let time_key_tmp = [];

            for (let i = 0; i < tmp_time_key.length; i += run) {
                time_key_tmp.push(tmp_time_key.slice(i, i + run));
            }

            const booking_detail = await BookingDetails.create({
                booking_id,
                worker_id,
                working_day,
                start_time,
                rest_work,
                status: 1,
                payment_status: 1,
                time_key,
                time_key_test: JSON.stringify(time_key_tmp),
                current_job: 1,
                total_job,
                app_ids: JSON.stringify(booking_ids),
                status: status,
                app_ids: app_ids,
            }).catch((err) => res.json(error_db_querry(err)));

            return booking_detail;
        } catch (err) {
            next(err);
        }
    },

    // Function update Sale_Order
    onUpdateSaleOrderCRM: async (sale_order_id, data_update, next) => {
        try {
            console.log('IN HELPER UPDATE BOOKING');
            const url = `${base_url}/om-sandbox/report/All_Orders/${sale_order_id}`;
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
    onUpdateBookingCRM: async (booking_id, data_update, next) => {
        try {
            console.log('IN HELPER UPDATE BOOKING');
            const url = `${base_url}/om-sandbox/report/All_Bookings/${booking_id}`;
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
};

const BookingController = {
    // When Zoho create SaleOrder => save info to database
    saveInfoBookingFromCRM: async (req, res, next) => {
        try {
            let {
                customer_id,
                service_category_id,
                address,
                days,
                start_day,
                end_day,
                start_time,
                service_type,
                working_time,
                worker_earnings,
                total_payment,
                payment_method,
                worker_id,
                booking_ids,
                ID,
            } = req.body;

            let { method } = req.query;
            method = method ? method : 'zoho';

            if (!customer_id) return res.status(400).json(error_missing_params('customer_id'));
            if (!service_category_id) return res.status(400).json(error_missing_params('service_category_id'));
            if (!address) return res.status(400).json(error_missing_params('address'));
            if (!start_day) return res.status(400).json(error_missing_params('start_day'));
            if (!end_day) return res.status(400).json(error_missing_params('end_day'));
            if (!service_type) return res.status(400).json(error_missing_params('service_type'));
            if (!working_time) return res.status(400).json(error_missing_params('working_time'));
            if (!worker_earnings) return res.status(400).json(error_missing_params('worker_earnings'));
            if (!total_payment) return res.status(400).json(error_missing_params('total_payment'));
            //if (!payment_method) return res.status(400).json(error_missing_params('payment_method'));
            //if (!booking_ids) return res.status(400).json(error_missing_params('booking_ids'));
            //if (!sale_order_id) return res.status(400).json(error_missing_params('sale_order_id'));

            let customer = await CustomerCommon.onGetCustomerByID_CRM(customer_id);
            if (!customer) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            }

            let service_category = await ServiceCommon.onGetServiceCategory(service_category_id);
            if (!service_category) {
                return res.json(onBuildResponseErr('error_not_found_service_category'));
            }

            let package = service_type === 'Subscription' && booking_ids ? app_ids_booking_detail.length : 1;
            let { days_tmp, time_key } = Helper.onBeforeSaveInfoBookingCRM(
                days,
                start_day,
                start_time,
                working_time,
                package,
                next,
            );

            // Create a new booking
            let booking_create = await Bookings.create({
                customer_id: customer.customer_id,
                service_category_id: service_category.service_category_id,
                address: address,
                parent_type_id: '[]',
                days: JSON.stringify(days_tmp),
                start_day: start_day,
                end_day: end_day,
                start_time: start_time,
                package: package,
                working_time: working_time,
                total_time: working_time,
                worker_earnings: worker_earnings,
                tip: 0,
                service_fee: total_payment,
                total: total_payment,
                priority: 2,
                time_key: JSON.stringify(time_key),
                payment_method_id: payment_method === 'Cash' ? 5 : 6,
                app_id: ID,
            }).catch((err) => res.json(error_db_querry(err)));

            // Create a new booking detail
            let worker = null;
            let status = 1;
            if (worker_id) {
                worker = await WorkerCommon.onGetWorkerByID_CRM(worker_id, res, next);
                worker_id = worker.worker_id;
                status = 2;
            }

            // Create a new booking detail
            const booking_detail = await Helper.onCreateBookingDetail(
                booking_create.booking_id,
                worker_id,
                start_day,
                start_time,
                package,
                booking_create.time_key,
                package,
                working_time,
                booking_ids,
                status,
                JSON.stringify(booking_ids),
                res,
                next,
            );

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    booking_create: booking_create,
                    booking_detail: booking_detail,
                },
            });
        } catch (err) {
            next(err);
        }
    },

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
            let { Sale_Order_ID, Booking_ID, Worker_ID, Status } = req.body;

            //if (!Sale_Order_ID) return res.status(400).json(error_missing_params('Sale_Order_ID'));
            if (!Booking_ID) return res.status(400).json(error_missing_params('Booking_ID'));

            // Update Sale_Order
            if (Worker_ID) {
                let data_update = {
                    Status: 'Confirmed',
                    Worker_ID: Worker_ID,
                };

                await Helper.onUpdateSaleOrderCRM(Sale_Order_ID, data_update, next);

                // Update Status Booking
                let length = Booking_ID.length;
                for (let i = 0; i < length; i++) {
                    let data_update = {
                        Job_Status: 'Scheduled',
                        Payment_Status: 'Not_Yet_Paid',
                    };

                    await Helper.onUpdateBookingCRM(Booking_ID[i], data_update, next);
                }
            }

            // Update Status Booking (In_Processing or Completed or Canceled)
            if (Status) {
                let data_update = {
                    Job_Status: Status,
                };

                await Helper.onUpdateBookingCRM(Booking_ID[0], data_update, next);
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

    // When Zoho assign Worker to Bookings => save worker_id and update status = 2 of booking_detail
    assignWorkerFromCRM: async (req, res, next) => {
        try {
            let { sale_order_id, worker_id } = req.body;

            if (!sale_order_id) return res.status(400).json(error_missing_params('sale_order_id'));
            if (!worker_id) return res.status(400).json(error_missing_params('worker_id'));

            let booking = await BookingCommon.onGetBookingByID_CRM(sale_order_id);
            if (!booking) {
                return res.json(onBuildResponseErr('error_not_found_booking'));
            }

            let booking_detail = await BookingCommon.onGetBookingDetailByBookingID(booking.booking_id);
            if (!booking_detail) {
                return res.json(onBuildResponseErr('error_not_found_booking_detail'));
            }

            let worker = await WorkerCommon.onGetWorkerByID_CRM(worker_id);
            if (!worker) {
                return res.json(onBuildResponseErr('error_not_found_worker'));
            }

            booking_detail.worker_id = worker.worker_id;
            booking_detail.status = 2;
            await booking_detail.save();

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    booking_detail,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    // When Zoho enter completed shift for worker => update status = 2 of attendance
    completedShiftFromCRM: async (req, res, next) => {
        try {
            let { sale_order_id, booking_id } = req.body;

            if (!sale_order_id) return res.status(400).json(error_missing_params('sale_order_id'));
            if (!booking_id) return res.status(400).json(error_missing_params('worker_id'));

            let booking = await BookingCommon.onGetBookingByID_CRM(sale_order_id);
            if (!booking) {
                return res.json(onBuildResponseErr('error_not_found_booking'));
            }

            let booking_detail = await BookingCommon.onGetBookingDetailByBookingID(booking.booking_id);
            if (!booking_detail) {
                return res.json(onBuildResponseErr('error_not_found_booking_detail'));
            }

            const basic = [1, 2, 3, 4];
            const subscription = [5, 6];
            let number_job = -1;
            if (subscription.includes(booking.service_category_id)) {
                let booking_ids = booking_detail.app_ids ? JSON.parse(booking_detail.app_ids) : [];

                number_job = booking_ids.findIndex(booking_id);

                if (number_job === booking_detail.current_day) {
                    booking_detail.status = 4;
                } else {
                    booking_detail.status = 3;
                }
            } else {
                booking_detail.status = 4;
            }
            await booking_detail.save();

            let attendance = await Attendances.findOne({
                where: {
                    booking_detail_id: booking_detail.booking_detail_id,
                    number_job: number_job,
                },
            });

            if (attendance) {
                if (!attendance.check_in) {
                    attendance.check_in = moment('2022/11/14 ' + booking_detail.start_time).format('HH:mm:ss');
                }
                if (!attendance.check_out) {
                    attendance.check_out = moment('2022/11/14 ' + booking_detail.start_time)
                        .add(booking.total_time, 'hours')
                        .format('HH:mm:ss');
                }
                attendance.status = 2;

                await attendance.save();
            } else {
                attendance = await Attendances.create({
                    booking_detail_id: booking_detail.booking_detail_id,
                    working_day: moment().add(7, 'hours').format('YYYY-MM-DD'),
                    check_in: moment('2022/11/14 ' + booking_detail.start_time).format('HH:mm:ss'),
                    check_out: moment('2022/11/14 ' + booking_detail.start_time)
                        .add(booking.total_time, 'hours')
                        .format('HH:mm:ss'),
                    status: 2,
                    number_job: number_job,
                });
            }

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    attendance,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    // When Zoho confirmed booing => update status = 1 of booking_detail
    confirmBookingFromCRM: async (req, res, next) => {
        try {
            let { sale_order_id, data } = req.body;

            if (!sale_order_id) return res.status(400).json(error_missing_params('sale_order_id'));
            if (!data) return res.status(400).json(error_missing_params('data'));

            let booking = await BookingCommon.onGetBookingByID_CRM(sale_order_id);
            if (!booking) {
                return res.json(onBuildResponseErr('error_not_found_booking'));
            }

            let booking_detail = await BookingCommon.onGetBookingDetailByBookingID(booking.booking_id);
            if (!booking_detail) {
                return res.json(onBuildResponseErr('error_not_found_booking_detail'));
            }

            let app_ids = Object.keys(data);
            let zoho_ids = Object.values(data);

            booking_detail.app_ids = JSON.stringify(app_ids);
            // booking_detail.zoho_ids = JSON.stringify(zoho_ids);
            booking_detail.status = 1;
            await booking_detail.save();

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    booking_detail,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = BookingController;
