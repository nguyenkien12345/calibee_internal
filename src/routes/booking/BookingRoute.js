const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.post('/create-booking-zoho', security.verifySecurity, BookingController.createBookingZoho);
BookingRouter.post('/update-booking-zoho', security.verifySecurity, BookingController.updateBookingZoho);

BookingRouter.post('/create-job-zoho', security.verifySecurity, BookingController.createJobZoho);
BookingRouter.post('/update-job-zoho', security.verifySecurity, BookingController.updateJobZoho);

module.exports = BookingRouter;
