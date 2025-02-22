import { useState, useEffect } from "react";
import Table from "./Table";
import { da } from "@faker-js/faker";

function Fetch({ filters, repeatedUpdates }) {
  if (filters == null) return null;

  console.log(filters, repeatedUpdates);
  const [data, setData] = useState([]);
  const interval = 5000;
  useEffect(() => {
    const fetchdata = async () => {
      try {
        let queryString = "";
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== "") {
            if (queryString !== "") {
              queryString += "&";
            }
            queryString += `${encodeURIComponent(key)}=${encodeURIComponent(
              filters[key]
            )}`;
          }
        });
        const url = `https://precise-divine-lab.ngrok-free.app/dashboard`;
        const username = "admin@iiitkota.ac.in";
        const password = "adminpassword";

        const credentials = btoa("admin@iiitkota.ac.in:adminpassword"); // Encode username:password
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Basic ${credentials}`, // Attach Basic Auth Header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        } else {
          console.log("Successful");
        }
        const temp = await response.json();
        console.log(temp);
        setData(temp);

        console.log(temp);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if (repeatedUpdates === true) {
      const id = setInterval(fetchdata, interval);
      return () => clearInterval(id);
    }
    fetchdata();
  }, [filters]);

  return <Table data={data} />;
}

export default Fetch;
