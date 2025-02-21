import { useState } from 'react'
import './App.css'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Home /></>
    },
    {
      path: "/login",
      element: <><Navbar /><Login /></>
    },
  ])
  return (
    <>
      
      <RouterProvider router={router} />

    </>
  )
}

export default App
