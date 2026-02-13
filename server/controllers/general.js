// Models import
import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

// Get User
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get Dashboard Stats
export const getDashboardStats = async (_, res) => {
  try {
    // 1. Current Date Logic (Instead of Hardcoded 2021)
    const now = new Date();
    const currentYear = now.getFullYear(); // 2026
    const currentMonth = now.toLocaleString('default', { month: 'long' }); // e.g., "February"
    const currentDate = now.toISOString().split('T')[0]; // "2026-02-13"

    // 2. Recent Transactions
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdAt: -1 });

    // 3. Overall Stats (Ensure your DB has a record for the current year)
    const overallStat = await OverallStat.find({ year: currentYear });

    // SAFETY CHECK: Agar DB mein current year ka data nahi hai
    if (!overallStat.length) {
    return res.status(200).json({ 
        totalCustomers: 0,
        yearlyTotalSoldUnits: 0,
        yearlySalesTotal: 0,
        monthlyData: [],
        salesByCategory: {},
        thisMonthStats: { totalSales: 0 }, // Default values taaki frontend na phate
        todayStats: { totalSales: 0 },
        transactions: transactions || [],
        message: "No stats found for this year. Check OverallStat collection." 
    });
}

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => month === currentMonth);
    const todayStats = overallStat[0].dailyData.find(({ date }) => date === currentDate);

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};