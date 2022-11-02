const Crypto = require('crypto');

const SECRET_KEY = 'DEVWOLFSOLUTIONSHOCHIMINH';
const SECRET_IV = 'HOCHIMINHDEVWOLFSOLUTIONS';
const ENCRYPTION_METHOD = 'AES-256-CBC';

const key = Crypto.createHash('sha512').update(SECRET_KEY, 'utf-8').digest('hex').substr(0, 32);
const iv = Crypto.createHash('sha512').update(SECRET_IV, 'utf-8').digest('hex').substr(0, 16);

const onEncryptData = (data, encryptionMethod, secret, iv) => {
    let encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
    let aes_encrypted = encryptor.update(data, 'utf8', 'base64') + encryptor.final('base64'); // convert to base 64
    return Buffer.from(aes_encrypted).toString('base64');
};

const onDecryptData = (data, encryptionMethod, secret, iv) => {
    let buff = Buffer.from(data, 'base64'); // get base 64 string
    data = buff.toString('utf-8'); // convert to string
    let decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
    return decryptor.update(data, 'base64', 'utf8') + decryptor.final('utf8'); // return decrypt one
};

const encrypt_data = (data) => {
    return onEncryptData(data, ENCRYPTION_METHOD, key, iv);
};

const decrypt_data = (data) => {
    return onDecryptData(data, ENCRYPTION_METHOD, key, iv);
};

module.exports = { encrypt_data, decrypt_data };
