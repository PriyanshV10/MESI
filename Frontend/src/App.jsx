import Fetch from "./Components/Fetch";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import LoginPage from "./Components/LoginPage";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Table from "./Components/Table";
import FilterTray from "./Components/Filters";
import WebcamCapture from "./Components/Webcam";
import UploadPhotos from "./Components/UploadPhotos";
import Webcam from "react-webcam";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navigate to="/login"/></>
    },
    {
      path: "/login",
      element: <><LoginPage/></>
    },
    {
      path: "/connect-camera",
      element: <><Navbar/> <UploadPhotos /></>
    },
    {
      path: "/home",
      element: <><Navbar/> <Home/></>
    },
    {
      path: "/table",
      element: <><Navbar/> <FilterTray /><Fetch/></>
    }
  ])
  return (
    <>
      <RouterProvider router={router}  />
    </>
  );
}

export default App;
