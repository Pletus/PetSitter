import { Request, Response } from "express";
import { pool } from "../connect";
import { asyncHandler } from "../middleware/asyncHandler";

// Get all availabilities
export const getAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await pool.query(
      "SELECT * FROM availability ORDER BY date, start_time"
    );
    return res.status(200).json(result.rows);
  }
);

// Get all availabilities for the next 60 days

// export const getAvailability = asyncHandler(
//   async (req: Request, res: Response) => {
//     const result = await pool.query(
//       `SELECT * FROM availability
//        WHERE start_date >= CURRENT_DATE
//        AND start_date <= CURRENT_DATE + INTERVAL '60 days'
//        ORDER BY start_date, start_time`
//     );
//     return res.status(200).json(result.rows);
//   }
// );

// Update availability
export const updateAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_available } = req.body;

    // Validation
    if (typeof is_available === "undefined") {
      return res.status(400).json({ error: 'Field "is_available" requiered' });
    }

    // Update
    const result = await pool.query(
      "UPDATE availability SET is_available = $1 WHERE id = $2 RETURNING *",
      [is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Availability not found" });
    }

    return res.status(200).json({ message: "Availability updated!", availability: result.rows[0] });
  }
);


