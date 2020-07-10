module.exports = ({name, files}) => `add_executable(
    ${name}
    ${files.appEntryPoint}
)
`;
