import Fetch from "./Components/Fetch";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from "./Components/LoginPage";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Table from "./Components/Table";
import Details from "./Components/Details";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Fetch/></>
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
      element: <><Navbar/> <Details/></>
    }
  ])
  return (
    <>
      
      <RouterProvider router={router} />

    </>
  )
}

export default App;
