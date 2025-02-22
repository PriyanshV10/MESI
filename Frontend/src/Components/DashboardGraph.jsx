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
  // Generate hourly labels for the last 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Sample data: Random number of people for each hour (replace with actual data)
  const data = {
    labels: hours, // Time (last 24 hours)
    datasets: [
      {
        label: "Number of People",
        data: [
          10, 15, 20, 25, 30, 45, 50, 60, 70, 75, 80, 85, 90, 95, 100, 120, 130, 140, 150, 160, 170, 180, 190, 200,
        ], // Number of people at each hour (replace with real data)
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
          text: "Time (Hours)",
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
          stepSize: 10, // Show ticks every 10 people
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
      <h2 className="text-3xl font-semibold text-center mb-6">Number of People in the Last 24 Hours</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardGraph;
