module.exports = subdirs => {
    return Object.keys(subdirs || {})
        .map(entry =>`add_subdirectory(${entry})`)
        .join('\n');
};
