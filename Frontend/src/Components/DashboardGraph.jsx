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
  console.log("Type of data:", typeof data); // Debugging
  console.log("Data content:", data);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Function to get the last 7 days in YYYY-MM-DD format
  const getLastSevenDays = () => {
    const days = [];
    const currentDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      days.push(day.toISOString().split("T")[0]); // Convert to YYYY-MM-DD
    }
    return days;
  };

  // Function to generate dummy data
  const generateDummyData = () => {
    const days = getLastSevenDays();
    const generateRandomCounts = () => days.map(() => Math.floor(Math.random() * 26) + 5); // Random 5-30

    return {
      labels: days,
      datasets: [
        {
          label: "Breakfast",
          data: generateRandomCounts(),
          backgroundColor: "#00c8ff",
          borderColor: "#206efb",
          borderWidth: 1,
        },
        {
          label: "Lunch",
          data: generateRandomCounts(),
          backgroundColor: "#ffac00",
          borderColor: "#ff7f00",
          borderWidth: 1,
        },
        {
          label: "Dinner",
          data: generateRandomCounts(),
          backgroundColor: "#ff4081",
          borderColor: "#ff0055",
          borderWidth: 1,
        },
        {
          label: "Snacks",
          data: generateRandomCounts(),
          backgroundColor: "#00e5ff",
          borderColor: "#00b8d4",
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    let recordsArray = [];

    // ✅ Handle missing or empty data
    if (!data || Object.keys(data).length === 0) {
      console.warn("No real data available, using dummy data.");
      setChartData(generateDummyData());
      return;
    }

    // ✅ Extract entries correctly
    if (Array.isArray(data)) {
      recordsArray = data;
    } else if (data.entries && Array.isArray(data.entries)) {
      recordsArray = data.entries;
    } else {
      console.warn("Unexpected data structure:", data);
      return;
    }

    const days = getLastSevenDays();
    console.log("Last 7 days:", days);

    const mealCounts = {
      Breakfast: Array(7).fill(0),
      Lunch: Array(7).fill(0),
      Dinner: Array(7).fill(0),
      Snacks: Array(7).fill(0),
    };

    // ✅ Process the data to count meal types per day
    recordsArray.forEach((record) => {
      if (!record.entry_time || !record.meal_type) {
        console.warn("Invalid record detected:", record);
        return;
      }

      const recordDate = record.entry_time.split("T")[0]; // Extract date
      if (days.includes(recordDate) && mealCounts.hasOwnProperty(record.meal_type)) {
        const dayIndex = days.indexOf(recordDate);
        mealCounts[record.meal_type][dayIndex] += 1;
      }
    });

    console.log("Meal Counts:", mealCounts);

    // ✅ Update chart data
    setChartData({
      labels: days,
      datasets: [
        {
          label: "Breakfast",
          data: mealCounts.Breakfast,
          backgroundColor: "#00c8ff",
          borderColor: "#206efb",
          borderWidth: 1,
        },
        {
          label: "Lunch",
          data: mealCounts.Lunch,
          backgroundColor: "#ffac00",
          borderColor: "#ff7f00",
          borderWidth: 1,
        },
        {
          label: "Dinner",
          data: mealCounts.Dinner,
          backgroundColor: "#ff4081",
          borderColor: "#ff0055",
          borderWidth: 1,
        },
        {
          label: "Snacks",
          data: mealCounts.Snacks,
          backgroundColor: "#00e5ff",
          borderColor: "#00b8d4",
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
          maxRotation: 45,
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of People",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Adjust based on data density
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
      <h2 className="text-3xl font-semibold text-center mb-6">
        Number of People in the Last 7 Days
      </h2>
      <Bar key={JSON.stringify(chartData)} data={chartData} options={options} />
    </div>
  );
};

export default DashboardGraph;
