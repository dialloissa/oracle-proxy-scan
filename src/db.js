const mysql = require('mysql2');

const exampleQuery = 'select 1 + ? as result';

module.exports = class Database {
    constructor(config) {
        this.connection = mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        }).promise();
    }

    async dummyQuery(param) {
        const [result] = await this.connection.query(exampleQuery, [param]);
        return result?.[0] || null;
    }
};
