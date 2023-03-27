const dotenv = require('dotenv');
const moment = require('moment');
const fetch = require('node-fetch');
dotenv.config();

const { buildProdLogger } = require('../../logger/index');
const getRefreshToken = async () => {
    const url = `${process.env.BASE_URL_CREATOR_ZOHO_OAUTH}/token?refresh_token=1000.d2f013387bda3934e51a307aea14e888.71f3ebdd57487f286a92f7eb7447d964&client_id=1000.NX6OY0L75IBNKZGIJZKV7UTYJS3HGT&client_secret=cf3facc6104b7caf5466f12fa87909a7a438802132&grant_type=refresh_token`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (data !== null) {
        return {
            access_token: data.access_token,
        };
    } else {
        return {
            access_token: null,
        };
    }
};

module.exports = { getRefreshToken };
