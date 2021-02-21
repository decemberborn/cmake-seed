module.exports = ({ options: { libraries } }) => {
    return `set(GTEST_BASE \${CMAKE_SOURCE_DIR}/external/googletest)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

add_subdirectory(
        \${GTEST_BASE}
        \${CMAKE_CURRENT_BINARY_DIR}/googletest-build
        EXCLUDE_FROM_ALL)

include_directories(
        \${CMAKE_SOURCE_DIR}/src/libs
)

add_executable(tests my_test.cpp)
target_link_libraries(tests ${Object.keys(libraries).join(' ')} gtest_main)
    `
};
