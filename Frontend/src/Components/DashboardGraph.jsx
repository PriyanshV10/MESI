import React from "react";
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
  // Function to get the last 7 days
  const getLastSevenDays = () => {
    const days = [];
    const currentDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      days.push(day.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    }

    return days;
  };

  // Get the last 7 days dynamically
  const days = getLastSevenDays();

  // Sample data: Random number of people for each day (replace with actual data)
  const data = {
    labels: days, // Last 7 days
    datasets: [
      {
        label: "Number of People",
        data: [
          100, 120, 150, 180, 200, 220, 250, // Example data for the last 7 days
        ], 
        backgroundColor: "#f97316", // Bar color (orange)
        borderColor: "#f97316", // Border color (orange)
        borderWidth: 1,
      },
    ],
  };

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
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardGraph;
