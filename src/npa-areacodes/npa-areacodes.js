const { getPhoneMaskByISOCode } = require("../utils/libphonenumber");
const { readFile, writeFile } = require("../utils/fileUtils")
const ISOCodes = require("../data/ISOCodes");

const path = require("path");

const filePath = "../data/raw/npa_report.csv";
const outputFilePath = "../data/npaCodes.js";

const getNpaCodes = async () => {
    const npaCodes = {};

    try {
        const data = await readFile(filePath);
        const lines = data.toString().split('\n');

        const headersIndex = getHeadersIndex(lines[0]);

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');

            const startsWith = values[headersIndex.get("NPA_ID")];

            const countryName = stringToTitleCase(values[headersIndex.get("COUNTRY")]);
            if (!countryName) {
                continue;
            }
            const areaCode = values[headersIndex.get("NPA_ID")];
            const ISOCode = ISOCodes.get(countryName);
            const mask = getPhoneMaskByISOCode(ISOCode);
            const image = countryName[0].toLowerCase()
                + countryName.replace(/ and /g, "").replace(/[\s/]/g, '').substring(1)
                + ".webp";

            const obj = {
                countryName,
                countryCode: `1 ${areaCode}`,
                ISOCode,
                mask,
                image,
            };

            const firstDigit = (startsWith[0]);
            const secondDigit = (startsWith[1]);
            const thirdDigit = (startsWith[2]);

            if (!npaCodes[firstDigit]) {
                npaCodes[firstDigit] = {value: obj};
            }

            if (secondDigit) {
                if (!npaCodes[firstDigit][secondDigit]) {
                    npaCodes[firstDigit][secondDigit] = {value: obj};
                }
            }
            if (thirdDigit) {
                if (!npaCodes[firstDigit][secondDigit][thirdDigit]) {
                    npaCodes[firstDigit][secondDigit][thirdDigit] = {value: obj};
                }
            }
        }
    } catch (err) {
        console.error('Error reading file:', err);
    }

    return npaCodes;
};

function stringToTitleCase(str) {
    if (!str) return;
    if (str === "US") return "United States";
    if (str.length === 2) return str.toUpperCase();

    const lowerCaseString = str.toLowerCase();
    const regex = /\w\S*/g;

    return lowerCaseString.replace(regex, (word) => word[0].toUpperCase() + word.slice(1));
}

function getHeadersIndex( header ) {
    const values = header.split(',');

    const headers = new Map();

    for (let j = 0; j < values.length; j++) {
        switch (values[j]) {
            case "NPA_ID":
                headers.set(values[j], j);
                break;
            case "LOCATION":
                headers.set(values[j], j);
                break;
            case "COUNTRY":
                headers.set(values[j], j);
                break;
            default:
                break;
        }
    }

    return headers;
}

writeFile(getNpaCodes, outputFilePath);

module.exports = {
    getNpaCodes
}