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

const CallAPICommon = {
    getAllCities: async () => {
        const url = `${base_url}/cities`;
        const options = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(url, options);
        const data = await response.json();
        if (data !== null && data.status === true) {
            return {
                successCallBack,
                data: JSON.stringify(data),
            };
        } else {
            return {
                errorCallBackWithOutParams,
            };
        }
    },

    getAllDistrictByCity: async (idCity) => {
        const url = `${base_url}/province/${idCity}`;
        const options = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(url, options);
        const data = await response.json();
        if (data !== null && data.status === true) {
            return {
                successCallBack,
                data: JSON.stringify(data),
            };
        } else {
            return {
                errorCallBackWithOutParams,
            };
        }
    },

    getAllSkills: async () => {
        const url = `${base_url}/worker/skills`;
        const options = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(url, options);
        const data = await response.json();
        if (data !== null && data.status === true) {
            return {
                successCallBack,
                data: JSON.stringify(data),
            };
        } else {
            return {
                errorCallBackWithOutParams,
            };
        }
    },
};

module.exports = CallAPICommon;
