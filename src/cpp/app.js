const includeList = (appName, {applications}, {libEntryPoint}) => {
    const deps = (applications[appName].dependencies || [])
        .map(dep => `#include <${dep}/${libEntryPoint.header}>`);
    return [ ...deps, '#include <iostream>' ].join('\n');
};

const printoutList = (appName, {applications}) => {
    const deps = applications[appName].dependencies || [];

    if (deps.length === 0) {
        return '';
    }

    return [
        '    std::cout << "I have the following dependencies:" << std::endl;',
        ...deps.map(dep => `    ${dep}::hello();`)
    ].join('\n');
};

module.exports = (options, files) => {
    return appName => {
        return `${includeList(appName, options, files)}

int main(int argc, char *argv[]) {
    std::cout << "Hello from '${appName}'" << std::endl;
${printoutList(appName, options)}
    return 0;
}
`;
    }
};
