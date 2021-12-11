const request = require('supertest');
const axios = require('axios');
const support = require('../_support');

axios.get = jest.fn().mockImplementationOnce(() => Promise.resolve({
    status: 200,
    data: {
        partyList: [
            {
                fspId: 'payerfsp',
                currency: 'EUR',
            },
            {
                fspId: 'payerfsp',
                currency: 'USD',
            },
            {
                fspId: 'payerfsp',
                currency: 'XOF',
            },
        ],
    },
    ok: true,
})).mockImplementationOnce(() => Promise.reject(new Error('Error')));

let server;

const config = {
    moroccoOrangeFspId: 'moroccoOrange',
};

beforeEach(async () => {
    server = support.createServer({ config });
});

afterEach(async () => {
    server.close();
});

const defaultMoroccoResponse = (fspId) => ({
    partyList: ['MAD', 'EUR'].map((currency) => ({ fspId, currency })),
});

describe('GET /participants/MSISDN/:id', () => {
    test('should response with a pathfinder partyList ', async () => {
        const response = await request(server)
            .get('/participants/MSISDN/22503312142/');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            partyList: [
                {
                    fspId: 'payerfsp',
                    currency: 'EUR',
                },
                {
                    fspId: 'payerfsp',
                    currency: 'USD',
                },
                {
                    fspId: 'payerfsp',
                    currency: 'XOF',
                },
            ],
        });
    });

    test('returns configured Morocco Orange and MAD, EUR currencies', async () => {
        const response = await request(server)
            .get('/participants/MSISDN/21203312142');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(defaultMoroccoResponse(config.moroccoOrangeFspId));
    });

    test('returns configured Morocco Orange and MAD, EUR, queried currency', async () => {
        const currency = 'XOF';
        const response = await request(server)
            .get(`/participants/MSISDN/21203312142?currency=${currency}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            partyList: [
                ...defaultMoroccoResponse(config.moroccoOrangeFspId).partyList,
                { fspId: config.moroccoOrangeFspId, currency },
            ],
        });
    });

    test('returns configured Morocco Orange and MAD, EUR, queried currencies', async () => {
        const response = await request(server)
            .get('/participants/MSISDN/21203312142?currency=USD&currency=ZAR');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            partyList: [
                ...defaultMoroccoResponse(config.moroccoOrangeFspId).partyList,
                { fspId: config.moroccoOrangeFspId, currency: 'USD' },
                { fspId: config.moroccoOrangeFspId, currency: 'ZAR' },
            ],
        });
    });

    test('returns configured Morocco Orange and MAD, EUR, queried currencies - no duplicates', async () => {
        const response = await request(server)
            .get('/participants/MSISDN/21203312142?currency=USD&currency=EUR');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            partyList: [
                ...defaultMoroccoResponse(config.moroccoOrangeFspId).partyList,
                { fspId: config.moroccoOrangeFspId, currency: 'USD' },
            ],
        });
    });
});
