const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.put('/update-info-booking-crm', security.verifySecurity, BookingController.updateInfoBookingFromCRM);
BookingRouter.post('/update-info-booking-to-crm', security.verifySecurity, BookingController.updateInfoBookingToCRM);
BookingRouter.get('/booking-from-crm', security.verifySecurity, BookingController.getBookingFromCRM);
BookingRouter.post('/create-contract', security.verifySecurity, BookingController.createContract);

BookingRouter.post('/create-job-zoho', security.verifySecurity, BookingController.createJobZoho);
BookingRouter.patch('/update-job-zoho', security.verifySecurity, BookingController.updateJobZoho);

module.exports = BookingRouter;
