const Transaction = require("../models/Transaction");

const piechart = async (req, res) => {
  try {
    const { month } = req.query; // Extract month from query parameters
    
    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    // Ensure month is a valid number
    const monthIndex = parseInt(month, 10) - 1; // Convert to 0-based index

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return res.status(400).json({ message: 'Invalid month provided' });
    }

    // Define date range for the given month
    const startDate = new Date(monthIndex); // You can use current year or any year
    const endDate = new Date( monthIndex + 1); // Start of the next month

    // Fetch transactions for the given month
    const transactions = await Transaction.find({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Count transactions by category
    const categoryCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ data: categoryCounts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pie chart data', error: error.message });
  }
};

module.exports = piechart;
