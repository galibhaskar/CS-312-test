const { Pool } = require("pg");

const pool = new Pool({
        user: "",
        host: "",
        database: "",
        password: "",
        port: 5432,
        ssl: { rejectUnauthorized: true }
    });

module.exports = pool;
