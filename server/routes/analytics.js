import express from "express";
import { getDailyRevenue, getPeakHours } from "../controllers/analytics.js";

const router = express.Router();

// Routes for real-time computed data
router.get("/daily-revenue", getDailyRevenue);
router.get("/peak-hours", getPeakHours);

export default router;