import express from "express";
import { createUser } from "../controllers/usersControllers";

const router = express.Router();

// Route to create user or check if there is already
router.post("/users", createUser);

export default router;
