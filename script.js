const filePath = "./countriesData.txt";
const outputFilePath = "./countries.js";
const fs = require('fs');

const readFile = async (path = filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const generateMap = async () => {
    const dataMap = [];

    try {
        const data = await readFile();
        const rows = data.toString().split("\n");
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split("\t");
            const countryName = row[0];
            const countryCode = row[1];
            const startsWith = countryCode.replace(/\D/g, '');
            const ISOCode = row[2].replace(/ \/[\S\s]*/, '');

            const outputString = `\t["${startsWith}", { country: "${countryName}", countryCode: "${countryCode}", startsWith: "${startsWith}", ISOCode: "${ISOCode}"}]`;
            dataMap.push(outputString);
        }

        return `export const countries = new Map([\n${dataMap.join(",\n")}\n]);`;
    } catch (err) {
        console.error('Error reading file:', err);
    }
};

const writeFile = async (path = outputFilePath) => {
    const data = await generateMap();
    await fs.writeFile(outputFilePath, data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
};

writeFile()


