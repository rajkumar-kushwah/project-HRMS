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
import RoleHR from "./pages/employeemanagement/CreateHRRole"
import CheckIn from "./pages/Attendance/Check-in/CheckIn"
import  MonthlyAttendance from "./pages/Attendance/MonthlyAttendance"

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
        <Route path="/role" element={<RoleHR />} />
        <Route path="/check-in" element={<CheckIn/>} />
        <Route path="/monthly-attendance" element={<MonthlyAttendance/>} />
      </Routes>

    </Router>
  )
}

export default App