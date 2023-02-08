const CustomerRouter = require('express').Router();
const CustomerController = require('../../controllers/customerController/CustomerController');
const CustomerFeatureController = require('../../controllers/customerController/CustomerFeatureController');
const security = require('../../middleware/security');

CustomerRouter.put('/update-app-id', security.verifySecurity, CustomerController.updateAppId);
CustomerRouter.put('/update-crm', security.verifySecurity, CustomerController.updateCRM);
// CustomerRouter.post('/crm-register', security.verifySecurity, CustomerController.CRMregister);
CustomerRouter.post('/register-crm', security.verifySecurity, CustomerController.registerCRM);
CustomerRouter.post('/register-crm-many', security.verifySecurity, CustomerController.registerCRMMany);
CustomerRouter.get('/crm', security.verifySecurity, CustomerController.getAllCustomerCRM);
CustomerRouter.post('/create-booking-crm', security.verifySecurity, CustomerFeatureController.createBooking);
CustomerRouter.get('/', security.verifySecurity, CustomerController.getAllCustomer);

CustomerRouter.post('/create-booking-zoho', security.verifySecurity, CustomerFeatureController.createBookingZoho);

module.exports = CustomerRouter;
