module.exports = () => {
    return {
        header: libName => {
            return `namespace ${libName} {
    void hello();
}`
        },

        impl: libName => {
            return `#include "lib.h"
#include <iostream>

void ${libName}::hello() {
    std::cout << "${libName}" << std::endl;
}`
        }
    };
};
