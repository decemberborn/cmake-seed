module.exports = ({name, files}) => `add_library(
    ${name} STATIC
    ${files.libEntryPoint}
)
`;
