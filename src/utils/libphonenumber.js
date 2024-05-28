const libphonenumber = require('google-libphonenumber');
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const PhoneNumberFormat = libphonenumber.PhoneNumberFormat;
const PhoneNumberType = libphonenumber.PhoneNumberType;

function getPhoneMaskByISOCode(countryCode) {
    try {
        const exampleNumber = phoneUtil.getExampleNumberForType(countryCode, PhoneNumberType.MOBILE);
        const formattedNumber = phoneUtil.format(exampleNumber, PhoneNumberFormat.INTERNATIONAL);

        return formattedNumber.replaceAll(/\d(?<!\+\d*)/g, '#');
    } catch (error) {
        console.error(`Error getting phone mask for ${countryCode}:`, error);
        return null;
    }
}

module.exports = {
    getPhoneMaskByISOCode
}