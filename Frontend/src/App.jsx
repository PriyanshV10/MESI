import Fetch from "./Components/Fetch";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from "./Components/LoginPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Fetch/></>
    },
    {
      path: "/login",
      element: <><LoginPage/></>
    }
  ])
  return (
    <>
      
      <RouterProvider router={router} />

    </>
  )
}

export default App;
