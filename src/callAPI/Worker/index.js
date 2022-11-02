const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const { errorCallBackWithOutParams } = require('../../config/response/ResponseError');

dotenv.config();

const base_url = process.env.BASE_URL_CALIBEE;
const headers = {
    'Content-Type': 'application/json',
    appKey: process.env.APP_KEY,
    appID: process.env.APP_ID,
};

const CallAPIWorker = {
    register: async (worker, next) => {
        try {
            const url = `${base_url}/worker/sign-up`;
            const options = {
                method: 'POST',
                body: JSON.stringify(worker),
                headers: headers,
            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (data !== null && data.status === true) {
                return {
                    data: data,
                };
            } else {
                return {
                    errorCallBackWithOutParams,
                };
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = CallAPIWorker;
