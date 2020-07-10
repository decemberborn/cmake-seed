module.exports = (config, folders) => {
        return `add_subdirectory(${folders.libs})
add_subdirectory(apps)
`
};
