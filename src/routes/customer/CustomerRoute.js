const CustomerRouter = require('express').Router();
const CustomerController = require('../../controllers/customerController/CustomerController');
const security = require('../../middleware/security');

CustomerRouter.get('/', security.verifySecurity, CustomerController.getAllCustomer);

module.exports = CustomerRouter;
