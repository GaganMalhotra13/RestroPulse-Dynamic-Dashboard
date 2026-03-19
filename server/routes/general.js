import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

// User data ka route
router.get("/user/:id", getUser);

// Dashboard stats ka naya dynamic route
router.get("/dashboard", getDashboardStats);

// 🚨 Ye line zaroori hai taaki index.js isko import kar sake
export default router;