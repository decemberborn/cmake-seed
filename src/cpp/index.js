module.exports = (options, files) => ({
    main: require('./app')(options, files),
    lib: require('./lib')(),
    gtest: require('./gtest')()
});
