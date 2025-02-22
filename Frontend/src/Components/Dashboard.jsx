import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker"; // Correct method

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Meal times
  const meals = ["breakfast", "lunch", "snacks", "dinner"];
  const mealTimes = {
    breakfast: { start: "07:30", end: "09:30" },
    lunch: { start: "12:00", end: "14:00" },
    snacks: { start: "17:00", end: "18:00" },
    dinner: { start: "19:30", end: "21:30" },
  };

  // Function to generate a random time for each meal type
  const generateRandomMealTime = (mealType) => {
    const mealStart = mealTimes[mealType].start;
    const mealEnd = mealTimes[mealType].end;
    const startTime = new Date(`2025-02-22T${mealStart}:00`);
    const endTime = new Date(`2025-02-22T${mealEnd}:00`);
    
    const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));
    return randomTime.toISOString().slice(0, 19).replace("T", " ");
  };

  // Function to generate random data
  const generateRandomData = (numRecords) => {
    const records = [];
    for (let i = 0; i < numRecords; i++) {
      const id = i + 1;
      const name = faker.name.fullName(); // Correct method to generate a name
      const mealType = meals[Math.floor(Math.random() * meals.length)];
      const time = generateRandomMealTime(mealType);
      const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD

      records.push({ id, name, mealType, time, date });
    }
    return records;
  };

  // Generate 1000 records
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of People",
        data: [0, 0, 0, 0],
        backgroundColor: "#f97316",
        borderColor: "#f97316",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const randomData = generateRandomData(1000);
    setData(randomData);

    // Graph data: Count number of people by meal type
    const mealCounts = meals.reduce((acc, meal) => {
      acc[meal] = randomData.filter((item) => item.mealType === meal).length;
      return acc;
    }, {});

    setGraphData({
      labels: meals,
      datasets: [
        {
          label: "Number of People",
          data: [
            mealCounts.breakfast,
            mealCounts.lunch,
            mealCounts.snacks,
            mealCounts.dinner,
          ],
          backgroundColor: "#f97316",
          borderColor: "#f97316",
          borderWidth: 1,
        },
      ],
    });
  }, []);

  return (
    <div className="w-full p-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Mess Management Dashboard</h2>

      {/* Graph */}
      <div className="mb-8">
        <Bar data={graphData} />
      </div>

      {/* Display Boxes */}
      <div className="flex gap-6 justify-center">
        <div className="box">
          <div className="text-6xl">{data.filter((item) => item.mealType === "breakfast").length}</div>
          <div>People ate Breakfast in last 24 hours</div>
        </div>
        <div className="box">
          <div className="text-6xl">{data.filter((item) => item.mealType === "lunch").length}</div>
          <div>People ate Lunch in last 24 hours</div>
        </div>
        <div className="box">
          <div className="text-6xl">{data.filter((item) => item.mealType === "snacks").length}</div>
          <div>People ate Snacks in last 24 hours</div>
        </div>
        <div className="box">
          <div className="text-6xl">{data.filter((item) => item.mealType === "dinner").length}</div>
          <div>People ate Dinner in last 24 hours</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
