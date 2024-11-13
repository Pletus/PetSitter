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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = require("./connect");
const availabilityRoutes_1 = __importDefault(require("./routes/availabilityRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PGPORT || 8000;
function testDbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_1.getPgVersion)();
        }
        catch (error) {
            console.error("Error al obtener la versión de PostgreSQL:", error);
        }
    });
}
testDbConnection();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const asyncHandler = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
// Middleware check password
function checkPassword(req, res, next) {
    const password = req.headers["x-access-password"];
    if (password && password === process.env.PROTECTED_PASSWORD) {
        next();
    }
    else {
        res.status(403).json({ error: "Contraseña incorrecta" });
    }
}
app.use('/api', availabilityRoutes_1.default);
// Route check connect to DB
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connect_1.pool.query("SELECT NOW()");
        res.json({ message: "Connected!", time: result.rows[0].now });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error" });
    }
}));
// Route to create user or check if there is already
app.post("/users", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone } = req.body;
    const userExists = yield connect_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        return res.status(200).json(userExists.rows[0]);
    }
    const result = yield connect_1.pool.query("INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *", [name, email, phone]);
    return res.status(201).json(result.rows[0]);
})));
// New appointment
app.post("/appointments", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, service, date } = req.body;
    const userResult = yield connect_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    const user_id = userResult.rows[0].id;
    const result = yield connect_1.pool.query("INSERT INTO appointments (user_id, service, date) VALUES ($1, $2, $3) RETURNING *", [user_id, service, date]);
    return res.status(201).json(result.rows[0]);
})));
// Check appointment per email
app.get("/appointments", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email required!" });
    }
    try {
        // Check for the user on DB
        const userResult = yield connect_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user_id = userResult.rows[0].id;
        // Check appointment from user
        const appointmentsResult = yield connect_1.pool.query("SELECT * FROM appointments WHERE user_id = $1 ORDER BY date", [user_id]);
        if (appointmentsResult.rows.length === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        // Appointments
        return res.status(200).json(appointmentsResult.rows);
    }
    catch (error) {
        console.error("Error al obtener las citas:", error);
        return res.status(500).json({ error: "Error al obtener las citas" });
    }
})));
// Protected route for Ownership
app.get("/appointments/all", checkPassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connect_1.pool.query(`
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
