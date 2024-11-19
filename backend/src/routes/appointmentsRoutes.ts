import express from "express";
import {
  newAppointment,
  userAppointments,
  ownerAll,
} from "../controllers/appointmentsControllers";
import { checkPassword } from "../middleware/checkPassword";

const router = express.Router();

router
  .post("/appointments", newAppointment)
  .get("/appointments", userAppointments) // works but send query in the URL
  .get("/appointments/all", checkPassword, ownerAll);

export default router;
