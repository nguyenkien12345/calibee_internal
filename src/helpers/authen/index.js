const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Customers = require('../../models/customer/Customer');
const Workers = require('../../models/worker/Worker');
const { error_db_querry } = require('../../config/response/ResponseError');
const { error_db_querry, onBuildResponseErr } = require('../../config/response/ResponseError');
const { diffInMinutes } = require('../datetime');

dotenv.config();

const AuthenHelper = {
    generateToken: () => {
        return jwt.sign({}, process.env.JWT_ACCESS_KEY, { expiresIn: '3m' });
    },

    generateAccessToken: (id, phone, email) => {
        return jwt.sign(
            {
                id: id,
                phone: phone,
                email: email,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '30m' },
        );
    },

    generateRefreshToken: (phone, email) => {
        return jwt.sign(
            {
                phone: phone,
                email: email,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '30d' },
        );
    },

    generateAccessTokenWorker: (id, phone) => {
        return jwt.sign(
            {
                id: id,
                phone: phone,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '30m' },
        );
    },

    generateRefreshTokenWorker: (phone) => {
        return jwt.sign(
            {
                phone: phone,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '30d' },
        );
    },

    onCheckPhoneExistOnTable: async (res, phone, tableName) => {
        if (tableName === 'CUSTOMER') {
            let customer = await Customers.findOne({ where: { phone: phone } }).catch((err) =>
                res.json(error_db_querry(err)),
            );
            if (!customer) {
                return false;
            } else {
                return true;
            }
        } else if (tableName === 'WORKER') {
            let worker = await Workers.findOne({ where: { phone: phone } }).catch((err) =>
                res.json(error_db_querry(err)),
            );
            if (!worker) {
                return false;
            } else {
                return true;
            }
        }
    },

    onCheckNidExistOnTable: async (res, nid, tableName) => {
        if (tableName === 'CUSTOMER') {
            let customer = await Customers.findOne({ where: { nid: nid } }).catch((err) =>
                res.json(error_db_querry(err)),
            );
            if (!customer) {
                return false;
            } else {
                return true;
            }
        } else if (tableName === 'WORKER') {
            let worker = await Workers.findOne({ where: { nid: nid } }).catch((err) => res.json(error_db_querry(err)));
            if (!worker) {
                return false;
            } else {
                return true;
            }
        }
    },

    onCheckEmailExistOnTable: async (res, email, tableName) => {
        if (tableName === 'CUSTOMER') {
            let customer = await Customers.findOne({ where: { email: email } }).catch((err) =>
                res.json(error_db_querry(err)),
            );
            if (!customer) {
                return false;
            } else {
                return true;
            }
        } else if (tableName === 'WORKER') {
            let worker = await Workers.findOne({ where: { email: email } }).catch((err) =>
                res.json(error_db_querry(err)),
            );
            if (!worker) {
                return false;
            } else {
                return true;
            }
        }
    },

    onCheckLockPhoneNumber: async (res, otp_object) => {
        if (otp_object.locked_at || otp_object.verify_count === otp_object.max_verify_count) {
            let minutes = diffInMinutes(new Date(otp_object.locked_at), new Date());
            if (minutes > 60) {
                await otp_object
                    .update({ verify_count: 0, locked_at: null })
                    .catch((err) => res.json(error_db_querry(err)));
                return null;
            } else {
                return {
                    ...onBuildResponseErr('error_locked_phone_number'),
                    data: {
                        remaining: 60 - minutes,
                        unit: 'minutes',
                    },
                };
            }
        }
        return null;
    },
};
module.exports = AuthenHelper;
