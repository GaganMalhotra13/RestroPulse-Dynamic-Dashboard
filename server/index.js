import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Rate Limiter
import { rateLimiter } from "./middlewares/rateLimiter.js";

// Routes imports
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

// Data imports - INHE MAINE UNCOMMENT KAR DIYA HAI
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
const app = express();
app.use(express.json());
// app.use(rateLimiter); // Agar error aaye toh isse comment rehne dena
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes Setup
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Mongoose Setup
const PORT = process.env.PORT || 5001;

mongoose.connect("mongodb://localhost:27017/restropulse")
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server Port: ${PORT}`));

    /* FORCE INJECTION - SIRF PRODUCTS */
    console.log("Attempting to seed products...");
    Product.insertMany(dataProduct)
      .then(() => console.log("✅ 13 Products Seeded Successfully!"))
      .catch((err) => console.log("❌ Seed Error:", err.message));

  

    /* ONLY RUN THIS ONCE TO FILL DATABASE */
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);

    console.log("🚀 RestroPulse DB Connected!");
  })
  .catch((error) => console.log(`${error} did not connect`));