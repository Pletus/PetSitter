"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvailability = exports.updateAvailability = exports.createAvailability = exports.getAvailability = void 0;
const connect_1 = require("../connect");
// Obtener todos los horarios disponibles
const getAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connect_1.pool.query('SELECT * FROM availability ORDER BY day_of_week, start_time');
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener la disponibilidad:', error);
        return res.status(500).json({ error: 'Error al obtener la disponibilidad' });
    }
});
exports.getAvailability = getAvailability;
// Crear un nuevo horario de disponibilidad
const createAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { day_of_week, start_time, end_time, is_available } = req.body;
    if (!day_of_week || !start_time || !end_time) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    try {
        const result = yield connect_1.pool.query('INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES ($1, $2, $3, $4) RETURNING *', [day_of_week, start_time, end_time, is_available || true]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error al crear disponibilidad:', error);
        return res.status(500).json({ error: 'Error al crear disponibilidad' });
    }
});
exports.createAvailability = createAvailability;
// Actualizar la disponibilidad (por ejemplo, marcar como no disponible un horario)
const updateAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { is_available } = req.body;
    if (typeof is_available === 'undefined') {
        return res.status(400).json({ error: 'El campo "is_available" es requerido' });
    }
    try {
        const result = yield connect_1.pool.query('UPDATE availability SET is_available = $1 WHERE id = $2 RETURNING *', [is_available, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        return res.status(500).json({ error: 'Error al actualizar disponibilidad' });
    }
});
exports.updateAvailability = updateAvailability;
// Eliminar un horario de disponibilidad
const deleteAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield connect_1.pool.query('DELETE FROM availability WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        return res.status(200).json({ message: 'Horario eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar disponibilidad:', error);
        return res.status(500).json({ error: 'Error al eliminar disponibilidad' });
    }
});
exports.deleteAvailability = deleteAvailability;
