import React, { useState, useEffect } from "react";

const DashboardStats = ({ data }) => {
  const [stats, setStats] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  });

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  useEffect(() => {
    // Get today's date
    const todayDate = getTodayDate();

    // Filter the data to include only today's records
    const todayData = data.filter((item) => item.date === todayDate);

    // Calculate the statistics based on the filtered data
    const breakfastCount = todayData.filter((item) => item.mealType === "breakfast").length;
    const lunchCount = todayData.filter((item) => item.mealType === "lunch").length;
    const dinnerCount = todayData.filter((item) => item.mealType === "dinner").length;
    const snacksCount = todayData.filter((item) => item.mealType === "snacks").length;

    setStats({
      breakfast: breakfastCount,
      lunch: lunchCount,
      dinner: dinnerCount,
      snacks: snacksCount,
    });
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center text-center px-4 py-8">
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">{stats.breakfast}</div>
          <div className="text-lg text-gray-600 mt-2">People ate Breakfast Today.</div>
        </div>
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">{stats.lunch}</div>
          <div className="text-lg text-gray-600 mt-2">People ate Lunch Today.</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center mt-10">
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">{stats.snacks}</div>
          <div className="text-lg text-gray-600 mt-2">People ate Snacks Today.</div>
        </div>
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">{stats.dinner}</div>
          <div className="text-lg text-gray-600 mt-2">People ate Dinner Today.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
