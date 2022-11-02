const dotenv = require('dotenv');
const {
    unauthorized_access,
    no_token_provided,
    do_not_allowed_to_do_acion,
} = require('../config/response/ResponseError');

dotenv.config();

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(401).json(unauthorized_access);
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            return res.status(403).json(no_token_provided);
        }
    } catch (err) {
        next(err);
    }
};

const verifyTokenByMySelf = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (
                req.user.id === Number(req.params.id) ||
                req.user.id === Number(req.query.id) ||
                req.user.id === Number(req.body.id)
            ) {
                next();
            } else {
                return res.status(403).json(do_not_allowed_to_do_acion);
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { verifyToken, verifyTokenByMySelf };
