const { Pool } = require("pg");

const pool = new Pool({
        user: "neondb_owner",
        host: "ep-super-wave-atv5s3kv-pooler.c-9.us-east-1.aws.neon.tech",
        database: "neondb",
        password: "npg_yDtZPu4h9Jws",
        port: 5432
    });

module.exports = pool;
