const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);
const path = require('path');

const getFsEntry = async (...dirs) => {
    const fullPath = path.join(...dirs);

    try {
        return lstat(fullPath);
    } catch(_) {
        return null;
    }
};

module.exports = {
    folderExists: async (...entries) => {
        const entry = await getFsEntry(...entries);
        return entry && entry.isDirectory();
    },

    fileExists: async (...entries) => {
        const entry = await getFsEntry(...entries);
        return entry && entry.isFile();
    },

    readLines: async (...entries) => {
        const content = await readFile(path.join(...entries), {encoding: 'utf8'});
        return content.split('\n');
    }
};
