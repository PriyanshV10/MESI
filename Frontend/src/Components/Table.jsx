import "../styles/Tables.css";

function Table({ data }) {

  if (data.length === 0 || data === null) {
    return (
      <p className="flex justify-center h-screen text-xl text-gray-600">
        Nothing to fetch
      </p>
    );
  }
  const headings = Object.keys(data[0]);
  console.log(data[10]);

  return (
    
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-md text-left text-gray-700">
        <thead className="text-xs uppercase bg-orange-500 text-white">
          <tr>
            {headings.map((header, index) => (
              <th key={header} className="px-8 py-4 text-md">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
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
    </div>
    
  );
}

export default Table;
