import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

// Get Sales
export const addTransaction = async (req, res) => {
  try {
    const { products, cost, paymentType, customerName, orderType, staffName, staffRole, cartItems } = req.body;

    // 1. Transaction Save Karo (Saari nayi details ke sath)
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

    // 2. Stats Update Logic
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" }); 
    const currentDay = new Date().toISOString().split("T")[0]; // Exact date for Daily Chart

    let stat = await OverallStat.findOne({ year: currentYear });

    if (!stat) {
      stat = new OverallStat({
        year: currentYear,
        yearlySalesTotal: 0,
        yearlyTotalSoldUnits: 0,
        monthlyData: [],
        dailyData: [],
        salesByCategory: {} // Map for Pie Chart
      });
    }

    stat.yearlySalesTotal += Number(cost); 
    stat.yearlyTotalSoldUnits += 1; 

    // 🟢 PIE CHART LOGIC (Category wise sales badhao)
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach(item => {
        const cat = item.category || "General";
        const currentCatVal = stat.salesByCategory.get(cat) || 0;
        // Hum us category ke total mein us item ka price add kar rahe hain
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

    // 🟢 DAILY CHART LOGIC
    const dayIndex = stat.dailyData.findIndex((d) => d.date === currentDay);
    if (dayIndex !== -1) {
      stat.dailyData[dayIndex].totalSales += Number(cost);
      stat.dailyData[dayIndex].totalUnits += 1;
    } else {
      stat.dailyData.push({ date: currentDay, totalSales: Number(cost), totalUnits: 1 });
    }

    await stat.save();
    res.status(201).json({ message: "Order Punched and Charts Updated!", transaction: savedTransaction });

  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// Tera purana getSales waisa hi rahega
export const getSales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const overallStats = await OverallStat.findOne({ year: currentYear });

    // Agar database khali hai, toh crash hone ki jagah empty format bhejo
    if (!overallStats) {
      return res.status(200).json({
        yearlySalesTotal: 0,
        yearlyTotalSoldUnits: 0,
        monthlyData: [],
        dailyData: [],
        salesByCategory: { "Dine-In": 0, "Takeaway": 0 }
      });
    }

    res.status(200).json(overallStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
