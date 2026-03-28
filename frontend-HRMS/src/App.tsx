import "./App.css"
// import Layout from "./components/layout"
import Signin from "./pages/Auth/signin"
import Signup from "./pages/Auth/singup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Profile from "./pages/profile"
import Dashboard from "./pages/Dashboard"
import { Toaster } from "sonner"
import Employee from "./pages/employeemanagement/EmployeeRegister"
import Department from "./pages/Departments/Department"
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* <Route path="/" element={<Signup />} /> */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/department" element={<Department />} />
      </Routes>

    </Router>
  )
}

export default App