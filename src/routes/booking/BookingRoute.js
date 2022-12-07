const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.put('/update-info-booking-crm', security.verifySecurity, BookingController.updateInfoBookingFromCRM);
BookingRouter.post('/update-info-booking-to-crm', security.verifySecurity, BookingController.updateInfoBookingToCRM);
BookingRouter.get('/booking-from-crm', security.verifySecurity, BookingController.getBookingFromCRM);
BookingRouter.post('/create-contract', security.verifySecurity, BookingController.createContract);

module.exports = BookingRouter;
