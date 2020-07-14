const fetch = require('node-fetch');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const pipeline = promisify(require('stream').pipeline);
const AdmZip = require('adm-zip');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = ({paths}) => ({
    async init() {
        console.log('fetching gtest');
        const url = 'https://github.com/google/googletest/archive/v1.10.x.zip';
        const result = await fetch(url);
        const extPath = path.join(paths.project, 'external');
        await mkdirp(extPath);
        const zipPath = path.join(extPath, 'googletest.zip');
        await pipeline(result.body, fs.createWriteStream(zipPath));

        const zip = new AdmZip(zipPath);

        console.log('extracting gtest');

        await promisify(zip.extractAllToAsync)(extPath, true);

        const oldPath = path.join(extPath, 'googletest-1.10.x');
        const newPath = path.join(extPath, 'googletest');

        await rimraf(newPath);
        await promisify(fs.unlink)(zipPath);
        return promisify(fs.rename)(oldPath, newPath);
    }
});
