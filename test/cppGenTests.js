const {expect} = require('chai');
const cpp = require('../src/cpp');

describe('cpp gen tests', () => {
    it('should include dependency files', async () => {
        const lib = cpp({
            applications: {
                'pelle': {
                    dependencies: [
                        'kalle'
                    ]
                }
            }
        }, {
            libEntryPoint: {
                header: 'lib.h',
                impl: 'lib.cpp'
            }
        }).main('pelle');

        expect(lib).to.contain('#include <kalle/lib.h>');
    });

    it('should call lib functions', async () => {
        const lib = cpp({
            applications: {
                'pelle': {
                    dependencies: [
                        'kalle'
                    ]
                }
            }
        }, {
            libEntryPoint: {
                header: 'lib.h',
                impl: 'lib.cpp'
            }
        }).main('pelle');

        expect(lib).to.contain('kalle::hello();');
    });
});
