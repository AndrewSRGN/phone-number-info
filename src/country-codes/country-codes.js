const { getPhoneMaskByISOCode } = require("../utils/libphonenumber")
const { getNpaCodes } = require("../npa-areacodes/npa-areacodes");
const { readFile, writeFile } = require("../utils/fileUtils")

const filePath = "../data/raw/countriesData.txt";
const outputFilePath = "../data/internationalMask.js";

const getCountryCodes = async () => {
    const countryCodes = {};

    try {
        const data = await readFile(filePath);
        const rows = data.toString().split("\n");

        const npaCodes = await getNpaCodes();
        console.log(npaCodes);
        countryCodes[1] = {...npaCodes, value: {
                countryName: "United States",
                countryCode: "1",
                ISOCode: "US",
                mask: "+1 ###-###-####",
                image: "unitedStates.webp"
        }};

        for (let i = 2; i < rows.length; i++) {
            const row = rows[i].split("\t");
            const countryName = row[0];
            const countryCode = row[1];
            const startsWith = countryCode.replace(/\D/g, '');
            const ISOCode = row[2].replace(/ \/[\S\s]*/, '');

            const internationalMask = getPhoneMaskByISOCode(ISOCode);
            const image =
                countryName[0].toLowerCase()
                + countryName.replace(/ and /g, "").replace(/[\s/]/g, '').substring(1)
                + ".webp";

            const obj = {
                countryName,
                countryCode,
                ISOCode,
                mask: internationalMask,
                image
            };

            const firstDigit = (startsWith[0]);
            const secondDigit = (startsWith[1]);
            const thirdDigit = (startsWith[2]);

            if (!countryCodes[firstDigit]) {
                countryCodes[firstDigit] = {value: obj};
            }

            if (secondDigit) {
                if (!countryCodes[firstDigit][secondDigit]) {
                    countryCodes[firstDigit][secondDigit] = {value: obj};
                }
            }
            if (thirdDigit) {
                if (!countryCodes[firstDigit][secondDigit][thirdDigit]) {
                    countryCodes[firstDigit][secondDigit][thirdDigit] = {value: obj};
                }
            }
        }

        //return dataMap;
        return countryCodes;

    } catch (err) {
        console.error('Error reading file:', err);
    }
};

writeFile(getCountryCodes, outputFilePath);


