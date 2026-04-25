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
import { getEmployees, deleteEmployee, updateEmployee, filterEmployee } from "@/controllers/employee.controller"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRoles } from "@/controllers/roleApi.controller"
import { getDepartments } from "@/controllers/department.controller"
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemText, SelectTrigger, SelectValue } from "@radix-ui/react-select"
// import { useLocation } from "react-router-dom";
import { getprofile } from "@/controllers/profile.controller"
import MonthlyAttendance from "./Attendance/MonthlyAttendance"
interface Employee {
  dateOfBirth: string
  id: number;

  firstName: string;
  lastName: string;
  phone: string;

  employeeCode: string;
  joiningDate: string;

  user: {
    email: string;
    roles: {
      id: number;
      name: string;
    }[];
  };
  department: {
    id: number;
    name: string;
  };

  designation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface EmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeCode: string;
  joiningDate: string;
  dateOfBirth: string;
  roleId: number;
  departmentId: number;
  designation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

}


const Dashboard = () => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [ViewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = React.useState<EmployeeForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeCode: "",
    joiningDate: "",
    dateOfBirth: "",
    roleId: 0,
    departmentId: 0,
    designation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [role, setRole] = useState<string>('');
  const [searchItem, setSearchItem] = useState('');


  const dashboardContent = {
    SUPER_ADMIN: {
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


  const { title, desc } =
    dashboardContent[role as keyof typeof dashboardContent] ?? {
      title: "Dashboard",
      desc: "Welcome to HRMS",
    }

  // filter employee 

  const handleApplyFilter = async () => {
    try {
      if (!searchItem.trim()) return;
      if (searchItem) {
        const res = filterEmployee(searchItem);
        res.then(res => setEmployees(res.data.data || res.data || []));
      } else {
        const res = await getEmployees();
        setEmployees(res.data.data || res.data || []);
        console.log("EMP:", res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // clear filter

  const handleClearFilter = async () => {
    try {
      setSearchItem("");
      const res = await getEmployees(); // api call data bapas
      setEmployees(res.data.data || res.data || []);
      console.log("EMP:", res.data);
    } catch (error) {
      console.error(error);
    }
  }



  //  get employee teble data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // dashbaord header user role and signin user status header this change user role

        const res = await getprofile();

        if (!res?.data) {
          navigate('/signin');
          return;
        }

        setRole(res.data.role?.name || res.data.roles?.[0]);


        console.log("ROLE:", role);
        console.log("PROFILE FULL:", res.data);

        //   Baaki data load karne ke liye
        const [emp, roleRes, departmentRes] = await Promise.all([
          getEmployees(),
          getRoles(),
          getDepartments(),
        ]);

        setEmployees(emp.data.data || emp.data || []);

        setRoles(
          Array.isArray(roleRes.data)
            ? roleRes.data
            : roleRes.data.data || []
        );

        setDepartments(departmentRes.data.departments);
        console.log("roles:", roleRes.data);
        console.log("departments:", departmentRes.data); 

      } catch (error: any) {
        console.error("Dashboard error:", error);

        // Unauthorized error handling
        if (error.response?.status === 401) {
          navigate('/signin');
        } else {
          toast.error("Something went wrong");
        };
      };
    };

    fetchData();

    window.addEventListener("employee-created", fetchData);

    return () => {
      window.removeEventListener("employee-created", fetchData);
    };
  }, []);

  // view employee data 
  const handleView = (emp: Employee) => {
    setViewEmployee(emp);
    setViewOpen(true);
  }

  //  update employee data
  const handleUpdate = async (id: number) => {
    try {
      const res = await updateEmployee(id, formData);
      console.log(res.data);
      toast.success("Employee updated successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update employee");
    }
  }


  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.user?.email,
      phone: emp.phone,
      employeeCode: emp.employeeCode,
      joiningDate: emp.joiningDate,
      dateOfBirth: emp.dateOfBirth,
      roleId: emp.user?.roles?.[0]?.id || 0,
      departmentId: emp.department?.id || 0,
      designation: emp.designation,
      address: emp.address,
      city: emp.city,
      state: emp.state,
      pincode: emp.pincode,
    });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }
  const handleDelete = async (id: number) => {
    window.confirm("Are you sure you want to delete this employee?");
    try {
      const res = await deleteEmployee(id);
      console.log(res.data);
      toast.success("Employee deleted successfully");
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete employee");
    }
  }

  filterEmployee(searchItem);

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
              <CardTitle>{employees?.length > 0 ? employees.length : 0}</CardTitle>
              <CardDescription>Total Employees</CardDescription>
            </CardHeader>
            {/* <CardContent>Active employees in company</CardContent> */}
            <CardFooter className="text-xs">+12 this month</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Clock className="h-6 w-6 " />
              </div>
              <CardTitle>{MonthlyAttendance.length}</CardTitle>
              <CardDescription>Monthly Attendance</CardDescription>
            </CardHeader>
            {/* <CardContent>Employees present today</CardContent> */}
            <CardFooter className="text-xs"> +12 this month </CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Building2 className="h-6 w-6 " />
              </div>
              <CardTitle>{departments.length}</CardTitle>
              <CardDescription>Department</CardDescription>
            </CardHeader>
            {/* <CardContent>Leave requests waiting approval</CardContent> */}
            <CardFooter className="text-xs"> +12 this month </CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center"  >
                <Shield className="h-6 w-6 " />
              </div>
              <CardTitle>{roles.length}</CardTitle>
              <CardDescription>Roles</CardDescription>
            </CardHeader>
            {/* <CardContent>{"HR Managers"}</CardContent> */}
            <CardFooter className="text-xs">Roles assigned</CardFooter>
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
          <Card onClick={() => navigate("/check-in")} className="cursor-pointer hover:shadow-md transition p-2">
            <CardHeader className="flex items-center p-2"  >
              <div className="border shadow rounded-md w-10 h-10 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>check-in/out</CardTitle>
                <CardDescription className="text-xs">check-in/out</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 p-3 border rounded-lg w-full overflow-x-auto mt-5">
          {/* filter table data  */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by name..."
                className="border rounded-md px-2 py-1 mr-2"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />

              <div>
                <Button variant="outline" onClick={handleApplyFilter} className="text-xs px-6 py-1 cursor-pointer"> Apply </Button>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={handleClearFilter}
                  className="text-xs px-4 py-1 cursor-pointer"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>


          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 ">
                <TableHead>EmployeeCode</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(employees) && employees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.employeeCode}</TableCell>
                  <TableCell>{emp.firstName} {emp.lastName} <span className="flex flex-col text-xs ">Joined: {new Date(emp.joiningDate).toLocaleDateString()}</span> </TableCell>
                  <TableCell className="text-xs ">
                    <span className="flex text-xs items-center gap-1">
                      <Mail className="w-2 h-2 " />  {emp.user?.email || "N/A"}</span>
                    <span className="flex text-xs items-center gap-1"><Phone className="w-2 h-2" /> {emp.phone}</span></TableCell>
                  <TableCell>{emp.department?.name}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell> {emp.user?.roles?.length > 0
                    ? emp.user.roles[0].name
                    : "No Role"}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(emp)}>Edit</DropdownMenuItem>
                          {/* update dialog form */}


                          <DropdownMenuItem onClick={() => handleDelete(emp.id)} >Delete</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(emp)}>View</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
                || (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No Employees Found
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>


          {/* update dialog */}
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Update Employee</DialogTitle>
                  <DialogDescription>
                    Update the employee
                  </DialogDescription>
                </DialogHeader>
                <div className="" >
                  <form className="grid grid-cols-2 gap-2 " >
                    <div className=" text-xs">
                      <Label />FirstName
                      <Input placeholder="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className=" text-xs">
                      <Label />LastName
                      <Input placeholder="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className=" text-xs">
                      <Label />Email
                      <Input placeholder="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />Phone
                      <Input placeholder="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />EmployeeCode
                      <Input placeholder="employeeCode" name="employeeCode" value={formData.employeeCode} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />JoiningDate
                      <Input placeholder="joiningDate" name="joiningDate" value={new Date(formData.joiningDate).toLocaleDateString()} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />DateOfBirth
                      <Input placeholder="dateOfBirth" name="dateOfBirth" value={new Date(formData.dateOfBirth).toLocaleDateString()} onChange={handleChange} />
                    </div>

                    <div>
                      <Label className='mb-1 block'>Role*</Label>
                      <Select value={formData.roleId ? String(formData.roleId) : ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            roleId: Number(value),
                          }))
                        } >

                        <SelectTrigger className="w-full border rounded-lg p-2 text-sm">
                          <SelectValue placeholder="Select Role" />

                        </SelectTrigger>
                        <SelectContent position='popper' className=" w-(--radix-select-trigger-width) bg-white rounded-lg shadow border  data-[state=open]: animate-in   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                          <SelectGroup>
                            {roles.map((role: any) => (
                              <SelectItem className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100  "

                                key={role.id} value={String(role.id)}>
                                <SelectItemText>{role.name}</SelectItemText>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className=" text-xs">
                      <Label /> Department
                      <Select value={formData.departmentId ? String(formData.departmentId) : ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            departmentId: Number(value),
                          }))
                        } >
                        <SelectTrigger className="w-full border rounded-lg p-2 text-sm">
                          <SelectValue placeholder="Select Department" />
                          {/*  Ye dropdown icon hai */}

                        </SelectTrigger>
                        <SelectContent position='popper' className=" w-(--radix-select-trigger-width) bg-white rounded-lg shadow border  data-[state=open]: animate-in   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                          <SelectGroup>
                            {departments.map((dept: any) => (
                              <SelectItem className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100  "

                                key={dept.id} value={String(dept.id)}>
                                <SelectItemText>{dept.name}</SelectItemText>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className=" text-xs">
                      <Label />Designation
                      <Input placeholder="designation" name="designation" value={formData.designation} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />Address
                      <Input placeholder="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />City
                      <Input placeholder="city" name="city" value={formData.city} onChange={handleChange} />
                    </div>

                    <div className=" text-xs">
                      <Label />State
                      <Input placeholder="state" name="state" value={formData.state} onChange={handleChange} /></div>

                    <div className=" text-xs">
                      <Label />Pincode
                      <Input placeholder="pincode" name="pincode" value={formData.pincode} onChange={handleChange} /></div>
                    <div>

                    </div>

                  </form>
                </div>
                <div className="flex">
                  <Button variant="outline" className="w-full cursor-pointer" onClick={() =>
                    selectedEmployee && handleUpdate(selectedEmployee.id)
                  }>Update Employee</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>


          {/* View Employee data */}

          <div>
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Employee Details</DialogTitle>
                  <DialogDescription>View complete employee information</DialogDescription>
                </DialogHeader>

                {ViewEmployee && (
                  <div className="">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {ViewEmployee.firstName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {ViewEmployee.firstName} {ViewEmployee.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ViewEmployee.designation}
                        </p>
                      </div>
                    </div>

                    {/* <div>
                      <p className="text-gray-500 text-xs">Full Name</p>
                      <p className="font-medium">
                        {ViewEmployee.firstName} {ViewEmployee.lastName}
                      </p>
                    </div> */}
                    <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                      <div>
                        <p className="text-gray-500 text-xs">Email</p>
                        <p className="font-medium">{ViewEmployee.user?.email}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="font-medium">{ViewEmployee.phone}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Employee Code</p>
                        <p className="font-medium">{ViewEmployee.employeeCode}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Department</p>
                        <p className="font-medium">{ViewEmployee.department?.name}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Role</p>
                        <p className="font-medium">
                          {ViewEmployee.user?.roles?.length > 0
                            ? ViewEmployee.user.roles[0].name
                            : "N/A"}
                        </p>
                      </div>

                      {/* <div>
                      <p className="text-gray-500 text-xs">Designation</p>
                      <p className="font-medium">{ViewEmployee.designation}</p>
                    </div> */}

                      <div>
                        <p className="text-gray-500 text-xs">Joining Date</p>
                        <p className="font-medium">
                          {new Date(ViewEmployee.joiningDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Date of Birth</p>
                        <p className="font-medium">
                          {new Date(ViewEmployee.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Address</p>
                        <p className="font-medium">
                          {ViewEmployee.address}, {ViewEmployee.city}, {ViewEmployee.state} - {ViewEmployee.pincode}
                        </p>
                      </div>

                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </main>
    </SidebarProvider>
  )
}

export default Dashboard