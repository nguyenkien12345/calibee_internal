const otpGenerator = require('otp-generator');

const Generate = {
    onGenerateOTP: () => {
        let newOtp = otpGenerator.generate(4, {
            digits: true,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });
        return newOtp;
    },

    onMakeid: (length) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
};

module.exports = Generate;
