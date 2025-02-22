import { useState } from "react";
import Fetch from "./Fetch";

const FilterTray = () => {
  const [filters, setFilters] = useState({
    Name: "",
    Id: "",
    From: "",
    To: "",
    Meal: "",
  });

  const [isClicked, setIsclicked] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleClick = () => {
    setIsclicked(true);
  };
  return (
    <>
      <form>
        <div className="p-6 bg-white shadow-lg rounded-lg border border-orange-500 max-w-3xl mx-auto my-10">
          <h3 className="text-2xl font-semibold text-orange-600 mb-6 text-center">
            Filter Options
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="Name"
                className="text-orange-700 font-medium block mb-1"
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
                className="border border-orange-400 p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="Id"
                className="text-orange-700 font-medium block mb-1"
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
                className="border border-orange-400 p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="From"
                className="text-orange-700 font-medium block mb-1"
              >
                From Date
              </label>
              <input
                type="date"
                name="From"
                id="From"
                value={filters.From}
                onChange={handleChange}
                className="border border-orange-400 p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500 cursor-pointer"
                required
              />
            </div>

            <div>
              <label
                htmlFor="To"
                className="text-orange-700 font-medium block mb-1"
              >
                To Date
              </label>
              <input
                required
                type="date"
                name="To"
                id="To"
                value={filters.To}
                onChange={handleChange}
                className="border border-orange-400 p-2 rounded-md w-full focus:ring-2 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="Meal"
                className="text-orange-700 font-medium block mb-1"
              >
                Meal
              </label>
              <select
                name="Meal"
                id="Meal"
                className="bg-white border border-orange-400 text-orange-700 text-sm rounded-md focus:ring-2 focus:ring-orange-500 block w-full p-2"
                value={filters.Meal}
                onChange={handleChange}
              >
                <option value="">Select Meal</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-orange-500 text-white font-medium p-3 rounded-md hover:bg-orange-600 transition cursor-pointer"
            onClick={handleClick}
          >
            Apply Filters
          </button>
        </div>
        {isClicked && <Fetch filters={filters} />}
      </form>
    </>
  );
};

export default FilterTray;
