const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.post('/save-info-booking-crm', security.verifySecurity, BookingController.saveInfoBookingFromCRM);
BookingRouter.put('/assign-worker-booking-from-crm', security.verifySecurity, BookingController.assignWorkerFromCRM);
BookingRouter.post('/completed-shift-from-crm', security.verifySecurity, BookingController.completedShiftFromCRM);

module.exports = BookingRouter;
