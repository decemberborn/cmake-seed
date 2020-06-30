const {prompt} = require('enquirer');
const generator = require('./generator');
const {defaultOptions} = generator;

(async () => {
    const response = await prompt([
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
            default: '3.0',
            message: 'Which CMake version do you want to use?'
        }
    ]);

    console.log(response);
    generator.run(response);
})();
