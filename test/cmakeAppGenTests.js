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
});
