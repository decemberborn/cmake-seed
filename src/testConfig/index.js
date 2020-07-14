const testType = require('./testType');

const configs = {
    [testType.none]: () => {},
    [testType.gtest]: require('./gtestConfig')
};

module.exports = (type, options) => {
    return configs[type](options);
};
