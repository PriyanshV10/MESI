import { useState, useEffect } from "react";
import Table from "./Table";

// function Fetch({ Filters }) {
//   const [data, setData] = useState([]);
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
//         const temp = await response.json();
//         setData(temp);
//         console.log(temp);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
//     fetchdata();
//   }, [Filters]);
//   console.log(data);
//   return <Table data={data} />;
// }

// export default Fetch;

export default function Fetch() {
  const data = [
    { name: "Aarav Mehta", id: "S101", time: "08:15 AM" },
    { name: "Ishaan Sharma", id: "S102", time: "08:20 AM" },
    { name: "Ananya Gupta", id: "S103", time: "08:25 AM" },
    { name: "Riya Verma", id: "S104", time: "08:30 AM" },
    { name: "Vihaan Joshi", id: "S105", time: "08:35 AM" },
    { name: "Dhruv Patel", id: "S106", time: "08:40 AM" },
    { name: "Saanvi Singh", id: "S107", time: "08:45 AM" },
    { name: "Kabir Khan", id: "S108", time: "08:50 AM" },
    { name: "Myra Desai", id: "S109", time: "08:55 AM" },
    { name: "Arjun Reddy", id: "S110", time: "09:00 AM" },
    { name: "Nisha Agarwal", id: "S111", time: "09:05 AM" },
    { name: "Rajiv Kapoor", id: "S112", time: "09:10 AM" },
    { name: "Aditi Mehra", id: "S113", time: "09:15 AM" },
    { name: "Yash Gupta", id: "S114", time: "09:20 AM" },
    { name: "Kiran Verma", id: "S115", time: "09:25 AM" },
    { name: "Pranav Deshmukh", id: "S116", time: "09:30 AM" },
    { name: "Shreya Rao", id: "S117", time: "09:35 AM" },
    { name: "Tanishq Singh", id: "S118", time: "09:40 AM" },
    { name: "Rohit Chauhan", id: "S119", time: "09:45 AM" },
    { name: "Isha Malhotra", id: "S120", time: "09:50 AM" },
  ];

  return <Table data={data} />;
}
