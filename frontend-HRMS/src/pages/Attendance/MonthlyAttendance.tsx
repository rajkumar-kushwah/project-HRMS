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
import { getMonthlyAttendance } from '@/controllers/monthlyAttendance.controller'



interface Attendance {
  id: number;
  date: string; // ISO string from backend
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  overtime?: number;
  status: string; // P, A, Late, WO etc.
  EmpStatus: string;
  user?: {
    id: number;
    name?: string;
    email?: string;

    employee?: {
      id: number;
      firstName: string;
      lastName: string;
      isActive: boolean;

      department?: {
        id: number;
        name: string;
      };
    };
  };
}
function MonthlyAttendance() {


  const [currentPage, setCurrentPage] = React.useState(1);
  const [open, setOpen] = React.useState(false)
  const [monthlyData, setMonthlyData] = React.useState<Attendance[]>([])
  const [selectMonth, setSelectMonth] = React.useState(new Date().getMonth() + 1);
  const [selectYear, setSelectYear] = React.useState(new Date().getFullYear());

  // calendar month and year
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // select month droup
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    year: currentYear,
    value: `${index + 1}-${currentYear}`,
    label: new Date(currentYear, index).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
  }))

  const fetchMonthlyAttendance = async () => {
    try {
      const res = await getMonthlyAttendance(selectMonth, selectYear);
      // const calendar = generateMonthDays(currentMonth, currentYear);
      // const merged = margeAttendance(calendar, res.data.data);
      setMonthlyData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectMonth, selectYear]);





  const generateDays = (month: number, year: number) => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      const date = new Date(year, month - 1, dayNumber);

      const isSunday = date.getDay() === 0;

      let status = "-";

      //  ONLY past + today allowed
      const isPastOrToday =
        year < currentYear ||
        (year === currentYear && month < currentMonth) ||
        (year === currentYear && month === currentMonth && dayNumber <= currentDate);

      if (isPastOrToday) {
        if (isSunday) {
          status = "WO";
        } else if (dayNumber < currentDate) {
          status = "A";
        } else {
          status = "P"; // today default (or Late if API says)
        }
      } else {
        status = "-"; // FUTURE FIX HERE 
      }

      return {
        day: dayNumber,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        status,
        isSunday,
      };
    });
  };

  const days = generateDays(selectMonth, selectYear);

  const attendanceMap = monthlyData.reduce((acc: any, item) => {
    const empId = item.user?.employee?.id;
    if (!empId) return acc;

    if (!acc[empId]) acc[empId] = {};

    const day = new Date(item.date).getDate();
    acc[empId][day] = item.status;

    return acc;
  }, {});

  // employee list for filter
  const employees = Array.from(
    new Map(
      monthlyData
        .filter(i => i.user?.employee)
        .map(i => [i.user!.employee!.id, i.user!.employee!])
    ).values()
  );

  // color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "P":
        return "bg-green-100";
      case "WO":
        return "bg-gray-200";
      case "Late":
        return "bg-yellow-100";
      case "A":
        return "bg-red-100";
      default:
        return "bg-transparent"; // "-" future days
    }
  };

  //  get final status
  const getFinalStatus = (empId: number, day: any) => {
    const today = new Date();

    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const apiStatus = attendanceMap?.[empId]?.[day.day];

    const isFuture =
      selectYear > currentYear ||
      (selectYear === currentYear &&
        selectMonth > currentMonth) ||
      (selectYear === currentYear &&
        selectMonth === currentMonth &&
        day.day > currentDate);

    if (isFuture) return "-";

    if (day.label === "Sun") return "WO";

    return apiStatus || "A";
  };

  const rowperPage = 7
  const startIndex = (currentPage - 1) * rowperPage;
  // const endIndex = startIndex + rowperPage;

  const currentData = monthlyData.slice(startIndex, startIndex + rowperPage);

  const totalPage = Math.ceil(monthlyData.length / rowperPage)
  // const visiblePages = Math.max(totalPage, 5)


  // cards updates summery calculations

  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLateArrivals = 0;
  let totalWorkOff = 0;

  employees.forEach((emp) => {
    days.forEach((day) => {
      const status = getFinalStatus(emp.id, day);

      if (status === "P") totalPresent++;
      if (status === "A") totalAbsent++;
      if (status === "Late") totalLateArrivals++;
      if (status === "WO") totalWorkOff++;
    })
  })

  const totalDays = employees.length * days.length

  // const totalPresent = monthlyData.filter((item) => item.status === "P").length;
  // const totalAbsent = monthlyData.filter((item) => item.status === "A").length;
  // const totalLateArrivals = monthlyData.filter((item) => item.user && item.status === "P").length;
  // const totalWorkOff = monthlyData.filter((item) => item.status === "WO").length;

  // percentage
  // const totalDays = monthlyData.length;

  const totalPresentPercentage = ((totalPresent / totalDays) * 100).toFixed(2);
  const totalAbsentPercentage = ((totalAbsent / totalDays) * 100).toFixed(2);
  const totalLateArrivalsPercentage = ((totalLateArrivals / totalDays) * 100).toFixed(2);
  const totalWorkOffPercentage = ((totalWorkOff / totalDays) * 100).toFixed(2);


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
                    <Select.Root open={open} onOpenChange={setOpen} onValueChange={(value) => {
                      const [month, year] = value.split("-");
                      setSelectMonth(Number(month));
                      setSelectYear(Number(year));
                    }} >
                      <Select.Trigger className="w-full border  rounded px-2 py-1 text-xs flex justify-between items-center gap-2">
                        <Calendar className='w-4 h-4' />
                        <Select.Value placeholder="Select a month" />
                        <ChevronDown className={`w-4 h-4 opacity-50 ${open && "rotate-180"}`} />

                      </Select.Trigger>

                      <Select.Content position='popper' sideOffset={4} className="w-(--radix-select-trigger-width) z-50 bg-white rounded shadow border data-[state=open]:animate-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ">
                        {monthOptions.map((month) => (
                          <Select.Item key={month.value} value={String(month.value)} className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 w-full">
                            <Select.ItemText>{month.label}</Select.ItemText>
                          </Select.Item>
                        ))}

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

                  {/* Actions buttons */}
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
                    <CardDescription className="text-lg font-semibold text-black">{totalPresent}</CardDescription>
                    <CardDescription className="text-xs text-gray-500">{totalPresentPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards total absent */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2hover:shadow-md transition p-2 hover:shadow-md ">
                    <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{totalAbsent}</CardDescription>
                    <CardDescription>{totalAbsentPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards late arrival */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition ">
                    <CardTitle className="text-sm font-medium">Late Arrivals </CardTitle>
                    <CardDescription className="text-xs text-gray-500">{totalLateArrivals}</CardDescription>
                    <CardDescription>{totalLateArrivalsPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards holidays */}
                  <div className='flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition'>
                    <CardTitle className="text-sm font-medium">WeekOff</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{totalWorkOff}</CardDescription>
                    <CardDescription>{totalWorkOffPercentage}% of total days</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* tabs contenct 2 */}
          <div className='grid grid-cols-1 p-3 border rounded-lg w-full overflow-x-auto'>
            <Tabs.Content value="tab1" className="">

              {/* monthly attendance table  */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-xs">
                    <TableHead>#</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Emp Status</TableHead>

                    {days.map((item, index) => (
                      <TableHead key={index} className="text-xs">

                        <span className="flex text-xs flex-col">
                          {item.day} {item.label}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* <TableBody>
                  {monthlyData.filter((item) => item.user).map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        {item.user?.employee?.firstName}{" "}
                        {item.user?.employee?.lastName}
                      </TableCell>

                      <TableCell>
                        {item.user?.employee?.department?.name}
                      </TableCell>

                      <TableCell>  {item.user?.employee?.isActive ? "Active" : "Inactive"}</TableCell>

                      {currentData.map((dayItem) => (
                        <TableCell
                          key={dayItem.date}
                          className={`text-center rounded-xl ${dayItem.status === "P" ? "bg-green-100" : dayItem.status === "WO"
                            ? "bg-gray-200"
                            : "bg-red-100"
                            }
                           `}
                        >
                          {dayItem.status}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody> */}

                <TableBody>
                  {employees.map((emp, index) => (
                    <TableRow key={emp.id}>

                      {/* row number */}
                      <TableCell>{index + 1}</TableCell>

                      {/* name */}
                      <TableCell>
                        {emp.firstName} {emp.lastName}
                      </TableCell>

                      {/* department */}
                      <TableCell>{emp.department?.name}</TableCell>

                      {/* status */}
                      <TableCell>
                        {emp.isActive ? "Active" : "Inactive"}
                      </TableCell>

                      {/* DAYS LOOP (IMPORTANT FIX) */}
                      {days.map((day, i) => {
                        const finalStatus = getFinalStatus(emp.id, day);

                        return (
                          <TableCell
                            key={i}
                            className={`text-center rounded-full text-xs py-0 px-2  ${getStatusColor(finalStatus)}`}
                          >
                            {finalStatus === "-" ? "" : finalStatus}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* pagination */}
              <div className="flex  items-center justify-between mt-4 px-2 " >
                <p className="text-xs text-gray-500">
                  Showing {startIndex + 1} - {startIndex + currentData.length} of {monthlyData.length} employees
                </p>

                <div className='ml-auto'>
                <Pagination>
                  <PaginationContent >

                    {/* previous */}
                    <PaginationPrevious
                      href='#'
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                    {/* pages number */}
                    {Array.from({ length: totalPage }).map((_, index) => (
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
                          setCurrentPage(prev => Math.min(prev + 1, totalPage))
                        }}
                      />

                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                </div>
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
