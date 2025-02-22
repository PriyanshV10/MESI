import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full px-10 py-4 bg-orange-400 text-white flex items-center justify-between">
      {/* Logo / Brand Name */}
      <div className="text-2xl font-semibold">Mess Management</div>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-lg">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `relative transition duration-300 hover:text-gray-200 ${
              isActive ? "underline decoration-2 underline-offset-4" : ""
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/table"
          className={({ isActive }) =>
            `relative transition duration-300 hover:text-gray-200 ${
              isActive ? "underline decoration-2 underline-offset-4" : ""
            }`
          }
        >
          Table
        </NavLink>
      </ul>

      {/* Account Section */}
      <div className="text-lg font-medium hover:scale-105 transition duration-300 cursor-pointer">
        Account
      </div>
    </nav>
  );
};

export default Navbar;
