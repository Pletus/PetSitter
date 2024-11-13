import { Request, Response } from 'express';
import { pool } from '../connect';
import { asyncHandler } from '../middleware/asyncHandler';

// Obtener todos los horarios disponibles
export const getAvailability = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM availability ORDER BY day_of_week, start_time');
  return res.status(200).json(result.rows);
});

// Crear un nuevo horario de disponibilidad
export const createAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { day_of_week, start_time, end_time, is_available } = req.body;

  if (!day_of_week || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const result = await pool.query(
    'INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES ($1, $2, $3, $4) RETURNING *',
    [day_of_week, start_time, end_time, is_available || true]
  );
  return res.status(201).json(result.rows[0]);
});

// Actualizar la disponibilidad (por ejemplo, marcar como no disponible un horario)
export const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_available } = req.body;

  if (typeof is_available === 'undefined') {
    return res.status(400).json({ error: 'El campo "is_available" es requerido' });
  }

  const result = await pool.query(
    'UPDATE availability SET is_available = $1 WHERE id = $2 RETURNING *',
    [is_available, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Horario no encontrado' });
  }

  return res.status(200).json(result.rows[0]);
});

// Eliminar un horario de disponibilidad
export const deleteAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM availability WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Horario no encontrado' });
  }

  return res.status(200).json({ message: 'Horario eliminado correctamente' });
});
