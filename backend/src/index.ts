import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, getPgVersion } from "./connect";
import availabilityRoutes from "./routes/availabilityRoutes";
import { asyncHandler } from "./middleware/asyncHandler";
import { checkPassword } from "./middleware/checkPassword";

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

// Route to create user or check if there is already
app.post(
  "/users",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(200).json(userExists.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    return res.status(201).json(result.rows[0]);
  })
);

// New appointment
app.post(
  "/appointments",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, service, date } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_id = userResult.rows[0].id;

    const result = await pool.query(
      "INSERT INTO appointments (user_id, service, date) VALUES ($1, $2, $3) RETURNING *",
      [user_id, service, date]
    );
    return res.status(201).json(result.rows[0]);
  })
);

// Check appointment per email
app.get(
  "/appointments",
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: "Email required!" });
    }

    try {
      // Check for the user on DB
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user_id = userResult.rows[0].id;

      // Check appointment from user
      const appointmentsResult = await pool.query(
        "SELECT * FROM appointments WHERE user_id = $1 ORDER BY date",
        [user_id]
      );

      if (appointmentsResult.rows.length === 0) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Appointments
      return res.status(200).json(appointmentsResult.rows);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
      return res.status(500).json({ error: "Error al obtener las citas" });
    }
  })
);

// Protected route for Ownership
app.get(
  "/appointments/all",
  checkPassword,
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(`
        SELECT 
          users.name, 
          users.email, 
          users.phone, 
          appointments.service, 
          appointments.date 
        FROM appointments
        JOIN users ON appointments.user_id = users.id
        ORDER BY appointments.date DESC
      `);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
