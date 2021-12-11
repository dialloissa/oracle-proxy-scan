const http = require('http');
const appCreateServer = require('../server');

const defaultConfig = {
    moroccosApi: process.env.MOROCCOS_API,
    pathfinderEndpoint: process.env.PATHFINDER_ENDPOINT,
    pathfinderPort: process.env.PATHFINDER_PORT,
    moroccoOrangeFspId: process.env.MOROCCO_ORANGE_FSPID,
};

const createServer = ({ logger = () => {}, config = defaultConfig } = {}) => http.createServer(
    appCreateServer(config, logger).callback(),
);

module.exports = {
    createServer,
};
