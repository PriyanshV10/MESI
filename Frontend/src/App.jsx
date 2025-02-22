import Fetch from "./Components/Fetch";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from "./Components/LoginPage";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Table from "./Components/Table";
import Details from "./Components/Details";
import FilterTray from "./Components/Filters";
import WebcamCapture from "./Components/Webcam";
import UploadPhotos from "./Components/UploadPhotos";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><FilterTray /><Fetch/> <UploadPhotos /></>
    },
    {
      path: "/login",
      element: <><LoginPage/></>
    },
    {
      path: "/nav",
      element: <><Navbar/></>
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
