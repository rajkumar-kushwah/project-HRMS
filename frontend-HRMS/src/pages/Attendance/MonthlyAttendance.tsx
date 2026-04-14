import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Calendar, ChevronDown, FileText, Filter, LogIn } from 'lucide-react'
import { Select } from 'radix-ui'
import React from 'react'
import { Tabs } from 'radix-ui'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

function MonthlyAttendance() {

  const tableDate = [
    { id: 1, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "1", day: "Mon", status: "P" },
    { id: 2, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "2", day: "Tue", status: "A" },
    { id: 3, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "3", day: "Wed", status: "A" },
    { id: 4, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "4", day: "Thu", status: "P" },
    { id: 5, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "5", day: "Fri", status: "P" },
    { id: 6, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "6", day: "Sat", status: "P" },
    { id: 7, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "7", day: "Sun", status: "WO" },
    { id: 8, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "8", day: "Mon", status: "P" },
    { id: 9, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "9", day: "Tue", status: "A" },
    { id: 10, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "10", day: "Wed", status: "P" },
    { id: 11, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "11", day: "Thu", status: "A" },
    { id: 12, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "12", day: "Fri", status: "P" },
    { id: 13, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "13", day: "Sat", status: "P" },
    { id: 14, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "14", day: "Sun", status: "WO" },
    { id: 15, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "15", day: "Mon", status: "P" },
    { id: 16, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "16", day: "Tue", status: "P" },
    { id: 17, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "17", day: "Wed", status: "A" },
    { id: 18, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "18", day: "Thu", status: "A" },
    { id: 19, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "19", day: "Fri", status: "P" },
    { id: 20, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "20", day: "Sat", status: "P" },
    { id: 21, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "21", day: "Sun", status: "WO" },
    { id: 22, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "22", day: "Mon", status: "P" },
    { id: 23, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "23", day: "Tue", status: "A" },
    { id: 24, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "24", day: "Wed", status: "A" },
    { id: 25, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "25", day: "Thu", status: "A" },
    { id: 26, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "26", day: "Fri", status: "P" },
    { id: 27, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "27", day: "Sat", status: "P" },
    { id: 28, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "28", day: "Sun", status: "WO" },
    { id: 29, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "29", day: "Mon", status: "A" },
    { id: 30, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "30", day: "Tue", status: "P" },
    { id: 31, Employee: "Amit", department: "admin", EmpStatus: "Acitve", date: "31", day: "Wed", status: "P" },
  ]

  const [currentPage, setCurrentPage] = React.useState(1);
  const [open, setOpen] = React.useState(false)

  const rowperPage = 7
  const startIndex = (currentPage - 1) * rowperPage;
  // const endIndex = startIndex + rowperPage;

  const currentData = tableDate.slice(startIndex, startIndex + rowperPage);

  const totalPage = Math.ceil(tableDate.length / rowperPage)
  const visiblePages = Math.max(totalPage, 5)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 p-3 '>
        <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
          <SidebarTrigger />
        </div>
        {/* <Tabs.Root defaultValue="tab1"> */}
        <Tabs.Root defaultValue="tab1">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow p-4 gap-3">

              <div className='flex flex-col justify-between w-full '>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full'>

                  {/* LEFT SIDE */}
                  <div className="flex  items-center gap-3">
                    <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                      <Calendar className='w-5 h-5' />
                    </div>

                    {/* title and subtitle */}
                    <div>
                      <h1 className="text-2xl font-light">Monthly Attendance Report</h1>
                      <p className="text-xs text-gray-500">Comprehensive monthly attendance tracking and analysis</p>
                    </div>
                  </div>

                  {/* RIGHT SIDE - month and year filter */}
                  <div>
                    {/* <h1 className="text-sm font-medium mb-1">*</h1> */}
                    <Select.Root open={open} onOpenChange={setOpen} >
                      <Select.Trigger className="w-full border  rounded px-2 py-1 text-xs flex justify-between items-center gap-2">
                        <Calendar className='w-4 h-4' />
                        <Select.Value placeholder="Select a month" />
                        <ChevronDown className={`w-4 h-4 opacity-50 ${open && "rotate-180"}`} />

                      </Select.Trigger>

                      <Select.Content position='popper' sideOffset={4} className="w-(--radix-select-trigger-width) z-50 bg-white rounded shadow border data-[state=open]:animate-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ">
                        <Select.Item value="August" className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 w-full">
                          <Select.ItemText>August 2026</Select.ItemText>
                        </Select.Item>

                        <Select.Item value="May" className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 w-full">
                          <Select.ItemText>May 2026</Select.ItemText>
                        </Select.Item>

                        <Select.Item value="June" className="px-2 py-1 text-xs  cursor-pointer hover:bg-gray-100 w-full">
                          <Select.ItemText>June 2026</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="July" className="px-2 py-1 text-xs  cursor-pointer hover:bg-gray-100 w-full">
                          <Select.ItemText>July 2026</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>

                {/*  NEW SECTION (tabs + actions buttons) */}
                <div className="flex flex-wrap  gap-2 pt-3">
                  {/* Tabs */}
                  <div className="flex  gap-2 justify-center items-center">

                    <Tabs.List className="flex  gap-2 bg-gray-100 rounded-lg">
                      <Tabs.Trigger value="tab2" className="px-3 py-1 text-sm cursor-pointer rounded-lg  data-[state=active]:bg-gray-200 ">
                        Summary
                      </Tabs.Trigger>
                      <Tabs.Trigger value="tab1" className="px-3 py-1 text-sm cursor-pointer rounded-lg data-[state=active]:bg-gray-200 ">
                        Detail
                      </Tabs.Trigger>
                    </Tabs.List>

                  </div>

                  {/* Actions */}
                  <div className="">
                    <div className=' gap-1 flex flex-wrap '>
                      <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1   ">
                        <Filter className="w-4 h-4" />
                        Filter
                      </Button>

                      <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1 ">
                        <LogIn className="w-4 h-4  rotate-90  " />
                        Attedance Export
                      </Button>

                      <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1 ">
                        <LogIn className="w-4 h-4 rotate-270  " />
                        Import
                      </Button>

                      <Button className="text-xs cursor-pointer items-center justify-center  px-2 py-1 " variant="outline">
                        <FileText className="w-4 h-4" />
                        Template
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* tabs contenct 1 */}
          <Tabs.Content value="tab2" className=" ">
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-3 p-3">

                  {/* cards total present  */}
                  <div className="flex flex-col border rounded-lg p-3 gap-1 hover:shadow-md transition ">
                    <CardTitle className="text-sm font-medium">Total Present</CardTitle>
                    <CardDescription className="text-lg font-semibold text-black">{"1,847"}</CardDescription>
                    <CardDescription className="text-xs text-gray-500">{"86.4% of total days"}</CardDescription>
                  </div>

                  {/* cards total absent */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2hover:shadow-md transition p-2 hover:shadow-md ">
                    <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{"124"}</CardDescription>
                    <CardDescription>{"5.8% of total days"}</CardDescription>
                  </div>

                  {/* cards late arrival */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition ">
                    <CardTitle className="text-sm font-medium">Late Arrivals </CardTitle>
                    <CardDescription className="text-xs text-gray-500">{"67"}</CardDescription>
                    <CardDescription>{"3.1% of total days"}</CardDescription>
                  </div>

                  {/* cards holidays */}
                  <div className='flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition'>
                    <CardTitle className="text-sm font-medium">Holidays</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{98}</CardDescription>
                    <CardDescription>{"4.6% of total days"}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* tabs contenct 2 */}
          <div className='grid grid-cols-1 p-3 border rounded-lg w-full overflow-x-auto'>
            <Tabs.Content value="tab1" className="">

              {/* monthly attendance table  */}
              <Table >
                <TableHeader>
                  <TableRow className='bg-gray-100 text-xs '>
                    <TableHead className="" >#</TableHead>
                    <TableHead className="">Employee</TableHead>
                    <TableHead className="">Department</TableHead>
                    <TableHead className="">Emp Status</TableHead>

                    {currentData.map((item) => (
                      <TableHead key={item.id} className="text-xs ">
                        {item.date}
                        <span className='flex text-xs flex-col'> {item.day}</span>
                      </TableHead>
                    ))}

                  </TableRow>
                </TableHeader>

                <TableBody className='border-b'>
                  {currentData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.Employee}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.EmpStatus}</TableCell>
                      <TableCell className={`rounded-2xl  shadow text-center ${item.status === 'P' ? 'bg-green-100' : 'bg-red-100'} ${item.status === 'WO' ? 'bg-zinc-400' : ''} `}>{item.status}</TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

              {/* pagination */}
              <div className="flex items-center justify-between mt-4" >
                <p className="text-xs text-gray-500">
                  Showing {startIndex + 1} - {startIndex + currentData.length} of {tableDate.length} employees
                </p>
                <Pagination>
                  <PaginationContent >


                    {/* previous */}
                    <PaginationPrevious
                      href='#'
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                    {/* pages number */}
                    {Array.from({ length: visiblePages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href='#'
                          isActive={index + 1 === currentPage}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* next */}
                    <PaginationItem>
                      <PaginationNext
                        href='#'
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(prev => Math.min(prev + 1, visiblePages))
                        }}
                      />

                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

            </Tabs.Content>
          </div>
        </Tabs.Root>
        <AppSidebar />
      </main>
    </SidebarProvider>
  )
}

export default MonthlyAttendance
