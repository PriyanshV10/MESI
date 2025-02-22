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

  // Dummy data for testing when data is empty
  const dummyData = [
    { entry_time: `${getTodayDate()}T08:15:00Z`, meal_type: "Breakfast" },
    { entry_time: `${getTodayDate()}T09:30:00Z`, meal_type: "Breakfast" },
    { entry_time: `${getTodayDate()}T13:00:00Z`, meal_type: "Lunch" },
    { entry_time: `${getTodayDate()}T13:45:00Z`, meal_type: "Lunch" },
    { entry_time: `${getTodayDate()}T17:00:00Z`, meal_type: "Snacks" },
    { entry_time: `${getTodayDate()}T20:00:00Z`, meal_type: "Dinner" },
    { entry_time: `${getTodayDate()}T20:30:00Z`, meal_type: "Dinner" },
  ];

  useEffect(() => {
    const todayDate = getTodayDate();

    // Use dummy data if no real data is provided
    const validData = data && data.entries && Array.isArray(data.entries) ? data.entries : dummyData;

    // Filter data for today's records
    const todayData = validData.filter((item) => {
      const entryDate = item.entry_time.split("T")[0];
      return entryDate === todayDate;
    });

    // Count each meal type
    const breakfastCount = todayData.filter((item) => item.meal_type === "Breakfast").length;
    const lunchCount = todayData.filter((item) => item.meal_type === "Lunch").length;
    const dinnerCount = todayData.filter((item) => item.meal_type === "Dinner").length;
    const snacksCount = todayData.filter((item) => item.meal_type === "Snacks").length;

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
