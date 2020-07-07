module.exports = (options, folders) => {
    return {
        topLevel: () => require('./topLevel')(options, folders),
        srcLevel: () => require('./srcLevel')(options, folders),
    }
};
