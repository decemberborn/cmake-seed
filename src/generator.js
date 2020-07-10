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
    appEntryPoint: 'main.cpp'
};

const createApps = async (options, paths, cmake) => {
    const appNames = Object.keys(options.applications || {});
    await Promise.all(appNames.map(async entry => {
        const entryPath = join(paths.apps, entry);
        await mkdirp(entryPath);
        await Promise.all([
            writeFile(join(entryPath, 'CMakeLists.txt'), cmake.app(entry), 'utf8'),
            writeFile(join(entryPath, files.appEntryPoint), cppGen.main(entry), 'utf8'),
        ]);
    }));
};

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

    // Create library folders
    const libNames = Object.keys(options.libraries || {});
    await Promise.all(libNames.map(entry => mkdirp(join(paths.libs, entry))));

    // Create app folders
    await createApps(options, paths, cmake);

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
