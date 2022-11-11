const dotenv = require('dotenv');
const CustomerCommon = require('../common/CustomerCommon');
const CustomerCRMCommon = require('../common/CustomerCRMCommon');
const ServiceCommon = require('../common/ServiceCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const Bookings = require('../../models/booking/Booking');
const BookingDetails = require('../../models/booking/BookingDetail');
const fetch = require('node-fetch');
const {
    errorCallBackWithOutParams,
    error_missing_params,
    onBuildResponseErr,
} = require('../../config/response/ResponseError');
const { getRefreshToken } = require('../../config/oauthCRM');
const moment = require('moment');
const WorkerCommon = require('../common/WorkerCommon');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const Helper = {
    onBeforeSaveInfoBookingCRM: (days, start_day, start_time, working_time, package, next) => {
        try {
            // Cal days
            const days_week = {
                Monday: 2,
                Tuesday: 3,
                Wednesday: 4,
                Thursday: 5,
                Friday: 6,
                Saturday: 7,
                Sunday: 8,
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
            }).catch((err) => res.json(error_db_querry(err)));

            return booking_detail;
        } catch (err) {
            next(err);
        }
    },
};

const BookingController = {
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
            } = req.body;

            if (!customer_id) return res.status(400).json(error_missing_params('customer_id'));
            if (!service_category_id) return res.status(400).json(error_missing_params('service_category_id'));
            if (!address) return res.status(400).json(error_missing_params('address'));
            if (!start_day) return res.status(400).json(error_missing_params('start_day'));
            if (!end_day) return res.status(400).json(error_missing_params('end_day'));
            if (!service_type) return res.status(400).json(error_missing_params('service_type'));
            if (!working_time) return res.status(400).json(error_missing_params('working_time'));
            if (!worker_earnings) return res.status(400).json(error_missing_params('worker_earnings'));
            if (!total_payment) return res.status(400).json(error_missing_params('total_payment'));
            if (!payment_method) return res.status(400).json(error_missing_params('payment_method'));

            let customer = await CustomerCommon.onGetCustomerByID_CRM(customer_id);
            if (!customer) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            }

            let service_category = await ServiceCommon.onGetServiceCategory(service_category_id);
            if (!service_category) {
                return res.json(onBuildResponseErr('error_not_found_service_category'));
            }

            // format start_day MM/DD/YYYY
            let tmp = start_day.split('/');
            start_day = tmp[1] + '/' + tmp[0] + '/' + tmp[2];

            // format end_day MM/DD/YYYY
            if (end_day) {
                tmp = end_day.split('/');
                end_day = tmp[1] + '/' + tmp[0] + '/' + tmp[2];
            }

            let package = service_type === 'Subscription' && booking_ids ? booking_ids.length : 1;
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
            }).catch((err) => res.json(error_db_querry(err)));

            // Create a new booking detail
            let worker = null;
            let status = 1;
            if (worker_id) {
                worker = await WorkerCommon.onGetWorkerByID_CRM(worker_id, res, next);
                worker_id = worker.worker_id;
                status = 2;
            }
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
                res,
                next,
            );

            return res.status(200).json({
                ...successCallBack,
                data: {
                    success: true,
                    booking_id: booking_create.booking_id,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = BookingController;
