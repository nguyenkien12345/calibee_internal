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
            let { Sale_Order_ID, Booking_ID, Worker_ID, Status, Check_In, Check_Out } = req.body;

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
