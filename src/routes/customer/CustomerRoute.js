const CustomerRouter = require('express').Router();
const CustomerController = require('../../controllers/customerController/CustomerController');
const CustomerFeatureController = require('../../controllers/customerController/CustomerFeatureController');
const security = require('../../middleware/security');

CustomerRouter.get('/', security.verifySecurity, CustomerController.getAllCustomer);
CustomerRouter.post('/register-crm', security.verifySecurity, CustomerController.registerCRM);
CustomerRouter.post('/create-booking-crm', security.verifySecurity, CustomerFeatureController.createBooking);
CustomerRouter.get('/crm', security.verifySecurity, CustomerController.getAllCustomerCRM);

module.exports = CustomerRouter;
