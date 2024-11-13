import { Request, Response } from "express";
import { pool } from "../connect";
import { asyncHandler } from "../middleware/asyncHandler";

export const newAppointment = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const userAppointments = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const ownerAll = async (req: Request, res: Response) => {
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
};
