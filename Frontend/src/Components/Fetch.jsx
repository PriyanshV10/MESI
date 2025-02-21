import { useState, useEffect } from "react";
import Table from "./Table";

// function Fetch({ Filters }) {
//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         let queryString = "";
//         Object.keys(Filters).forEach((key) => {
//           if (Filters[key] !== "") {
//             if (queryString !== "") {
//               queryString += "&";
//             }
//             queryString += `${encodeURIComponent(key)}=${encodeURIComponent(
//               Filters[key]
//             )}`;
//           }
//         });
//         const url = `https://api.example.com/data?${queryString}`;
//         const response = await fetch(url);
//         if (response.ok) {
//           console.log("Signal connected");
//         }
//         const data = await response.json();
//         console.log(data);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
//     fetchdata();
//   }, [Filters]);
// }

// export default Fetch;
// }

export default function Fetch() {
  const data = [
    {
      name: "Aarav Mehta",
      id: "S101",
      time: "08:15 AM",
    },
    {
      name: "Ishaan Sharma",
      id: "S102",
      time: "08:20 AM",
    },
    {
      name: "Ananya Gupta",
      id: "S103",
      time: "08:25 AM",
    },
    {
      name: "Riya Verma",
      id: "S104",
      time: "08:30 AM",
    },
    {
      name: "Vihaan Joshi",
      id: "S105",
      time: "08:35 AM",
    },
  ];

  return <Table data={data} />;
}
