const CustomerRouter = require('express').Router();
const CustomerFeatureController = require('../../controllers/customerController/CustomerFeatureController');
const security = require('../../middleware/security');

CustomerRouter.post('/create-booking-zoho', security.verifySecurity, CustomerFeatureController.createBookingZoho);
CustomerRouter.post('/update-booking-zoho', security.verifySecurity, CustomerFeatureController.updateBookingZoho);

module.exports = CustomerRouter;
