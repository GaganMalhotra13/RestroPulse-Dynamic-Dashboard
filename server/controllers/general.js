import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

// 👤 Function 1: Get User Details
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// 📊 Function 2: Get Dynamic Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    // Hardcoded 2021 hata diya, ab system ki current date use hogi
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
    const currentDay = new Date().toISOString().split("T")[0];

    // Latest 50 transactions uthao
    const transactions = await Transaction.find().limit(50).sort({ createdAt: -1 });
    
    // Is saal ka stat dhoondho
    const overallStat = await OverallStat.findOne({ year: currentYear });

    // Frontend ko data bhejo (Agar null hai toh safe "0" bhejo taaki crash na ho)
    res.status(200).json({
      totalCustomers: 0, 
      yearlySalesTotal: overallStat ? overallStat.yearlySalesTotal : 0,
      yearlyTotalSoldUnits: overallStat ? overallStat.yearlyTotalSoldUnits : 0,
      
      thisMonthStats: overallStat 
        ? overallStat.monthlyData.find(({ month }) => month === currentMonth) || { totalSales: 0 } 
        : { totalSales: 0 },
        
      todayStats: overallStat 
        ? overallStat.dailyData.find(({ date }) => date === currentDay) || { totalSales: 0 }
        : { totalSales: 0 },
        
      transactions: transactions || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};