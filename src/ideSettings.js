module.exports = {
    clion: {
        gitignore: [
            'cmake-build-debug/',
            'cmake-build-release/',
            '.idea/',
        ],
        managedCache: true,
    },
    other: {
        gitignore: [],
        managedCache: false,
        cacheSuggestion: 'build'
    }
};
