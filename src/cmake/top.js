const formattedName = name => name.replace('-', '_');

module.exports = (config, folders) => {
        return `cmake_minimum_required(VERSION ${config.cmake})
set(CMAKE_CXX_STANDARD ${config.cpp})
project(${formattedName(config.projectName)})

add_subdirectory(${folders.src})
`
};
