const BookingRouter = require('express').Router();
const BookingController = require('../../controllers/bookingController/BookingController');
const security = require('../../middleware/security');

BookingRouter.post('/create-job-zoho', security.verifySecurity, BookingController.createJobZoho);
BookingRouter.post('/update-job-zoho', security.verifySecurity, BookingController.updateJobZoho);

module.exports = BookingRouter;
