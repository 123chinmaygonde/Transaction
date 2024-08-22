
const Transaction = require("../models/Transaction")
const axios = require("axios")
const get3apidata =  async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:3000/api/stats?month=${month}`),
            axios.get(`http://localhost:3000/api/barchart?month=${month}`),
            axios.get(`http://localhost:3000/api/piechart?month=${month}`)
        ]);

        res.status(200).json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error: error.message });
    }
};

module.exports = get3apidata