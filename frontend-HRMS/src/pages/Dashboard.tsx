import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import {
  Card,

  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, Users, Clock, Building2, Calendar, Mail, Phone, MoreVertical, } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React, { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Employee {
  FirstName: string;
  LastName: string;
  Email: string;
  joiningDate: string;
  Phone: string;
  employeeId: string;
  department: string;
  designation: string;
  Role: string;
}


const Dashboard = () => {

  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);


  const dashboardContent = {
    OWNER: {
      title: "Owner Dashboard",
      desc: "Manage employees, HR and system settings",
    },
    ADMIN: {
      title: "Admin Dashboard",
      desc: "Manage employees and operations",
    },
    EMPLOYEE: {
      title: "Employee Dashboard",
      desc: "View your profile and attendance",
    },
  };

  const role = "OWNER";

  const { title, desc } =
    dashboardContent[role] ?? {
      title: "Dashboard",
      desc: "Welcome to HRMS",
    }


  //  get employee teble data

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("employees") || "[]");
    console.log("Dashboard Data:", data);
    setEmployees(data);
  }, []);


  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1 p-3 ">
        <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
          <SidebarTrigger />
        </div>


        <div className="mb-6">
          <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow p-4 gap-3">

            <div className=" flex items-center gap-3">
              <div
                className=" border shadow rounded-md w-10 h-10 flex items-center justify-center "
              >
                <Shield className="size-8" />
              </div>


              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-2 text-sm">
                  {desc}
                </p>
              </div>
            </div>

            <div className="flex justify-end" >
              <Button variant="outline" onClick={() => navigate("/employees")}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Employee</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Users className="h-6 w-6 " />
              </div>
              <CardTitle>120</CardTitle>
              <CardDescription>Total Employees</CardDescription>
            </CardHeader>
            {/* <CardContent>Active employees in company</CardContent> */}
            <CardFooter>+12 this month</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Clock className="h-6 w-6 " />
              </div>
              <CardTitle>40</CardTitle>
              <CardDescription>Acitve Today</CardDescription>
            </CardHeader>
            {/* <CardContent>Employees present today</CardContent> */}
            <CardFooter>Attendance report</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Building2 className="h-6 w-6 " />
              </div>
              <CardTitle>8</CardTitle>
              <CardDescription>Department</CardDescription>
            </CardHeader>
            {/* <CardContent>Leave requests waiting approval</CardContent> */}
            <CardFooter>All Acitve</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Shield className="h-6 w-6 " />
              </div>
              <CardTitle>{"5"}</CardTitle>
              <CardDescription>{"HR Mangers"}</CardDescription>
            </CardHeader>
            {/* <CardContent>{"HR Managers"}</CardContent> */}
            <CardFooter>3 Active now</CardFooter>
          </Card>



        </div>
        {/* */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5 ">

          {/* Employee register card */}
          <Card onClick={() => navigate("/employees")} className="cursor-pointer hover:shadow-md transition p-2">
            <CardHeader className="flex items-center p-2">
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center">
                <UserPlus className="h-4 w-4" />
              </div>

              <div>
                <CardTitle>Employees Register</CardTitle>
                <CardDescription className="text-xs">Add new team member</CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Role Assign card */}
          <Card onClick={() => navigate("/role")} className="cursor-pointer hover:shadow-md transition p-2">
            <CardHeader className="flex items-center p-2"  >
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Create HR Role </CardTitle>
                <CardDescription className="text-xs">Assign HR privileges</CardDescription>
              </div>
            </CardHeader>
          </Card>
          {/* View Attendance card and monthly report */}
          <Card onClick={() => navigate("/monthly-attendance")} className="cursor-pointer hover:shadow-md transition p-2">
            <CardHeader className="flex items-center p-2"  >
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>View Attendance</CardTitle>
                <CardDescription className="text-xs">Monthly reports</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 p-3 border rounded-lg w-full overflow-x-auto mt-5">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 ">
                <TableHead>EmployeeId</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.FirstName} {emp.LastName} <span className="flex flex-col text-xs ">Joined: {emp.joiningDate}</span> </TableCell>
                  <TableCell className="text-xs ">
                    <span className="flex text-xs items-center gap-1">
                      <Mail className="w-2 h-2 " />{emp.Email}</span>
                    <span className="flex text-xs items-center gap-1"><Phone className="w-2 h-2" /> {emp.Phone}</span></TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.Role || "N/A"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="p-2 ">
                        {/* 3 dots */}
                        <Button variant="ghost" className="p-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                          <DropdownMenuItem>View</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Dashboard