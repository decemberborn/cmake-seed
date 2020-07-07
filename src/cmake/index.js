module.exports = (options, folders) => {
    return {
        top: () => require('./top')(options, folders),
        src: () => require('./src')(options, folders),
        libs: () => require('./libs')(options, folders),
        apps: () => require('./apps')(options, folders),
    }
};
