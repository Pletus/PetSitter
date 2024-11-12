const { Pool } = require('pg');
require('dotenv').config();

const { DATABASE_URL } = process.env;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0].version);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    client.release();
  }
}

module.exports = { getPgVersion, pool };