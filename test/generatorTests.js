const {expect} = require('chai');
const sut = require('../src/generator');
const fs = require('fs');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const rimraf = promisify(require('rimraf'));
const lstat = promisify(fs.lstat);
const output = 'test-output';
const path = require('path');
const readFile = promisify(fs.readFile);

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

const readLines = async (...entries) => {
    const content = await readFile(path.join(...entries), {encoding: 'utf8'});
    return content.split('\n');
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

    it('should set the version as the first line in top-level cmake', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            cmake: '3.12',
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[0]).to.equal('cmake_minimum_required(VERSION 3.12)');
    });

    it('should set the language standard as the second line in top-level cmake', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            cpp: '17'
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[1]).to.equal('set(CMAKE_CXX_STANDARD 17)');
    });

    it('sets default minimum version and standard if not specified', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[0]).to.equal('cmake_minimum_required(VERSION 3.0)');
        expect(lines[1]).to.equal('set(CMAKE_CXX_STANDARD 14)');
    });

    it('should set the project name as the third line in top-level cmake', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[2]).to.equal('project(demo)');
    });

    it('replaces - with _ in project names, but not in folder', async () => {
        await sut.run({
            root: output,
            projectName: 'my-demo',
        });

        expect(await folderExists(output, 'my-demo')).to.be.true;
        const lines = await readLines(output, 'my-demo', 'CMakeLists.txt');
        expect(lines[2]).to.equal('project(my_demo)');
    });

    it('should add an empty fourth line of the top-level cmake file for readability', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[3]).to.equal('');
    });

    it('should add src as the fifth line of the top-level cmake file', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'CMakeLists.txt');
        expect(lines[4]).to.equal('add_subdirectory(src)');
    });
});
