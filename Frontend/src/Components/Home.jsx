import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import DashboardGraph from "./DashboardGraph";
import DashboardStats from "./DashboardStats";
import Table from "./Table";

const Home = () => {
  const [showLiveTable, setShowLiveTable] = useState(false);
  const [data, setData] = useState([]); // Stores all entries
  const [recentData, setRecentData] = useState({}); // Store recent data, assuming it has 'recent_count'
  const [recentCount, setRecentCount] = useState(0); // Store recent data, assuming it has 'recent_count'

  // Function to fetch all data (requires authentication)
  const fetchAllData = async () => {
    try {
      const url = "https://precise-divine-lab.ngrok-free.app/dashboard";
      const username = "admin@iiitkota.ac.in";
      const password = "adminpassword";

      // Correctly encode the credentials using template literals
      const credentials = btoa(`${username}:${password}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch dashboard data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json(); // Parse response as JSON
      console.log("Dashboard data:", data);
      setData(data); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  // Function to fetch only recent data (NO authentication required)
  const fetchRecentData = async () => {
    try {
      const url = `https://precise-divine-lab.ngrok-free.app/recent_entries`;
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recent data: ${response.status} ${response.statusText}`
        );
      }

      const fetchedRecent = await response.json(); // Wait for the promise to resolve
      console.log("Fetched recent data:", fetchedRecent);
      setRecentData(fetchedRecent); // Assuming the response has `recent_count` field
      setRecentCount(recentData.recent_count);
    } catch (error) {
      console.error("Error fetching recent data:", error);
    }
  };

  // Fetch all data once on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch recent data every 5 seconds
  useEffect(() => {
    fetchRecentData();
    const intervalId = setInterval(() => {
      fetchRecentData();
    }, 10000);
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setShowLiveTable(!showLiveTable);
  };

  return (
    <>
      <main className="bg-blue-400 min-h-screen">
        <div className="main bg-white rounded-2xl mx-10 pb-10 shadow-xl">
          <h1 className="py-10 text-4xl font-bold text-center text-gray-900">
            Dashboard
          </h1>

          {/* Display recent_count below the heading */}
          <div className="text-center mt-6 mb-6">
            <div className="bg-blue-100 p-4 rounded-xl shadow-lg">
              <span className="text-lg font-semibold text-gray-800">
                Recent Entries Count:{" "}
              </span>
              <span className="text-3xl font-bold text-blue-700">
                {recentData.recent_count || 0}
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full mt-5">
            <DashboardStats data={data} />
            <div className="w-full text-center flex justify-center items-center">
              <DashboardGraph data={data} /> {/* Ensure data is passed as an array */}
            </div>
          </div>
        </div>
        <footer className="min-h-10"></footer>
      </main>
    </>
  );
};

export default Home;
