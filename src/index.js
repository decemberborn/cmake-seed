const {prompt, NumberPrompt} = require('enquirer');
const generator = require('./generator');
const {defaultOptions} = generator;
const ideSettings = require('./ideSettings');

async function collect(countQuestion, collectQuestion) {
    console.log();

    const numPrompt = await new NumberPrompt({
        type: 'input',
        name: 'count',
        message: countQuestion
    });

    const count = await numPrompt.run({
        min: 1
    });

    return Object.values(await prompt([...Array(count).keys()].map(i => ({
        type: 'input',
        name: `app_${i}`,
        message: `${collectQuestion} (${i+1}/${count})`
    }))));
}

async function collectLibs() {
    return collect(
        'How many static libraries do you want?',
        'Name of library');
}

async function collectApplications() {
    return collect(
        'How many executable applications do you want?',
        'Name of application');
}

(async () => {
    const initialResponse = await prompt([
        {
            type: 'input',
            name: 'projectName',
            default: defaultOptions.projectName,
            message: 'What\'s the name of your project?'
        },
        {
            type: 'select',
            name: 'cpp',
            choices: [
                { message: 'c++11', name: '11' },
                { message: 'c++14', name: '14' },
                { message: 'c++17', name: '17' },
                { message: 'c++20', name: '20' },
            ],
            message: 'Which C++ standard do you want to use?'
        },
        {
            type: 'input',
            name: 'cmake',
            default: defaultOptions.cmake,
            message: 'Which CMake version do you want to use?'
        },
        {
            type: 'select',
            name: 'ide',
            choices: [
                { message: 'CLion', name: 'clion' },
                { message: 'Other', name: 'other' }
            ],
            message: 'Which environment do you use?'
        }
    ]);

    const ide = ideSettings[initialResponse.ide];
    const secondaryResponse = ide.managedCache
        ? { cache: '' }
        : await prompt({
            type: 'input',
            name: 'cache',
            default: ide.cacheSuggestion,
            message: 'Which folder will you use for the CMake cache?'
        });

    const gitignore = [
        ...ide.gitignore,
        secondaryResponse.cache,
    ];

    console.log();
    await prompt({
        type: 'select',
        choices: [ 'Continue' ],
        message: `Next, I\'ll need to know which applications and libraries
you want as part of your project. After you\'ve filled
this out, I\'ll ask for more information to setup linkage`
    });

    const applications = await collectApplications();
    const libraries = await collectLibs();

    console.log(applications);
    console.log(libraries);

    generator.run({
        ...initialResponse,
        gitignore
    });
})();
