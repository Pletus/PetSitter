const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { getPgVersion, pool } = require("./connect.js");

const PORT = process.env.PGPORT || 8000;

async function testDbConnection() {
  try {
    await getPgVersion();
  } catch (error) {
    console.error("Failed to get PostgreSQL version:", error);
  }
}

getPgVersion();
app.use(express.json());
app.use(cors());

// Middleware verify password

function checkPassword(req, res, next) {
  const password = req.headers["x-access-password"];

  if (password && password === process.env.PROTECTED_PASSWORD) {
    return next();
  } else {
    return res
      .status(403)
      .json({ error: "Wrong password" });
  }
}

// Route to check connection with DB

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected!", time: result.rows[0].now });
  } catch (error) {
    console.error("Error connecting DB:", error);
    res.status(500).json({ error: "Error" });
  }
});

// Route for creating new user and check if there is one already

app.post("/users", async (req, res) => {
  const { name, email, phone } = req.body;
  try {
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
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error when creating user" });
  }
});

// Route for new appoinment

app.post("/appointments", async (req, res) => {
  const { email, service, date } = req.body;
  try {
      // Search user per email
      
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user_id = userResult.rows[0].id;

      // Insert appoinment
      
    const result = await pool.query(
      "INSERT INTO appointments (user_id, service, date) VALUES ($1, $2, $3) RETURNING *",
      [user_id, service, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando cita:", error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
});

// Route to consult appoinments through email

app.get("/appointments", async (req, res) => {
  const { email } = req.query;
  try {
    // Search user per email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user_id = userResult.rows[0].id;

      // Search appoinments for the user
      
    const appointmentsResult = await pool.query(
      "SELECT * FROM appointments WHERE user_id = $1 ORDER BY date",
      [user_id]
    );
    res.status(200).json(appointmentsResult.rows);
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

// Protected route

app.get("/appointments/all", checkPassword, async (req, res) => {
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
    console.error("Error obteniendo la lista de citas:", error);
    res.status(500).json({ error: "Error al obtener la lista de citas" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
