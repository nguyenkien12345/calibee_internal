const { error_db_query } = require('../../config/response/ResponseError');
const { onCheckLockPhoneNumber } = require('../../helpers/authen');
const Otps = require('../../models/otp/Otp');

const LockedController = {
    findLockedPhone: async (phone, res, next) => {
        try {
            let otp = await Otps.findOne({ where: { phone: phone } }).catch((err) => res.json(error_db_query(err)));
            if (otp) {
                let is_locked = await onCheckLockPhoneNumber(res, otp);
                if (is_locked) {
                    return res.status(403).json(is_locked);
                }
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = LockedController;
