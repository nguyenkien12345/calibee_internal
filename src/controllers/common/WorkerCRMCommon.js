const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const { errorCallBackWithOutParams } = require('../../config/response/ResponseError');
const { getRefreshToken } = require('../../config/oauthCRM');

dotenv.config();

const base_url = process.env.BASE_URL_CREATOR_ZOHO;

const WorkerCRMCommon = {
    onGetAllWorker: async (req, res, next) => {
        try {
            const url = `${base_url}/order-management/report/Workers`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onGetDetailWorker: async (zohoId, res, next) => {
        try {
            const url = `${base_url}/order-management/report/Workers/${zohoId}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onRegisterCRM: async (worker, next) => {
        try {
            const url = `${base_url}/worker-onboarding/form/Lead`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    data: {
                        ...worker,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },

    onUpdateCRM: async (app_id, worker, next) => {
        try {
            const url = `${base_url}/order-management/report/Workers/${app_id}`;
            let accessToken = await getRefreshToken()
                .then((data) => Promise.resolve(data))
                .catch((err) => Promise.reject(err));
            const options = {
                method: 'PATCH',
                body: JSON.stringify({
                    data: {
                        ...worker,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Zoho-oauthtoken ${accessToken.access_token}`,
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            return {
                data: data,
            };
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WorkerCRMCommon;
