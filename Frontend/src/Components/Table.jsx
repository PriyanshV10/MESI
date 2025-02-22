import { useState, useEffect } from "react";
import "../styles/Tables.css";

function Table({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" }); // Default sort by date and time in descending order
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false); // Data has been fetched
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when sorting changes
  }, [sortConfig]);

  // Handle case where data is not available or still loading
  if (loading) {
    return (
      <p className="flex justify-center h-screen text-xl text-gray-600">
        Loading...
      </p>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const headings = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorting logic (by date first, then time)
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === "date") {
      // Compare by date
      const aDate = new Date(a.date); // Assuming 'date' is in YYYY-MM-DD format
      const bDate = new Date(b.date);
      if (aDate !== bDate) {
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      // If dates are the same, compare by time
      const [aHours, aMinutes, aSeconds] = a.time.split(":").map(Number); // Split time into hours, minutes, and seconds
      const [bHours, bMinutes, bSeconds] = b.time.split(":").map(Number); // Split time into hours, minutes, and seconds

      // Compare hours, then minutes, then seconds
      if (aHours !== bHours) {
        return sortConfig.direction === "asc" ? aHours - bHours : bHours - aHours;
      }
      if (aMinutes !== bMinutes) {
        return sortConfig.direction === "asc" ? aMinutes - bMinutes : bMinutes - aMinutes;
      }
      return sortConfig.direction === "asc" ? aSeconds - bSeconds : bSeconds - aSeconds;
    }

    // Default sorting if it's not by date
    return 0;
  });

  // Reset to page 1 when rowsPerPage changes
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Get the current page's data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full flex-col">
      {/* Top Controls (Aligned with Table) */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-300">
        {/* Total Rows Count (Left) */}
        <span className="text-gray-700 font-semibold text-lg">
          Total Rows: {data.length}
        </span>

        {/* Rows Per Page Dropdown (Right) */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm">Rows per page:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md text-gray-700"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-md text-left text-gray-700">
        <thead className="text-sm uppercase bg-orange-500 text-white">
          <tr>
            {headings.map((header) => (
              <th
                key={header}
                className={`px-8 py-4 text-md cursor-pointer ${sortConfig.key === header ? "bg-orange-600" : ""}`}
                onClick={() => handleSort(header)}
              >
                {header} {sortConfig.key === header ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="bg-white border-b border-orange-300 hover:bg-orange-100"
            >
              {headings.map((header, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls Below Table */}
      <div className="relative flex justify-center items-center mt-4 py-4 px-4">
        {/* Pagination Controls (Centered) */}
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
