import { Request, Response } from "express";
import { pool } from "../connect";
import { asyncHandler } from "../middleware/asyncHandler";

// Obtener todos los horarios disponibles
export const getAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await pool.query(
      "SELECT * FROM availability ORDER BY date, start_time"
    );
    return res.status(200).json(result.rows);
  }
);

// Obtener todos los horarios disponibles para los próximos 60 días

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

// Actualizar la disponibilidad (marcar como no disponible/disponible un horario específico)
export const updateAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_available } = req.body;

    // Validación de entrada
    if (typeof is_available === "undefined") {
      return res.status(400).json({ error: 'El campo "is_available" es requerido' });
    }

    // Realiza la actualización
    const result = await pool.query(
      "UPDATE availability SET is_available = $1 WHERE id = $2 RETURNING *",
      [is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }

    return res.status(200).json({ message: "Horario actualizado correctamente", availability: result.rows[0] });
  }
);


