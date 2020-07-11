const libType = require('./libType');
const libName = type => type === libType.shared ? 'SHARED' : 'STATIC';

module.exports = ({name, files, libType}) => `add_library(
    ${name} ${libName(libType)}
    ${files.libEntryPoint}
)
`;
