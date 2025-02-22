import React from "react";

const DashboardStats = () => {
  return (
    <div className="w-full flex flex-col items-center text-center px-4 py-8">
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">100</div>
          <div className="text-lg text-gray-600 mt-2">People ate Breakfast in last 24 hours.</div>
        </div>
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">80</div>
          <div className="text-lg text-gray-600 mt-2">People ate Lunch in last 24 hours.</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center mt-10">
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">90</div>
          <div className="text-lg text-gray-600 mt-2">People ate Dinner in last 24 hours.</div>
        </div>
        <div className="box">
          <div className="text-6xl font-extrabold text-gray-800">50</div>
          <div className="text-lg text-gray-600 mt-2">Total Snacks Served today.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
