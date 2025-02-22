import { useState, useEffect } from "react";
import "../styles/Tables.css";

function Table({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortConfig]);

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === "date") {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
    }
    return 0;
  });

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg w-full bg-white text-gray-900 flex-col">
      <div className="flex justify-between items-center px-4 py-2   rounded-t-lg border-b border-blue-400 ">
        <span className="font-semibold text-lg">Total Rows: {data.length}</span>

        <div className="flex items-center gap-2">
          <label className="text-sm">Rows per page:</label>
          <select
            className="px-2 py-1 border border-blue-300 bg-white text-gray-900 rounded-md"
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

      <table className="w-full text-md text-left border border-gray-300">
        <thead className="text-sm uppercase bg-blue-500 text-white">
          <tr>
            {headings.map((header) => (
              <th
                key={header}
                className={`px-6 py-4 cursor-pointer transition border border-gray-300 ${
                  sortConfig.key === header ? "bg-blue-600" : ""
                }`}
                onClick={() => handleSort(header)}
              >
                {header}{" "}
                {sortConfig.key === header
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="bg-white border-b border-gray-300 hover:bg-blue-100 transition"
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

      <div className="flex justify-center items-center mt-4 py-4 px-4">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 disabled:opacity-50 transition"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
