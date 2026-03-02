import Transaction from "../models/Transaction.js";

// 1. Daily Revenue Aggregation (Asli data crunching)
export const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Agar frontend se date na aaye, toh last 30 days le lo
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: "completed" // Sirf successful orders ka paisa ginenge
        }
      },
      {
        $group: {
          _id: {
            year:  { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day:   { $dayOfMonth: "$createdAt" }
          },
          totalRevenue: { $sum: "$amount" },
          totalOrders:  { $count: {} },
          avgOrderValue:{ $avg: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: "%Y-%m-%d", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: "$_id.day" } } }
          },
          totalRevenue: { $round: ["$totalRevenue", 2] },
          totalOrders: 1,
          avgOrderValue: { $round: ["$avgOrderValue", 2] }
        }
      },
      { $sort: { date: 1 } } // Date ke hisaab se ascending order mein sort
    ]);

    res.status(200).json(dailyRevenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Peak Hours (Kis time sabse zyada bheed hoti hai?)
export const getPeakHours = async (req, res) => {
  try {
    const peakHours = await Transaction.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalOrders:  { $count: {} },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } } // 0 se 23 hours tak sort karega
    ]);
    res.status(200).json(peakHours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};