import express from "express";

import { getSales, addTransaction } from "../controllers/sales.js";

const router = express.Router();

// Routes
router.get("/sales", getSales);
router.post("/new-order", addTransaction);
export default router;
