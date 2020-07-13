const testType = require('./testType');

const configs = {
    [testType.none]: () => {},
    [testType.gtest]: () => {}
};

module.exports = type => {
    return configs[type]();
};
