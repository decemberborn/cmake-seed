const {expect} = require('chai');
const sut = require('../src/generator');
const fs = require('fs');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const rimraf = promisify(require('rimraf'));
const lstat = promisify(fs.lstat);
const output = 'test-output';
const path = require('path');

const getFsEntry = async (...dirs) => {
    const fullPath = path.join(...dirs);

    try {
        return lstat(fullPath);
    } catch(_) {
        return null;
    }
};

const folderExists = async (...entries) => {
    const entry = await getFsEntry(...entries);
    return entry && entry.isDirectory();
};

const fileExists = async (...entries) => {
    const entry = await getFsEntry(...entries);
    return entry && entry.isFile();
};

describe('generator tests', () => {
    beforeEach(async () => {
        await rimraf(output);
        await mkdir(output);
    });

    it('should create the project folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await folderExists(output, 'demo')).to.be.true;
    });

    it('should create a src folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await folderExists(output, 'demo', 'src')).to.be.true;
    });

    it('should create top-level gitignore', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await fileExists(output, 'demo', '.gitignore')).to.be.true;
    });

    it('should create top-level CMakeLists', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await fileExists(output, 'demo', 'CMakeLists.txt')).to.be.true;
    });

    it('should create a src/apps folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await folderExists(output, 'demo', 'src', 'apps')).to.be.true;
    });

    it('should create a src/libs folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await folderExists(output, 'demo', 'src', 'libs')).to.be.true;
    });

    it('should create a src/tests folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo'
        });

        expect(await folderExists(output, 'demo', 'src', 'tests')).to.be.true;
    });
});
