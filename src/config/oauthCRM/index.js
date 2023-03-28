const dotenv = require('dotenv');
const moment = require('moment');
const fetch = require('node-fetch');
dotenv.config();

const { buildProdLogger } = require('../../logger/index');
const getRefreshToken = async (booking_id, name_action) => {
    const url = `${process.env.BASE_URL_CREATOR_ZOHO_OAUTH}/token?refresh_token=1000.d2f013387bda3934e51a307aea14e888.71f3ebdd57487f286a92f7eb7447d964&client_id=1000.NX6OY0L75IBNKZGIJZKV7UTYJS3HGT&client_secret=cf3facc6104b7caf5466f12fa87909a7a438802132&grant_type=refresh_token`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (data !== null) {
		buildProdLogger('info', 'DataCRM/getRefreshToken_success.log').info(
			`
			--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
			--- name_action: ${name_action}
			--- booking_id: ${booking_id}
			--- data: ${JSON.stringify(data)}
			--- data.access_token: ${data.access_token}
			`,
		);
        return {
            access_token: data.access_token,
        };
    } else {
		buildProdLogger('info', 'DataCRM/getRefreshToken_failed.log').info(
			`
			--- NowTime: ${moment().add(7,'hours').format('YYYY-MM-DD HH:mm:ss')}
			--- name_action: ${name_action}
			--- booking_id: ${booking_id}
			--- data: ${JSON.stringify(data)}
			`,
		);
        return {
            access_token: null,
        };
    }
};

module.exports = { getRefreshToken };
