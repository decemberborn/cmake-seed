const linkLibs = (name, options) => {
    const deps = options.applications[name].dependencies;

    if (!deps) return '';

    return `target_link_libraries(${name} ${deps.join(' ')})`
};

module.exports = ({name, options, files}) => {
    return `add_executable(
    ${name}
    ${files.appEntryPoint}
)

${linkLibs(name, options)}
`;
};
