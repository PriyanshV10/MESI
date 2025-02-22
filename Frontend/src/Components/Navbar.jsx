import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-between shadow-lg ">
    
      <div className="text-2xl font-semibold tracking-wide px-4">
        Mess Management
      </div>

      <ul className="flex gap-6 text-lg">
        {["Home", "Table", "Connect Camera"].map((name, index) => (
          <NavLink
            key={index}
            to={`/${name.replaceAll(" ","-").toLowerCase()}`}
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 ${
                isActive ? "bg-blue-800" : ""
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </ul>

      <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition duration-300 shadow-sm">
        Account
      </button>
    </nav>
  );
};

export default Navbar;
