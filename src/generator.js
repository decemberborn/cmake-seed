const {join} = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const cmakeGen = require('./cmake');

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

    // Create library folders
    const libNames = Object.keys(options.libraries || {});
    await Promise.all(libNames.map(entry => mkdirp(join(paths.libs, entry))));

    const cmake = cmakeGen(options, folders);
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
