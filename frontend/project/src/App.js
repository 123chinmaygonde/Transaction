import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import BarChart from './BarGraph';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading,setloading]=useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statistics, setStatistics] = useState({totalSoldItems:0,totalNotSoldItems:0,totalSales:0});
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [month, setMonth] = useState('3');
  const [searchParam, setSearchParam] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
    
  }, []);

  const fetchTransactions = async () => {
    try {
      setloading(true)
        const response = await axios.get('http://localhost:3000/api/getfulldata');
        const transactionsArray = response.data.data;
        setTransactions(transactionsArray);
        setTotalPages(Math.ceil(transactionsArray.length / 10)); // Update total pages
        setloading(false)
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
  };

 

  useEffect(() => {
    fetchTransactions();

  }, [month]); // Fetch data whenever month changes


  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchParam(event.target.value);
  };

  const handleSearchSubmit = () => {
    let filteredData = transactions;

    // Filter by month
    const filterByMonth = (data, month) => {
        return data.filter(item => {
            const date = new Date(item.dateOfSale);
            const itemMonth = date.getMonth() + 1; // JavaScript months are 0-based
            return itemMonth === parseInt(month);
        });
    };

    if (month) {
        filteredData = filterByMonth(filteredData, month);
    }

    // Filter by search parameters in title or description
    filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(searchParam.toLowerCase()) ||
        item.description.toLowerCase().includes(searchParam.toLowerCase())
    );

    setFilteredTransactions(filteredData);

    // Update statistics
    const totalSales = filteredData.reduce((acc, item) => acc + item.price, 0);
    const totalSoldItems = filteredData.filter(item => item.sold).length;
    const totalNotSoldItems = filteredData.length - totalSoldItems;

    setStatistics({
      totalSales,
      totalSoldItems,
      totalNotSoldItems
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const displayedTransactions = filteredTransactions.slice((page - 1) * 10, page * 10);

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>
      
      {/* Month Selector */}
      <label htmlFor="month">Select Month:</label>
      <select id="month" value={month} onChange={handleMonthChange}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* Search Box */}
      <input type="text" value={searchParam} onChange={handleSearchChange} placeholder="Search by title, description" />
      <button onClick={handleSearchSubmit}>Search</button>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
      { loading ?(<Spinner/>) : ( Array.isArray(displayedTransactions) && displayedTransactions.length > 0 ? (
            displayedTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td><img src={transaction.image} alt="" /></td>
              </tr>
            ))
          ) : <tr><td colSpan="8">No transactions found</td></tr>)
        }
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
      </div>

      {/* Statistics */}
      <div>
        <h2>Statistics</h2>
        <p>Total Sales: ${statistics.totalSales.toFixed(2)}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>

      
     <BarChart month={month}/>

      {/* Pie Chart */}
      {/* <div>
        <h2>Pie Chart</h2>
        <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } } } }} />
      </div> */}
    </div>
  );
};

export default App;