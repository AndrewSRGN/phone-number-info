const fs = require('fs');

const readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {err ? reject(err) : resolve(data);});
    });
};

const writeFile = async (getData, path) => {
    const data = await getData();
    const json = JSON.stringify(data, null ,4);
    await fs.writeFile(path, json, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
};

module.exports = { readFile, writeFile }