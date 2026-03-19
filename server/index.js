import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import analyticsRoutes from "./routes/analytics.js";
// Rate Limiter
// import { rateLimiter } from "./middlewares/rateLimiter.js";

// Routes imports
import authRoutes from "./routes/auth.js"; // 👈 AUTH ROUTE IMPORT KIYA
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

// Data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";

// Configuration
dotenv.config();
const app = express(); // 👈 SIRF EK BAAR DEFINE KARNA HAI

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use("/analytics", analyticsRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // 👈 COOKIE PARSER ADD KIYA

// 🚨 CORS FIX: Ek hi CORS rakha hai, with credentials!
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

// Routes Setup
app.use("/auth", authRoutes); // 👈 AUTH ROUTE REGISTER KIYA
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Mongoose Setup
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error("ERROR: MONGO_URL is missing in Environment Variables!");
}

mongoose.connect(MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
// mongoose.connect("MONGO_URL")
//   .then(() => {
//     app.listen(PORT, () => console.log(`🚀 Server Port: ${PORT}`));

//     /* FORCE INJECTION - SIRF PRODUCTS */
//     console.log("Attempting to seed products...");
//     Product.insertMany(dataProduct)
//       .then(() => console.log("✅ 13 Products Seeded Successfully!"))
//       .catch((err) => console.log("❌ Seed Error:", err.message));

    /* ONLY RUN THIS ONCE TO FILL DATABASE */
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
/* 🚨 QUICK SEED SCRIPT FOR REAL AGGREGATION TESTING */
    /* Ise ek baar run karke comment kar dena warna har baar data add hoga */
    // const generateTransactions = async () => {
    //   console.log("Seeding real-like transactions...");
    //   const transactions = [];
    //   for (let i = 0; i < 100; i++) {
    //     // Random date in last 30 days
    //     const randomDate = new Date();
    //     randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        
    //     transactions.push({
    //       amount: Math.floor(Math.random() * 5000) + 500, // 500 se 5500 ka bill
    //       paymentType: ["cash", "card", "upi"][Math.floor(Math.random() * 3)],
    //       status: "completed",
    //       createdAt: randomDate,
    //       updatedAt: randomDate
    //     });
    //   }
    //   await Transaction.insertMany(transactions);
    //   console.log("✅ 100 Aggregation-ready Transactions inserted!");
    // };
    // generateTransactions();
  //   console.log("🚀 RestroPulse DB Connected!");
  // })
  // .catch((error) => console.log(`${error} did not connect`));