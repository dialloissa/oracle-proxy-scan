const path = require('path');

// Load .env file into process.env if it exists. This is convenient for running locally.
require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
});

// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = {
    server: {
        listenPort: process.env.LISTEN_PORT,
    },
    moroccosApi: process.env.MOROCCOS_API,
    pathfinderEndpoint: process.env.PATHFINDER_ENDPOINT,
    pathfinderPort: process.env.PATHFINDER_PORT,
    moroccoOrangeFspId: process.env.MOROCCO_ORANGE_FSPID,
};

module.exports = config;
