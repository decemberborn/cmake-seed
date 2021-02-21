module.exports = (config, folders) => {
        return `add_subdirectory(${folders.libs})
add_subdirectory(apps)
${config.tests && `add_subdirectory(${folders.tests})`}
`
};
