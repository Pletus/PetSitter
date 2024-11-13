import express from "express";
import {
  getAvailability,
  updateAvailability,
} from '../controllers/availabilityControllers'

const router = express.Router();

router
  .get("/availability", getAvailability)
  .put("/availability/:id", updateAvailability);

export default router;
