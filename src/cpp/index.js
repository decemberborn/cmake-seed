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
        header: libName => {
            return `namespace ${libName} {
    void hello();
}`
        },

        impl: libName => {
            return `#include "lib.h"
#include <iostream>

// ${libName} entry point
void ${libName}::hello_world() {
    std::cout << ${libName} << std::endl;
}`
        }
    }
};
