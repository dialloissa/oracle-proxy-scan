const glob = require('glob');
const Koa = require('koa');
const koaBody = require('koa-body');
const util = require('util');
const Router = require('koa-router');

//
// Server
//
const createServer = (config, log) => {
    const app = new Koa();

    //
    // Pre-route-handler middleware
    //
    // Return 500 for any unhandled errors
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            log('Error', util.inspect(err, { depth: 10 }));
            ctx.response.status = 500;
            ctx.response.body = { msg: 'Unhandled Internal Error' };
        }
        log(`${ctx.request.method} ${ctx.request.path} | ${ctx.response.status}`);
    });

    // Log all requests
    app.use(async (ctx, next) => {
        log(`${ctx.request.method} ${ctx.request.path}${ctx.request.search}`);
        await next();
    });

    // Health-check
    app.use(async (ctx, next) => {
        if (ctx.request.path === '/') {
            ctx.response.status = 204;
            return;
        }
        await next();
    });

    // Parse request bodies of certain content types (see koa-body docs for more)
    app.use(koaBody());

    //
    // Route handling
    //
    const mountRoutes = () => {
        const router = new Router();
        const files = glob.sync('./handlers/*.js');
        files.forEach((file) => {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const route = require(file);

            route(...[router, {
                config,
                log,
            }]);
        });

        // Route requests according to the routes above
        app.use(router.routes());
        app.use(router.allowedMethods());
    };

    mountRoutes();

    return app;
};

module.exports = createServer;
