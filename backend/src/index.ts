import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, getPgVersion } from "./connect";
import availabilityRoutes from "./routes/availabilityRoutes";
import userRoutes from "./routes/usersRoutes";
import appointmentsRoutes from './routes/appointmentsRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PGPORT || 8000;

async function testDbConnection(): Promise<void> {
  try {
    await getPgVersion();
  } catch (error) {
    console.error("Error obtaining version from PostgreSQL:", error);
  }
}

testDbConnection();
app.use(express.json());
app.use(cors());

app.use("/api", availabilityRoutes);
app.use("/api", userRoutes);
app.use("/api", appointmentsRoutes);

// Route check connect to DB
app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected!", time: result.rows[0].now });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
