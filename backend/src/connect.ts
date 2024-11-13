import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL } = process.env;

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Function to get PostgreSQL version
export async function getPgVersion(): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0].version);
  } catch (err) {
    console.error("Error ejecutando la consulta", err);
  } finally {
    client.release();
  }
}
