import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./login.jsx"

//Home page 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1> Home</h1>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App 