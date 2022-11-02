const dotenv = require('dotenv');
const CustomerCommon = require('../common/CustomerCommon');
const { successCallBack } = require('../../config/response/ResponseSuccess');

dotenv.config();

const CustomerController = {
    getAllCustomer: async (req, res, next) => {
        try {
            let customers = await CustomerCommon.onGetCustomers();
            return res.status(200).json({
                ...successCallBack,
                data: {
                    length: customers.length,
                    customers,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CustomerController;
