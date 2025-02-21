import "../styles/Tables.css";

function Table({ data }) {
  const headings = Object.keys(data[0]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-md text-left text-gray-700">
        <thead className="text-xs uppercase bg-orange-500 text-white">
          <tr>
            {headings.map((header, index) => (
              <th key={data[index].id} className="px-8 py-4 text-md">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={data[rowIndex].id}
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
