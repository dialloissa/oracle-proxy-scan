const axios = require('axios');
const e164 = require('../lib/e164');
const moroccanNumber = require('../lib/moroccanNumber');

const handler = (router, routesContext) => {
    router.get('/participants/:type/:id', async (ctx, next) => {
        const alsHeaders = ctx.request.header;
        const requestType = ctx.params.type;
        const requestQuery = ctx.request.querystring;
        const requestPath = ctx.request.path;
        const requestId = ctx.params.id;
        if (requestType !== 'MSISDN') {
            ctx.response.status = 405;
            return next();
        }
        if (!e164(requestId)) {
            ctx.response.status = 400;
            return next();
        }
        if (moroccanNumber(requestId)) {
            try {
                routesContext.log('Making request to Moroccos API');
                // TODO: Implement connection to Moroccos API
                // await axios.get(
                // `${routesContext.config.moroccosApi}/participants/${requestType}/${requestId}`,
                // { headers: alsHeaders });
                const currencies = [...new Set([
                    'MAD',
                    'EUR',
                    ...ctx.request.URL.searchParams.getAll('currency'),
                ]).keys()];
                const fspId = routesContext.config.moroccoOrangeFspId;
                ctx.response.body = {
                    partyList: currencies.map((currency) => ({ fspId, currency })),
                };
                ctx.response.status = 200;
            } catch (err) {
                routesContext.log(err);
                ctx.response.status = 500;
            }
        } else { // Redirect to Pathfinder
            const pathfinderURL = requestQuery
                ? `${routesContext.config.pathfinderEndpoint}:${routesContext.config.pathfinderPort}${requestPath}?${requestQuery}`
                : `${routesContext.config.pathfinderEndpoint}:${routesContext.config.pathfinderPort}${requestPath}`;
            try {
                routesContext.log(`Making request to ${pathfinderURL}. Headers: ${alsHeaders}`);
                const pathfinderResponse = await axios.get(pathfinderURL, { headers: alsHeaders });
                ctx.response.headers = pathfinderResponse.headers;
                ctx.response.body = pathfinderResponse.data;
                routesContext.log('Response body: ', JSON.stringify(pathfinderResponse.data));
                ctx.response.status = pathfinderResponse.status;
            } catch (err) {
                // Check if there's an error Reaching pathfinder or pathfinder non 200 response
                if (err.response) {
                    routesContext.log(`Pathfinder returned an error. Pass it on. Error: ${err}`);
                    ctx.response.headers = err.response.headers;
                    ctx.response.body = err.response.data;
                    ctx.response.status = err.response.status;
                } else {
                    routesContext.log(`Error reaching pathfinder: ${err}`);
                    ctx.response.status = 500;
                }
            }
        }
        return next();
    });
};

module.exports = handler;
