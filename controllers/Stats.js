
const Transaction = require("../models/Transaction")

const stats = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        const monthIndex = new Date(Date.parse(month )).getMonth();

        const transactions = await Transaction.find({
            dateOfSale: {
                $gte: new Date(2000, monthIndex, 1),
                $lt: new Date(2100, monthIndex + 1, 1)
            }
        });

        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.status(200).json({ data :{totalSaleAmount, totalSoldItems, totalNotSoldItems} });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};

module.exports=stats