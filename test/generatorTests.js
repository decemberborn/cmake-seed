const {expect} = require('chai');
const sut = require('../src/generator');
const fs = require('fs');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const rimraf = promisify(require('rimraf'));
const output = 'test-output';
const path = require('path');
const readFile = promisify(fs.readFile);
const cpp = require('../src/cpp');
const cmakeGen = require('../src/cmake');
const libType = require('../src/cmake/libType');
const {folderExists, fileExists, readLines} = require('./helpers');

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

    it('should create gitignore with correct entries', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            gitignore: [
                'a', 'b', 'c'
            ]
        });

        const lines = await readLines(output, 'demo', '.gitignore');
        expect(lines[0]).to.equal('a');
        expect(lines[1]).to.equal('b');
        expect(lines[2]).to.equal('c');
    });

    it('should create the source-level cmake file', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        await fileExists(output, 'demo', 'src', 'CMakeLists.txt');
    });

    it('adds the lib folder to cmake', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'src', 'CMakeLists.txt');
        expect(lines[0]).to.equal('add_subdirectory(libs)');
    });

    it('adds the apps folder to cmake', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        const lines = await readLines(output, 'demo', 'src', 'CMakeLists.txt');
        expect(lines[1]).to.equal('add_subdirectory(apps)');
    });

    it('should create a cmake file in the libs folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        await fileExists(output, 'demo', 'src', 'libs', 'CMakeLists.txt');
    });

    it('should create a cmake file in the apps folder', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
        });

        await fileExists(output, 'demo', 'src', 'apps', 'CMakeLists.txt');
    });

    it('should create a folder for each lib', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {
                    type: libType.static
                },
                'pelle': {
                    type: libType.static
                }
            }
        });

        await folderExists(output, 'demo', 'src', 'libs', 'kalle');
        await folderExists(output, 'demo', 'src', 'libs', 'pelle');
    });

    it('should create a folder for each app', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
                'pelle': {}
            }
        });

        await folderExists(output, 'demo', 'src', 'apps', 'kalle');
        await folderExists(output, 'demo', 'src', 'apps', 'pelle');
    });

    it('should add the folders for each library item', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {},
                'pelle': {}
            }
        });

        const lines = await readLines(output, 'demo', 'src', 'libs', 'CMakeLists.txt');
        expect(lines[0]).to.equal('add_subdirectory(kalle)');
        expect(lines[1]).to.equal('add_subdirectory(pelle)');
    });

    it('should add the folders for each application item', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
                'pelle': {}
            }
        });

        const lines = await readLines(output, 'demo', 'src', 'apps', 'CMakeLists.txt');
        expect(lines[0]).to.equal('add_subdirectory(kalle)');
        expect(lines[1]).to.equal('add_subdirectory(pelle)');
    });

    it('should add a cmake file for each application', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
                'pelle': {}
            }
        });


        await fileExists(output, 'demo', 'src', 'apps', 'kalle', 'CMakeLists.txt');
        await fileExists(output, 'demo', 'src', 'apps', 'pelle', 'CMakeLists.txt');
    });

    it('adds a main.cpp to each app', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
                'pelle': {}
            }
        });


        await fileExists(output, 'demo', 'src', 'apps', 'kalle', 'main.cpp');
        await fileExists(output, 'demo', 'src', 'apps', 'pelle', 'main.cpp');
    });

    it('contains the correct cpp template in applications', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
                'pelle': {}
            }
        };

        await sut.run(opt);

        const mainCpp = path.join(output, 'demo', 'src', 'apps', 'kalle', 'main.cpp');
        const content = await readFile(mainCpp, {encoding: 'utf8'});
        expect(content).to.equal(cpp.main('kalle'));
    });

    it('should add the main entry point in application cmake files', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            applications: {
                'kalle': {},
            }
        };

        await sut.run(opt);

        const cmakePath = path.join(output, 'demo', 'src', 'apps', 'kalle', 'CMakeLists.txt');
        const content = await readFile(cmakePath, {encoding: 'utf8'});
        const cmake = cmakeGen(opt, {}, { appEntryPoint: 'main.cpp' });
        expect(content).to.equal(cmake.app('kalle'));
    });

    it('should add a cmake file for each library', async () => {
        await sut.run({
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {},
                'pelle': {}
            }
        });


        await fileExists(output, 'demo', 'src', 'libs', 'kalle', 'CMakeLists.txt');
        await fileExists(output, 'demo', 'src', 'libs', 'pelle', 'CMakeLists.txt');
    });

    it('contains the correct cpp impl in libraries', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {},
            }
        };

        await sut.run(opt);

        const libCpp = path.join(output, 'demo', 'src', 'libs', 'kalle', 'lib.cpp');
        const content = await readFile(libCpp, {encoding: 'utf8'});
        expect(content).to.equal(cpp.lib.impl('kalle'));
    });

    it('contains the correct cpp header in libraries', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {},
            }
        };

        await sut.run(opt);

        const libCpp = path.join(output, 'demo', 'src', 'libs', 'kalle', 'lib.h');
        const content = await readFile(libCpp, {encoding: 'utf8'});
        expect(content).to.equal(cpp.lib.header('kalle'));
    });

    it('should add the main entry point in library cmake files', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {
                    type: libType.static
                },
            }
        };

        await sut.run(opt);

        const cmakePath = path.join(output, 'demo', 'src', 'libs', 'kalle', 'CMakeLists.txt');
        const content = await readFile(cmakePath, {encoding: 'utf8'});
        const cmake = cmakeGen(opt, {}, { libEntryPoint: { impl: 'lib.cpp', header: 'lib.h' } });
        expect(content).to.equal(cmake.lib('kalle'));
    });

    it('should be possible to specify shared libs', async () => {
        const opt = {
            root: output,
            projectName: 'demo',
            libraries: {
                'kalle': {
                    type: libType.shared
                },
            }
        };

        await sut.run(opt);

        const cmakePath = path.join(output, 'demo', 'src', 'libs', 'kalle', 'CMakeLists.txt');
        const content = await readFile(cmakePath, {encoding: 'utf8'});
        const cmake = cmakeGen(opt, {}, { libEntryPoint: { impl: 'lib.cpp', header: 'lib.h'} });
        expect(content).to.equal(cmake.lib('kalle'));
    });
});
