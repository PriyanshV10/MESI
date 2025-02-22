import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of People",
        data: [],
        backgroundColor: "#f97316", // Bar color (orange)
        borderColor: "#f97316", // Border color (orange)
        borderWidth: 1,
      },
    ],
  });

  // Function to get the last 7 days in YYYY-MM-DD format (same format as the API)
  const getLastSevenDays = () => {
    const days = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      // Format date to YYYY-MM-DD format
      const formattedDate = day.toISOString().split('T')[0];
      days.push(formattedDate); // Add the formatted date
    }

    return days;
  };

  // Function to fetch updated data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/mess");
      const records = await response.json();
      console.log("Fetched data:", records); // Log the fetched data

      const days = getLastSevenDays();
      console.log("Days in the last 7 days:", days); // Log the last 7 days

      const peopleCount = Array(7).fill(0); // Array for the last 7 days

      // Assuming the data from the API contains meal records
      records.forEach((record) => {
        console.log(`Comparing ${record.date} with days:`, days); // Log each record date and days array
        const dayIndex = days.indexOf(record.date); // Find the index of the date in the days array
        if (dayIndex !== -1) {
          peopleCount[dayIndex] += 1; // Increment people count for the day
        }
      });

      // Update the chart data
      setChartData({
        labels: days,
        datasets: [
          {
            label: "Number of People",
            data: peopleCount, // Updated number of people
            backgroundColor: "#f97316", // Bar color (orange)
            borderColor: "#f97316", // Border color (orange)
            borderWidth: 1,
          },
        ],
      });

      console.log("Updated chart data:", peopleCount); // Log the updated data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data every 5 seconds
  useEffect(() => {
    console.log("Fetching data for the first time...");
    fetchData(); // Initial fetch
    const intervalId = setInterval(() => {
      console.log("Fetching data every 5 seconds...");
      fetchData(); // Fetch data every 5 seconds
    }, 5000); // 5 seconds interval

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Options for the bar chart
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
        ticks: {
          maxRotation: 45, // Rotate labels to avoid overlap
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of People",
        },
        beginAtZero: true, // Start Y-axis at 0
        ticks: {
          stepSize: 50, // Show ticks every 50 people (adjustable)
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} People`,
        },
      },
    },
  };

  return (
    <div className="w-full px-8 py-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Number of People in the Last 7 Days</h2>
      <Bar key={JSON.stringify(chartData)} data={chartData} options={options} />
    </div>
  );
};

export default DashboardGraph;
