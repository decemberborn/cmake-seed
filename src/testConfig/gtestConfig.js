const fetch = require('node-fetch');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const pipeline = promisify(require('stream').pipeline);
const AdmZip = require('adm-zip');
const mkdirp = require('mkdirp');
const path = require('path');
const writeFile = promisify(fs.writeFile);

module.exports = ({paths, cmake, cpp}) => ({
    async init() {
        console.log('fetching gtest');
        const url = 'https://github.com/google/googletest/archive/v1.10.x.zip';
        const result = await fetch(url);
        const extPath = paths.external;
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
        await promisify(fs.rename)(oldPath, newPath);

        await writeFile(path.join(paths.tests, 'CMakeLists.txt'), cmake.gtest(), 'utf8');
        await writeFile(path.join(paths.tests, 'my_test.cpp'), cpp.gtest(), 'utf8');
    }
});
