const moroccanNumber = require('../../lib/moroccanNumber');

describe('moroccanNumber validation', () => {
    test('should be true on a moroccan number', () => {
        const evaluation = moroccanNumber('212958769');
        expect(evaluation).toEqual(true);
    });

    test('should be false on a non moroccan number', () => {
        const evaluation = moroccanNumber('225958769');
        expect(evaluation).toEqual(false);
    });
});
