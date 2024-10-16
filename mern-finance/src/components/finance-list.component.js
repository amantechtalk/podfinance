import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {candel1} from'./candel1.js'
import { Chart, registerables } from 'chart.js';
import './desgin.css'
import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement, OhlcElement);
const FinanceList = () => {
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stockData, setStockData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch('http://35.238.242.36:5000/stocks/');
      const data = await response.json();
      setStockData(data);
      prepareChartData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };



  const prepareChartData = (stockData) => {
    
   
    let filteredData = stockData.filter((row) => new Date(row.Date) <= new Date("2024-08-21"));

    console.log(filteredData );
    if (!stockData || !Array.isArray(stockData)) {
      console.error('Invalid stock data');
      return;
    }
    if (filter == 'week') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.Date);
        const today = new Date("2024-08-29");
        const lastWeek = new Date("2024-08-21");
        console.log("week");
        
        return date >= lastWeek && date <= today;

        
      });
    } else if (filter == 'month') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.Date);
        const today = new Date("2024-08-29");
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        console.log("month");

        return date >= lastMonth && date <= today;
      });
    } 

    
    else if (filter == 'year') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.Date);
        const today = new Date("2024-08-29");
        const lastYear = new Date("2023-08-21");
        console.log("year");

        return date >= lastYear && date <= today;
      });
    } else if (filter == 'custom') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.Date);
        return date >= new Date(dateRange.startDate) && date <= new Date(dateRange.endDate);
      });
    }

    else if (filter == 'all') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.Date);
        return date;
      });

    }


    
 
    if (!filteredData || !Array.isArray(filteredData)) {
      console.error('Invalid filtered data');
      return;
    }
    const labels = filteredData.map((row) => new Date(row.Date).toLocaleDateString());
    const openPrices = filteredData.map((row) => row.Open);
    const closePrices = filteredData.map((row) => row.Close);
    const volumes = filteredData.map((row) => row.Volume);
    












    const barData = {
      labels,
      datasets: [
        {
          label: 'Open Prices',
          data: openPrices,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const lineData = {
      labels,
      datasets: [
        {
          label: 'Close Prices',
          data: closePrices,
          fill: false,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
        },
      ],
    };

    const totalVolume = volumes.reduce((acc, volume) => acc + volume, 0);
    const volumePercentages = volumes.map((volume) => (volume / totalVolume) * 100);

    const pieData = {
      labels,
      datasets: [
        {
          label: 'Volume Percentage',
          data: volumePercentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };

    setChartData({ barData, lineData, pieData });
  };


  const handleFilterChange =  (event) => {
    setFilter(event.target.value);
    console.log(filter);
    prepareChartData(stockData);
  };

  const handleDateChange =  (event) => {
    setDateRange({
      ...dateRange,
      [event.target.name]: event.target.value,
    });
   
    prepareChartData(stockData);
  };

 









  return (
    <div>
      <h4>Double click to select filter</h4>
      <div style={{ marginBottom: 20 }}>
        <button value="month" onClick={handleFilterChange}>This Month</button>
        <button value="week" onClick={handleFilterChange}>This Week</button>
        <button value="year" onClick={handleFilterChange}>This Year</button>
        <button value="custom" onClick={handleFilterChange}>Custom</button>
        <button value="all" onClick={handleFilterChange}>All</button>

  {filter === 'custom' && (
    <div>
      <input
        type="date"
        name="startDate"
        value={dateRange.startDate}
        onChange={handleDateChange}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="endDate"
        value={dateRange.endDate}
        onChange={handleDateChange}
        placeholder="End Date"
      />
    </div>
  )}
</div>





      {chartData ? (
       
          <div className='chart-wrapper' >
            <div>
            <h2>Bar Chart - Open Prices</h2>
            <div className="chart-container">
              <Bar data={chartData.barData} />
            </div>
            </div>
            <div>
            <h2>Line Chart - Close Prices</h2>
            <div className="chart-container">
              <Line data={chartData.lineData} />
            </div>
            </div><div>
            <h2>Pie Chart - Volume Distribution</h2>
            <div className="chart-container">
              <Pie data={chartData.pieData} />
            </div>
            </div>
            <div>
             
              </div>












          </div>
       
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default FinanceList;