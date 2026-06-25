import getCountryISO3 from "country-iso-2-to-3";

// Models import
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js"; 

// ==============================
// GET PRODUCTS
// ==============================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });

        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ==============================
// ADD PRODUCT
// ==============================
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, supply } = req.body;
    
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      supply,
    });

    await newProduct.save();
    
    // Naya product save hone ke baad UI ko response bhejo
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ==============================
// GET USER
// ==============================
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ==============================
// GET CUSTOMERS
// ==============================
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ==============================
// GET TRANSACTIONS (Orders/Billing DataGrid)
// ==============================
export const getTransactions = async (req, res) => {
  try {
    const { page = 0, pageSize = 20, sort = null } = req.query;

    // 1. Safe Sort Parsing
    const generateSort = () => {
      try {
        const sortParsed = JSON.parse(sort);
        return { [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1 };
      } catch (error) {
        return {};
      }
    };
    const sortFormatted = Boolean(sort) && sort !== "undefined" ? generateSort() : {};

    // 2. Fetch data WITHOUT regex search to avoid CastErrors
    const transactions = await Transaction.find()
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments();

    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error("🚨 CRITICAL TRANSACTION ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// ADD TRANSACTION (Generate Bill / POS)
// ==============================
export const addTransaction = async (req, res) => {
  try {
    const { products, cost, paymentType, customerName, orderType, staffName, staffRole, cartItems } = req.body;

    // 🟢 THE "FASTEST YET ROBUST" FIX: AUTO-CREATE USERS
    
    // 1. Find or Create Customer
    if (customerName) {
      const existingCustomer = await User.findOne({ name: customerName, role: "user" });
      if (!existingCustomer) {
        const dummyEmail = `${customerName.toLowerCase().replace(/\s/g, '')}${Math.floor(Math.random() * 1000)}@guest.com`;
        const newCustomer = new User({
          name: customerName,
          email: dummyEmail,
          password: "auto-generated", 
          city: "New Delhi",
          state: "Delhi",
          country: "India",
          occupation: "Guest Diner",
          phoneNumber: "",
          role: "user",
        });
        await newCustomer.save();
      }
    }

    // 2. Find or Create Staff/Admin
    if (staffName) {
      // Map frontend role to backend database role
      const dbRole = (staffRole === "Admin" || staffRole === "Manager") ? "admin" : "superadmin";
      
      const existingStaff = await User.findOne({ name: staffName, role: dbRole });
      if (!existingStaff) {
        const dummyStaffEmail = `${staffName.toLowerCase().replace(/\s/g, '')}@restropulse.com`;
        const newStaff = new User({
          name: staffName,
          email: dummyStaffEmail,
          password: "auto-generated",
          city: "New Delhi",
          state: "Delhi",
          country: "India",
          occupation: staffRole,
          phoneNumber: "",
          role: dbRole,
        });
        await newStaff.save();
      }
    }
    // 🟢 END OF AUTO-CREATE LOGIC

    // 3. Transaction Save Karo
    const newTransaction = new Transaction({
      userId: customerName || "Guest",
      cost: cost.toString(),
      products: products || [],
      paymentType,
      orderType,
      staffName,
      staffRole
    });
    const savedTransaction = await newTransaction.save();

    // 4. Stats Update Logic
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" }); 
    const currentDay = new Date().toISOString().split("T")[0];

    let stat = await OverallStat.findOne({ year: currentYear });

    if (!stat) {
      stat = new OverallStat({
        year: currentYear,
        yearlySalesTotal: 0,
        yearlyTotalSoldUnits: 0,
        monthlyData: [],
        dailyData: [],
        salesByCategory: {} 
      });
    }

    stat.yearlySalesTotal += Number(cost); 
    stat.yearlyTotalSoldUnits += 1; 

    // Category wise sales update
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach(item => {
        const cat = item.category || "General";
        const currentCatVal = stat.salesByCategory.get(cat) || 0;
        stat.salesByCategory.set(cat, currentCatVal + Number(item.price));
      });
    }

    // Monthly Data
    const monthIndex = stat.monthlyData.findIndex((m) => m.month === currentMonth);
    if (monthIndex !== -1) {
      stat.monthlyData[monthIndex].totalSales += Number(cost);
      stat.monthlyData[monthIndex].totalUnits += 1;
    } else {
      stat.monthlyData.push({ month: currentMonth, totalSales: Number(cost), totalUnits: 1 });
    }

    // Daily Chart Data
    const dayIndex = stat.dailyData.findIndex((d) => d.date === currentDay);
    if (dayIndex !== -1) {
      stat.dailyData[dayIndex].totalSales += Number(cost);
      stat.dailyData[dayIndex].totalUnits += 1;
    } else {
      stat.dailyData.push({ date: currentDay, totalSales: Number(cost), totalUnits: 1 });
    }

    await stat.save();
    res.status(201).json({ message: "Order Punched & Accounts Synced!", transaction: savedTransaction });

  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the transaction by ID and update its status
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true } // Returns the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// ==============================
// GET GEOGRAPHY
// ==============================
export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    // Convert country ISO 2 -> ISO 3
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }

      acc[countryISO3]++;

      return acc;
    }, {});

    // format countries to match geography
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};