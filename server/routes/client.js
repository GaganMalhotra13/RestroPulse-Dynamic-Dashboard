import express from "express";

import {
  getProducts,
  getCustomers,
  addProduct,
  getTransactions,
  getGeography,getUser,
} from "../controllers/client.js";

const router = express.Router();

// Routes
router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.post("/products", addProduct); // 👈 YE LINE HONI CHAHIYE!router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
router.get("/user/:id", getUser);
export default router;
