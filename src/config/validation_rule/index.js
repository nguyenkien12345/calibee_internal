const ValidationFormat = {
    phone: /^(09|03|07|08|05)+([0-9]{8}$)/,
    nid: /^\d{12}$|^\d{9}$/,
    password: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&~^\-+_\(\)]{6,}$/,
};

const ValidationErrMessage = {
    // Not found on database
    error_not_found_user: 'User not found',
    error_not_found_data: 'Data not found',
    error_not_found_fcmtoken: 'Fcm Token not found',
    error_not_found_notification: 'Notification not found',
    error_not_found_referral_code: 'Referral code not found',
    // Exist on database
    error_exist_user: 'User already exists',
    error_exist_phone: 'Phone number already exists',
    error_exist_nid: 'Nid number already exists',
    error_exist_email: 'Email already exists',
    error_exist_feedback: 'Feedback of this booking already exists',
    error_exist_refcode: 'Referrer and Referee both already exist',
    error_exist_wallet: 'Wallet already exists',
    error_exist_fcmtoken: 'Fcm Token already exists',
    error_exist_favorite_worker: 'Worker  already exists on list favorite',
    // Empty field
    error_empty_name: 'Name is required',
    error_empty_phone: 'Phone is required',
    error_empty_email: 'Email is required',
    error_empty_password: 'Password is required',
    error_empty_confirm_password: 'Confirm password is required',
    error_empty_otp: 'Otp is required',
    error_empty_address: 'Address is required',
    error_empty_working_place: 'Working Place is required',
    error_empty_skill: 'Skill is required',
    error_empty_star: 'Star is required',
    error_empty_fas_comment: 'Fas comment is required',
    error_empty_title_notification: 'Title is required',
    error_empty_desc_notification: 'Description is required',
    // Invalid format
    error_invalid_phone: 'Invalid phone number',
    error_invalid_nid: 'Invalid nid number',
    error_invalid_password: 'Invalid password',
    error_invalid_email: 'Invalid email',
    error_invalid_confirm_password: 'Invalid password',
    error_invalid_otp: 'Invalid OTP',
    // Incorrect Data
    error_incorrect_otp: 'Incorrect OTP',
    error_incorrect_phone_number_or_password: 'Incorrect phone number or password',
    error_incorrect_phone_number_or_pin: 'Incorrect phone number or pin',
    error_same_old_pin_new_pin: 'The old password cannot be the same as the new password',
    error_incorrect_pin: 'Incorrect pin',
    error_incorrect_old_password: 'Incorrect old password',
    // Specific error
    error_locked_phone_number: 'This phone number was locked for 60 minutes',
    error_not_match_confirm_password: 'Confirm password do not match',
    // Not active / Same data
    error_not_active_worker: 'This worker is not active',
    error_same_old_new_password: 'The old password and the new password cannot be the same',
};

const ValidationErrCode = {
    // Not found on database: start from 1000
    error_not_found_user: 1000,
    error_not_found_data: 1001,
    error_not_found_fcmtoken: 1002,
    error_not_found_notification: 1003,
    error_not_found_referral_code: 1004,
    // Exist on database: start from 2000
    error_exist_user: 2000,
    error_exist_phone: 2001,
    error_exist_nid: 2002,
    error_exist_email: 2003,
    error_exist_feedback: 2004,
    error_exist_refcode: 2005,
    error_exist_wallet: 2006,
    error_exist_fcmtoken: 2007,
    error_exist_favorite_worker: 2008,
    // Empty field: start from 3000
    error_empty_name: 3000,
    error_empty_phone: 3001,
    error_empty_email: 3002,
    error_empty_password: 3003,
    error_empty_confirm_password: 3004,
    error_empty_otp: 3005,
    error_empty_address: 3006,
    error_empty_working_place: 3007,
    error_empty_skill: 3008,
    error_empty_star: 3009,
    error_empty_fas_comment: 3010,
    error_empty_title_notification: 3011,
    error_empty_desc_notification: 3012,
    // Invalid format: start from 4000
    error_invalid_phone: 4000,
    error_invalid_nid: 4001,
    error_invalid_password: 4002,
    error_invalid_email: 4003,
    error_invalid_confirm_password: 4004,
    error_invalid_otp: 4005,
    // Incorrect Data: start from 5000
    error_incorrect_otp: 5000,
    error_incorrect_phone_number_or_password: 5001,
    error_incorrect_phone_number_or_pin: 5002,
    error_same_old_pin_new_pin: 5003,
    error_incorrect_pin: 5004,
    error_incorrect_old_password: 5005,
    // Specific error: start from 6000
    error_locked_phone_number: 6000,
    error_not_match_confirm_password: 6001,
    // Not active / Same data
    error_not_active_worker: 7000,
    error_same_old_new_password: 7001,
};

module.exports = { ValidationFormat, ValidationErrMessage, ValidationErrCode };
