import { useState } from "react";
import Table from "./Table";

const FilterTray = () => {
  const [filters, setFilters] = useState({
    Name: "",
    Id: "",
    From: "",
    To: "",
    Meal: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isClicked, setIsclicked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const fetchDashboardData = async (e) => {
    e.preventDefault();

    try {
      const url = "https://precise-divine-lab.ngrok-free.app/dashboard";
      const username = "admin@iiitkota.ac.in";
      const password = "adminpassword";

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

      const responseData = await response.json();
      console.log("Raw Dashboard Data:", responseData);

      if (!responseData.entries || !Array.isArray(responseData.entries)) {
        throw new Error(
          "Invalid response format: Expected an array of entries"
        );
      }

      const filteredData = responseData.entries
        .filter((entry) => {
          const fromDate = filters.From ? new Date(filters.From) : null;
          const toDate = filters.To ? new Date(filters.To) : null;
          const entryDate = new Date(entry.entry_time);

          return (
            (!filters.Name ||
              entry.name.toLowerCase().includes(filters.Name.toLowerCase())) &&
            (!filters.Id || entry.person_id.toString() === filters.Id.trim()) &&
            (!fromDate || entryDate >= fromDate) &&
            (!toDate || entryDate <= toDate) &&
            (!filters.Meal ||
              entry.meal_type.toLowerCase() === filters.Meal.toLowerCase())
          );
        })
        .map((entry) => ({
          ...entry,
          entry_time: new Date(entry.entry_time).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        }));

      console.log("Filtered Data:", filteredData);
      setFilteredData(filteredData);
      setIsclicked(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <>
      <form onSubmit={fetchDashboardData}>
        <div className="p-6 bg-white shadow-lg rounded-lg border border-blue-500 max-w-3xl mx-auto my-10">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
            Filter Options
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="Name"
                className="text-blue-700 font-medium block mb-1"
              >
                Name
              </label>
              <input
                type="text"
                name="Name"
                id="Name"
                value={filters.Name}
                onChange={handleChange}
                placeholder="Enter Name"
                className="border border-blue-400 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="Id"
                className="text-blue-700 font-medium block mb-1"
              >
                ID
              </label>
              <input
                type="text"
                name="Id"
                id="Id"
                value={filters.Id}
                onChange={handleChange}
                placeholder="Enter ID"
                className="border border-blue-400 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="From"
                className="text-blue-700 font-medium block mb-1"
              >
                From Date
              </label>
              <input
                type="date"
                name="From"
                id="From"
                value={filters.From}
                onChange={handleChange}
                className="border border-blue-400 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="To"
                className="text-blue-700 font-medium block mb-1"
              >
                To Date
              </label>
              <input
                type="date"
                name="To"
                id="To"
                value={filters.To}
                onChange={handleChange}
                className="border border-blue-400 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="Meal"
                className="text-blue-700 font-medium block mb-1"
              >
                Meal
              </label>
              <select
                name="Meal"
                id="Meal"
                className="bg-white border border-blue-400 text-blue-700 text-sm rounded-md focus:ring-2 focus:ring-blue-500 block w-full p-2"
                value={filters.Meal}
                onChange={handleChange}
              >
                <option value="">Select Meal</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
                <option value="Dinner">off</option>
              </select>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-blue-500 text-white font-medium p-3 rounded-md hover:bg-blue-600 transition cursor-pointer"
            type="submit"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {isClicked && <Table data={filteredData} />}
    </>
  );
};

export default FilterTray;
