const CustomerRouter = require('express').Router();
const CustomerController = require('../../controllers/customerController/CustomerController');
const security = require('../../middleware/security');

CustomerRouter.get('/', security.verifySecurity, CustomerController.getAllCustomer);
CustomerRouter.post('/register-crm', security.verifySecurity, CustomerController.registerCRM);
CustomerRouter.get('/crm', security.verifySecurity, CustomerController.getAllCustomerCRM);

module.exports = CustomerRouter;
