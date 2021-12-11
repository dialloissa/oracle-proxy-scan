const createServer = require('./server');
const config = require('./config');
const log = require('./lib/log');

// Log development/production status
log('Running in ', process.env.NODE_ENV);

// /////////////////////////////////////////////////////////////////////////////
// Start app
// /////////////////////////////////////////////////////////////////////////////

log('Config:', config);
const server = createServer(config, log);
server.listen(config.server.listenPort);
log(`Listening on port ${config.server.listenPort}`);
