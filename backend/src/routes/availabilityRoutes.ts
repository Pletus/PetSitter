import express from "express";
import {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availabilityController";

const router = express.Router();

router
  .get("/availability", getAvailability)
  .post("/availability", createAvailability)
  .put("/availability/:id", updateAvailability)
  .delete("/availability/:id", deleteAvailability);

export default router;
