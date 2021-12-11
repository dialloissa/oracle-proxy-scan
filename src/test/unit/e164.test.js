const e164 = require('../../lib/e164');

describe('e164 validation', () => {
    test('should be true on a mobile number', () => {
        const evaluation = e164('212958769');
        expect(evaluation).toEqual(true);
    });

    test('should be false on a non mobile input', () => {
        const evaluation = e164('a12345');
        expect(evaluation).toEqual(false);
    });
});
