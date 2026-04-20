import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Tabs, } from 'radix-ui'
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, LucideFileDiff, UserPlus, LucideX, } from "lucide-react";
import { toast } from 'sonner';
import { getDepartments } from '@/controllers/department.controller';
import { getRoles } from '@/controllers/roleApi.controller';
import { createEmployee } from '@/controllers/employee.controller';

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",


  // Professional details
  employeeCode: "",
  joiningDate: "",
  dateOfBirth: "",
  roleId: 0,        
  departmentId: 0,
  designation: "",


  // Address
  address: "",
  city: "",
  state: "",
  pincode: "",
}

function EmployeeRegister() {
  // const [open, setOpen] = React.useState(false);
  // const [bloodGroup, setBloodGroup] = React.useState("");
  const [formData, setFormData] = React.useState({ ...initialFormData })
  const [ActiveTab, setActiveTab] = React.useState("tab1");
  const [departments, setDepartments] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  // department get 

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments(); // API call
        // setDepartment(res.data);
        const data = res.data;
        setDepartments(data.departments || data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDepartments();
  }, []);


  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles(); // API call
        // setDepartment(res.data);
        console.log("ROLES:", roles);
        setRoles(res.data.data || res.data.roles || res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        setRoles([]);
      }
    }

    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);

      const res = await createEmployee(formData);
      console.log(res.data);
      
      setFormData({ ...initialFormData })
      toast.success(`Employee created successfully: ${res.data.employeeCode}`);


    } catch (error) {
      console.log(error);
    }
  }


  const handleNextTab1 = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("First Name and Last name are required");
      return;
    }
    setActiveTab("tab2");
  }

  const handleNextTab2 = () => {
    if (!formData.departmentId) {
      toast.error("Employee ID and Department are required");
      return;
    }
    setActiveTab("tab3");
  }


  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Main */}
      <main className='flex-1 p-3'>
        {/* Sidebar Trigger */}
        <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
          <SidebarTrigger />
        </div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow p-4 gap-3">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <UserPlus />
              </Button>

              <div>
                <h1 className="text-2xl font-light">Employee Registration</h1>
                <p className="text-xs text-gray-500">Add new employee to the system</p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <Button variant="outline" className="cursor-pointer">
                <Upload className="" />
                Bulk Upload
              </Button>
            </div>

          </div>
        </div>

        {/* Tabs Container */}
        <div className="bg-white rounded shadow p-3 ">
          {/* Tabs */}
          <form onSubmit={handleSubmit}>
            <Tabs.Root defaultValue="tab1" className="" value={ActiveTab} onValueChange={setActiveTab}>
              {/* Tab List */}
              <Tabs.List className="flex w-fit max-w-full mx-auto  overflow-x-auto no-scrollbar bg-gray-100 rounded-xl p-1 gap-2 " aria-label='manage your account'>
                <Tabs.Trigger value="tab1" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Personal Details</Tabs.Trigger>
                <Tabs.Trigger value="tab2" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Professional Details</Tabs.Trigger>
                <Tabs.Trigger value="tab3" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Contect & Address</Tabs.Trigger>
              </Tabs.List>

              {/* Tab 1 content */}
              <Tabs.Content value="tab1" className="mt-2">
                {/* Row 1 */}
                <div className='space-y-5 p-6'>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">First Name*</Label>
                      <Input type="text" name='firstName' onChange={handleChange} value={formData.firstName} placeholder="First Name" />
                    </div>

                    <div>
                      <Label className="mb-1 block">Last Name*</Label>
                      <Input type="text" name='lastName' onChange={handleChange} value={formData.lastName} placeholder="Last Name" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Email Address*</Label>
                      <Input type="email" name='email' onChange={handleChange} value={formData.email} placeholder="email" />
                    </div>

                    <div>
                      <Label className="mb-1 block">Phone Number*</Label>
                      <Input type="tel" name='phone' onChange={handleChange} value={formData.phone} placeholder="+91 XXXXXXXXXX" />
                    </div>
                  </div>

                    <div>
                      <Label className="mb-1 block">DateOfBirth*</Label>
                      <Input type="date" name='dateOfBirth' onChange={handleChange} value={formData.dateOfBirth} placeholder="YYYY-MM-DD" />
                    </div>
                 

                  {/* Row 3 */}


                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="reset" variant="outline" className=' cursor-pointer'>
                      <LucideX className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button type="button" variant="outline" className=' cursor-pointer' onClick={handleNextTab1}>
                      <LucideFileDiff className="w-4 h-4" />
                      Register Employee
                    </Button>
                  </div>
                </div>
              </Tabs.Content>


              {/* Tab 2 content */}
              <Tabs.Content value="tab2" className="mt-2">
                <div className=' space-y-5 p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <Label className='mb-1 block'>Employee ID*</Label>
                      <Input type="text" name='employeeCode' onChange={handleChange} value="auto generate" readOnly  placeholder="EM001" />
                    </div>

                    <div>
                      <Label className='mb-1 block'>Joining Date*</Label>
                      <Input type="date" name="joiningDate" onChange={handleChange} value={formData.joiningDate} placeholder="Joining Date" />
                    </div>
                  </div>



                  <div className=' grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <Label className='mb-1 block'>Department*</Label>
                      {/* <Input type="text" name='department' onChange={handleChange} value={formData.department} placeholder="Department" /> */}
                      {/* <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">Select Department</option>

                        {departments.map((dept: any) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select> */}
                      <Select.Root value={formData.departmentId ? String(formData.departmentId) : ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            departmentId: Number(value),
                          }))
                        } >
                        <Select.Trigger className="w-full border rounded-lg p-2 text-sm">
                          <Select.Value placeholder="Select Department" />
                          {/*  Ye dropdown icon hai */}

                        </Select.Trigger>
                        <Select.Content position='popper' className=" w-(--radix-select-trigger-width) bg-white rounded-lg shadow border  data-[state=open]: animate-in   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                          <Select.Group>
                            {departments.map((dept: any) => (
                              <Select.Item className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100  "

                                key={dept.id} value={String(dept.id)}>
                                <Select.ItemText>{dept.name}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>

                    </div>


                    <div>
                      <Label className='mb-1 block'>Designation*</Label>
                      <Input type="text" name='designation' onChange={handleChange} value={formData.designation} placeholder="Designation" />
                    </div>
                  </div>


                  {/* Role */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                    <div>
                      <Label className='mb-1 block'>Role*</Label>
                      <Select.Root value={formData.roleId ? String(formData.roleId) : ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            roleId: Number(value),
                          }))
                        } >

                        <Select.Trigger className="w-full border rounded-lg p-2 text-sm">
                          <Select.Value placeholder="Select Role" />

                        </Select.Trigger>
                        <Select.Content position='popper' className=" w-(--radix-select-trigger-width) bg-white rounded-lg shadow border  data-[state=open]: animate-in   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                          <Select.Group>
                            {roles.map((role: any) => (
                              <Select.Item className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100  "

                                key={role.id} value={String(role.id)}>
                                <Select.ItemText>{role.name}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>



                  {/* btn */}
                  <div className='flex justify-end gap-3 pt-4'>
                    <Button type='reset' className=' cursor-pointer' variant="outline">
                      <LucideX className="w-4 h-4" />
                      Cancel</Button>
                    <Button type="button" variant="outline" className=' cursor-pointer' onClick={handleNextTab2}>
                      <LucideFileDiff className="w-4 h-4" />
                      Next preview
                    </Button>
                  </div>
                </div>
              </Tabs.Content>


              {/* Tab 3 content */}
              <Tabs.Content value="tab3" className="mt-2">
                <div className=' space-y-5 p-6'>
                  <div className='gird grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <Label className='mb-1 block' >Address*</Label>
                      <Input type="text" name='address' onChange={handleChange} value={formData.address} placeholder="Address" />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <Label className='mb-1 block' >City *</Label>
                      <Input type="text" name='city' onChange={handleChange} value={formData.city} placeholder="City" />
                    </div>
                    <div>
                      <Label className='mb-1 block' >State *</Label>
                      <Input type="text" name='state' onChange={handleChange} value={formData.state} placeholder="State" />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <Label className='mb-1 block' >PinCode *</Label>
                      <Input type="number" name='pincode' onChange={handleChange} value={formData.pincode} placeholder="PinCode" />
                    </div>
                  </div>
                  <div className='flex justify-end gap-3 pt-4'>
                    <Button type='reset' variant="outline" className=' cursor-pointer'>
                      <LucideX className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button type='submit' variant="outline" className=' cursor-pointer'>
                      <LucideFileDiff className="w-4 h-4" />
                      Register Employee
                    </Button>
                  </div>
                </div>

              </Tabs.Content>

            </Tabs.Root>
          </form>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default EmployeeRegister
