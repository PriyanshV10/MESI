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
        const url = `http://localhost:3000/api/mess`;
        const response = await fetch(url);
        if (response.ok) {
          console.log("Signal connected");
        } else {
          console.log(response.status);
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
