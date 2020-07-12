const {expect} = require('chai');
const cmakeGen = require('../src/cmake');
const libType = require('../src/cmake/libType');

describe('cmake lib gen tests', () => {
    it('should use "STATIC" when creating static libs', async () => {
        const sut = cmakeGen({
            libraries: {
                'pelle': {
                    type: libType.static
                }
            }
        }, {}, { libEntryPoint: {} });

        const lib = sut.lib("pelle");
        expect(lib).to.contain('STATIC');
    });

    it('should use "SHARED" when creating shared/dynamic libs', async () => {
        const sut = cmakeGen({
            libraries: {
                'pelle': {
                    type: libType.shared
                }
            }
        }, {}, { libEntryPoint: {} });

        const lib = sut.lib("pelle");
        expect(lib).to.contain('SHARED');
    });

    it('should default to "STATIC"', async () => {
        const sut = cmakeGen({
            libraries: {
                'pelle': {}
            }
        }, {}, { libEntryPoint: {} });

        const lib = sut.lib("pelle");
        expect(lib).to.contain('STATIC');
    });

    it('should include header and cpp files', async () => {
        const sut = cmakeGen({
            libraries: {
                'pelle': {}
            }
        }, {}, { libEntryPoint: { impl: 'lib.cpp', header: 'lib.h' } });

        const lib = sut.lib("pelle");
        expect(lib).to.contain('lib.cpp');
        expect(lib).to.contain('lib.h');
    });
});
