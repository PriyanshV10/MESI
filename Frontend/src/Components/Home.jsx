import React from "react";
import "./Home.css";
import DashboardGraph from "./DashboardGraph";
import DashboardStats from "./DashBoardStats";

const Home = () => {
  return (
    <>
      <main className="bg-orange-400 h-[91vh]">
        <div className="main bg-white rounded-2xl mx-10 pb-10">
          <h1 className="py-10 text-4xl font-bold text-center">Dashboard</h1>
          <div className="flex justify-center w-full mt-5">
            <DashboardStats/>
            <div className="w-full text-center flex justify-center items-center">
              <DashboardGraph/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
