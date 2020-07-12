module.exports = {
    main: appName => {
        return `#include <iostream>

int main(int argc, char *argv[]) {
    std::cout << "Hello from '${appName}'" << std::endl;
    return 0;
}
`;
    },

    lib: {
        impl: libName => {
            return `// todo for ${libName}`
        },

        header: libName => {
            return `// todo for ${libName}`
        }
    }
};
