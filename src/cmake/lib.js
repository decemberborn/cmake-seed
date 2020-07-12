const libType = require('./libType');
const libTypeName = type => type === libType.shared ? 'SHARED' : 'STATIC';

module.exports = ({name, options: { libraries }, files}) => `add_library(
    ${name} ${libTypeName(libraries[name].type)}
    ${files.libEntryPoint.impl}
    ${files.libEntryPoint.header}
)
`;
