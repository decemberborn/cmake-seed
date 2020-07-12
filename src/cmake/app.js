const linkLibs = (name, options) => {
    const deps = options.applications[name].dependencies;

    if (!deps) return '';

    return `target_link_libraries(${name} ${deps.join(' ')})`
};

const includeDirs = (name, options) => {
    const deps = options.applications[name].dependencies;

    if (!deps || deps.length === 0) return '';

    return 'include_directories(${CMAKE_SOURCE_DIR}/src/libs)';
};

module.exports = ({name, options, files}) => {
    return `add_executable(
    ${name}
    ${files.appEntryPoint}
)

${linkLibs(name, options)}
${includeDirs(name, options)}
`;
};
