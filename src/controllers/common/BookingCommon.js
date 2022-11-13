const Bookings = require('../../models/booking/Booking');
const BookingDetails = require('../../models/booking/BookingDetail');
const { error_db_querry, onBuildResponseErr } = require('../../config/response/ResponseError');

const BookingCommon = {
    // +++++ Booking common +++++ //
    // 1. Get booking by id
    onGetBookingByID: async (booking_id, res, next) => {
        try {
            let booking = await Bookings.findOne({
                where: {
                    booking_id: booking_id,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (booking) {
                return booking;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // 2. Get booking by id_crm
    onGetBookingByID_CRM: async (booking_id_crm, res, next) => {
        try {
            let booking = await Bookings.findOne({
                where: {
                    app_id: booking_id_crm,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (booking) {
                return booking;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // +++++ Booking common +++++ //
    // 1. Get booking detail by booking_id
    onGetBookingDetailByBookingID: async (booking_id, res, next) => {
        try {
            let booking = await BookingDetails.findOne({
                where: {
                    booking_id: booking_id,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (booking) {
                return booking;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = BookingCommon;
