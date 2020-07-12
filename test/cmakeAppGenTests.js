const {expect} = require('chai');
const cmakeGen = require('../src/cmake');

describe('cmake app gen tests', () => {
    it('should link dependencies to apps correctly', async () => {
        const sut = cmakeGen({
            applications: {
                'pelle': {
                    dependencies: [
                        'kalle',
                        'nisse'
                    ]
                }
            }
        }, {}, {});

        const app = sut.app("pelle");
        expect(app).to.contain('target_link_libraries(pelle kalle nisse)');
    });

    it('should add expected lib include dir', async () => {
        const sut = cmakeGen({
            applications: {
                'pelle': {
                    dependencies: [
                        'kalle'
                    ]
                }
            }
        }, {
            libs: 'libs',
        }, {
            libEntryPoint: { impl: 'lib.cpp', header: 'lib.h' }
        });

        const lib = sut.app("pelle");
        expect(lib).to.contain('include_directories(${CMAKE_SOURCE_DIR}/src/libs)');
    });

    it('does not add lib include path if no dependencies', async () => {
        const sut = cmakeGen({
            applications: {
                'pelle': {
                    dependencies: []
                }
            }
        }, {
            libs: 'libs',
        }, {
            libEntryPoint: { impl: 'lib.cpp', header: 'lib.h' }
        });

        const lib = sut.app("pelle");
        expect(lib).to.not.contain('include_directories(${CMAKE_SOURCE_DIR}/src/libs)');
    });
});
