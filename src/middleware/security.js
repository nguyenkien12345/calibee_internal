const { error_security } = require('../config/response/ResponseError');

const verifySecurity = (req, res, next) => {
    try {
        const appKey = req.headers.appkey;
        const appId = req.headers.appid;
        if (appKey === process.env.APP_KEY && appId === process.env.APP_ID) {
            next();
        } else {
            return res.json(error_security);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { verifySecurity };
