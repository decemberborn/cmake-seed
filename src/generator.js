const {join} = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const cmakeGen = require('./cmake');
const cppGen = require('./cpp');

const defaultOptions = {
    root: '.',
    projectName: 'untitled',
    cmake: '3.0',
    cpp: '14',
    gitignore: [],
};

const folders = {
    src: 'src',
    apps: 'apps',
    libs: 'libs',
    tests: 'tests'
};

const files = {
    appEntryPoint: 'main.cpp',
    libEntryPoint: 'lib.cpp'
};

const createArtifacts = async (artifacts, rootPath, files) => {
    const names = Object.keys(artifacts || {});
    await Promise.all(names.map(async entry => {
        const entryPath = join(rootPath, entry);
        await mkdirp(entryPath);
        await Promise.all(files.map(f => writeFile(join(entryPath, f.name), f.content(entry), 'utf8')));
    }));
};

const createLibs = async (options, paths, cmake) =>
    createArtifacts(options.libraries, paths.libs, [
        { name: 'CMakeLists.txt', content: entry => cmake.lib(entry) },
        { name: files.libEntryPoint, content: entry => cppGen.lib(entry) }
    ]);

const createApps = async (options, paths, cmake) =>
    createArtifacts(options.applications, paths.apps, [
        { name: 'CMakeLists.txt', content: entry => cmake.app(entry) },
        { name: files.appEntryPoint, content: entry => cppGen.main(entry) }
    ]);

const createFolderStructure = async (options) => {
    const paths = {
        project: join(options.root, options.projectName),
        get src() { return join(this.project, folders.src); },
        get apps() { return join(this.src, folders.apps); },
        get libs() { return join(this.src, folders.libs); },
        get tests() { return join(this.src, folders.tests); },
    };

    await mkdirp(paths.apps);
    await mkdirp(paths.libs);
    await mkdirp(paths.tests);

    const cmake = cmakeGen(options, folders, files);

    await Promise.all([
        createLibs(options, paths, cmake),
        createApps(options, paths, cmake)
    ]);

    await writeFile(join(paths.project, '.gitignore'), options.gitignore.join('\n'), 'utf8');
    await writeFile(join(paths.project, 'CMakeLists.txt'), cmake.top(), 'utf8');
    await writeFile(join(paths.src, 'CMakeLists.txt'), cmake.src(), 'utf8');
    await writeFile(join(paths.libs, 'CMakeLists.txt'), cmake.libs(), 'utf8');
    await writeFile(join(paths.apps, 'CMakeLists.txt'), cmake.apps(), 'utf8');
};

module.exports = {
    async run(opt) {
        const options = {
            ...defaultOptions,
            ...opt
        };

        await createFolderStructure(options);
    },

    defaultOptions
};
