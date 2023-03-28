const { ValidationErrMessage, ValidationErrCode } = require('../../config/validation_rule');

const onBuildResponseErr = (errorKey) => {
    return {
        status: false,
        err_code: ValidationErrCode[errorKey],
        message: ValidationErrMessage[errorKey],
    };
};

const errorCallBackWithOutParams = () => {
    return {
        status: false,
        message: 'Fail',
    };
};

const errorCallBack = (err) => {
    return {
        status: false,
        err_code: 50000,
        message: `Error while executing: ${err}`,
    };
};

const error_db_query = (err) => {
    return {
        status: false,
        err_code: 50001,
        message: `Error while database query executing: ${err}`,
    };
};

const error_missing_params = (params) => {
    return {
        status: false,
        message: `Missing required parameters: ${params}`,
    };
};

const error_security = {
    status: false,
    err_code: 9000,
    message: 'You do not have permission to access this app',
};

const unauthorized_access = {
    status: false,
    err_code: 40001,
    message: 'Unauthorized access',
};

const no_token_provided = {
    status: false,
    err_code: 40002,
    message: 'No token provided.',
};

const token_is_not_valid = {
    status: false,
    err_code: 40003,
    message: 'Token is not valid',
};

const do_not_allowed_to_do_acion = {
    status: false,
    err_code: 40004,
    message: 'You are not allowed to do this action',
};

module.exports = {
    onBuildResponseErr,
    errorCallBackWithOutParams,
    errorCallBack,
    error_db_query,
    error_missing_params,
    error_security,
    unauthorized_access,
    no_token_provided,
    token_is_not_valid,
    do_not_allowed_to_do_acion,
};
