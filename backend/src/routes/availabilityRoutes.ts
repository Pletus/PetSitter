import express from 'express';
import { getAvailability, createAvailability, updateAvailability, deleteAvailability } from '../controllers/availabilityController';

const router = express.Router();

// Ruta para obtener todos los horarios disponibles
router.get('/availability', getAvailability);

// Ruta para crear un nuevo horario de disponibilidad
router.post('/availability', createAvailability);

// Ruta para actualizar la disponibilidad (marcar como disponible/no disponible)
router.put('/availability/:id', updateAvailability);

// Ruta para eliminar un horario de disponibilidad
router.delete('/availability/:id', deleteAvailability);

export default router;
