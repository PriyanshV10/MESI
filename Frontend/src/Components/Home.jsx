import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import DashboardGraph from "./DashboardGraph";
import DashboardStats from "./DashBoardStats";
import Table from "./Table";

const Home = () => {
  const [showLiveTable, setShowLiveTable] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/mess");
      const records = await response.json();
      setData(records); // Store all data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to filter data for the last 10 minutes
  const filterDataForLast10Minutes = () => {
    const currentTime = new Date();
    const timeLimit = currentTime.getTime() - 10 * 60 * 1000; // 10 minutes ago

    const filtered = data.filter((record) => {
      const recordTime = new Date(record.timestamp).getTime(); // Ensure `timestamp` exists in records
      return recordTime >= timeLimit; // Keep records within the last 10 minutes
    });

    setFilteredData(filtered);
  };

  // Fetch data every 5 seconds
  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Re-filter data whenever `data` is updated
  useEffect(() => {
    filterDataForLast10Minutes();
  }, [data]);

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setShowLiveTable(!showLiveTable);
  };

  return (
    <>
      <main className="bg-blue-400 min-h-screen">
        <div className="main bg-white rounded-2xl mx-10 pb-10">
          <h1 className="py-10 text-4xl font-bold text-center">Dashboard</h1>

          <div className="flex justify-center w-full mt-5">
            <DashboardStats data={data} />
            <div className="w-full text-center flex justify-center items-center">
              <DashboardGraph data={data} />
            </div>
          </div>

          {/* Show Live Table Checkbox */}
          <div className="flex justify-center mt-5">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLiveTable}
                onChange={handleCheckboxChange}
                className="w-4 h-4 mr-2"
              />
              <span className="text-lg text-gray-700">Show Live Table</span>
            </label>
          </div>

          {/* Conditionally Render Live Table */}
          {showLiveTable && <Table data={filteredData} />}
        </div>
        <footer className="min-h-10"></footer>
      </main>
    </>
  );
};

export default Home;
