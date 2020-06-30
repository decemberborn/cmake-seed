const {join} = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);

const defaultOptions = {
    root: '.'
};

const srcFolder = 'src';
const appsFolder = 'apps';
const libsFolder = 'libs';

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

    await writeFile(join(paths.project, '.gitignore'), '', 'utf8');
    await writeFile(join(paths.project, 'CMakeLists.txt'), '', 'utf8');
};

module.exports = {
    async run(opt) {
        const options = {
            ...defaultOptions,
            ...opt
        };

        await createFolderStructure(options);
    }
};
