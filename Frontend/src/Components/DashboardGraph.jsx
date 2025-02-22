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

const DashboardGraph = ({ data }) => {
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

  useEffect(() => {
    const days = getLastSevenDays();
    const peopleCount = Array(7).fill(0); // Array for the last 7 days

    // Assuming the data from the API contains meal records
    data.forEach((record) => {
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
  }, [data]);

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
