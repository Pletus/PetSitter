"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const availabilityController_1 = require("../controllers/availabilityController");
const router = express_1.default.Router();
// Ruta para obtener todos los horarios disponibles
router.get('/availability', availabilityController_1.getAvailability);
// Ruta para crear un nuevo horario de disponibilidad
router.post('/availability', availabilityController_1.createAvailability);
// Ruta para actualizar la disponibilidad (marcar como disponible/no disponible)
router.put('/availability/:id', availabilityController_1.updateAvailability);
// Ruta para eliminar un horario de disponibilidad
router.delete('/availability/:id', availabilityController_1.deleteAvailability);
exports.default = router;
