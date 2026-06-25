import express from "express";

import {
  getProducts,
  getCustomers,
  addProduct,
  getTransactions,
  addTransaction, updateTransactionStatus,
  getGeography,
  getUser,
} from "../controllers/client.js";

const router = express.Router();

// Routes
router.get("/products", getProducts);
router.post("/products", addProduct);
router.get("/customers", getCustomers);

router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction); 
router.patch("/transactions/:id/status", updateTransactionStatus)

router.get("/geography", getGeography);
router.get("/user/:id", getUser);

export default router;