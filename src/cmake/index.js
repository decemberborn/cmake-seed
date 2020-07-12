module.exports = (options, folders, files) => {
    return {
        top: () => require('./top')(options, folders),
        src: () => require('./src')(options, folders),
        libs: () => require('./libs')(options, folders),
        apps: () => require('./apps')(options),
        app: name => require('./app')({ name, options, folders, files}),
        lib: name => require('./lib')({ name, options, folders, files})
    }
};
