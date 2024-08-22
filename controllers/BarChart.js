
const Transaction = require("../models/Transaction");



const barchart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    const monthIndex = parseInt(month) - 1; // Convert to zero-based index

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return res.status(400).json({ message: 'Invalid month value' });
    }

    // Find transactions for the given month irrespective of the year
    const transactions = await Transaction.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] // MongoDB months are 1-based
      }
    });

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 50 },
      { min: 51, max: 100 },
      { min: 101, max: 150 },
      { min: 151, max: 200 },
      { min: 201, max: 250 },
      { min: 251, max: 300 },
      { min: 301, max: 350 },
      { min: 351, max: 400 },
      { min: 401, max: 450 },
      { min: 451, max: 500 }
    ];

    // Count items in each price range
    const rangeCounts = priceRanges.map(range => {
      const count = transactions.filter(item => item.price >= range.min && item.price <= range.max).length;
      return { range: `${range.min} - ${range.max}`, count };
    });

    res.status(200).json({ data: rangeCounts });
  } catch (error) {
    console.error('Error fetching price range data:', error);
    res.status(500).json({ message: 'Error fetching price range data', error: error.message });
  }
};




module.exports = barchart