const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.post('/save-info-booking-crm', security.verifySecurity, BookingController.saveInfoBookingFromCRM);

module.exports = BookingRouter;
