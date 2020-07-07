const formattedName = name => name.replace('-', '_');

module.exports = (config, folders) => {
        return `add_subdirectory(${folders.libs})`
};
