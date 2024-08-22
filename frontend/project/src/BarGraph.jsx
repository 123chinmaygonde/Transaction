import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState({});

  useEffect(() => {
    const fetchBarChartData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/barchart', { params: { month } });
          const rangeCounts = Array.isArray(response.data.data) ? response.data.data : [];
          console.log('API Response:', response.data); 
          console.log('Range Counts:', rangeCounts); 
      
          setBarChartData({
            labels: rangeCounts.length > 0 ? rangeCounts.map(item => item.range) : ['No Data'],
            datasets: [{
              label: 'Number of Items',
              data: rangeCounts.length > 0 ? rangeCounts.map(item => item.count) : [0],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          });
        } catch (error) {
          console.error('Error fetching bar chart data:', error);
          setBarChartData({
            labels: ['No Data'],
            datasets: [{
              label: 'Number of Items',
              data: [0],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          });
        }
      };
      

    fetchBarChartData();
  }, [month]); // Fetch data whenever month changes

  return (
    <div>
      <h2>Price Range Distribution</h2>
      <Bar
        data={barChartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Price Range Distribution for Selected Month'
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;
